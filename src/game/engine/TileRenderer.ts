import Phaser from "phaser";
import { BLOCKING_TILES, type MapDefinition } from "../maps/types";
import { MAP_THEMES, type RegionTheme } from "./palette";

function ensureTileTexture(scene: Phaser.Scene, key: string, draw: (g: Phaser.GameObjects.Graphics, size: number) => void, size: number) {
  if (scene.textures.exists(key)) return key;
  const g = scene.add.graphics();
  draw(g, size);
  g.generateTexture(key, size, size);
  g.destroy();
  return key;
}

function tileTextureKey(
  scene: Phaser.Scene,
  char: string,
  size: number,
  variant: number,
  themeId: string,
  theme: RegionTheme,
): string {
  const key = `tile:${themeId}:${char}:${size}:${variant}`;
  return ensureTileTexture(
    scene,
    key,
    (g) => {
      switch (char) {
        case "#":
          g.fillStyle(theme.wall, 1);
          g.fillRect(0, 0, size, size);
          g.fillStyle(theme.wallShadow, 1);
          g.fillRect(0, size - 6, size, 6);
          break;
        case "L":
          g.fillStyle(theme.floor, 1);
          g.fillRect(0, 0, size, size);
          g.fillStyle(theme.decorPrimary, 1);
          g.fillRect(4, 2, size - 8, size - 8);
          g.lineStyle(2, 0x2b1f38, 0.4);
          g.strokeRect(4, 2, size - 8, size - 8);
          break;
        case "A":
          g.fillStyle(theme.floor, 1);
          g.fillRect(0, 0, size, size);
          g.fillStyle(theme.decorSecondary, 1);
          g.fillRoundedRect(3, 1, size - 6, size - 6, 5);
          break;
        case "D":
          g.fillStyle(theme.door, 1);
          g.fillRect(0, 0, size, size);
          g.lineStyle(2, 0x2b1f38, 0.5);
          g.strokeRect(2, 2, size - 4, size - 4);
          break;
        default: {
          const light = variant % 2 === 0;
          g.fillStyle(light ? theme.floor : theme.floorAccent, 1);
          g.fillRect(0, 0, size, size);
        }
      }
    },
    size,
  );
}

export interface CollisionGrid {
  tileSize: number;
  cols: number;
  rows: number;
  isBlockedTile: (col: number, row: number) => boolean;
  rectBlocked: (x: number, y: number, w: number, h: number) => boolean;
}

export function renderMap(scene: Phaser.Scene, map: MapDefinition): CollisionGrid {
  const { tileSize, grid } = map;
  const rows = grid.length;
  const cols = grid[0].length;
  const themeId = map.theme ?? "academy";
  const theme = MAP_THEMES[themeId] ?? MAP_THEMES.academy;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const char = grid[row][col];
      const variant = (row * 7 + col * 13) % 2;
      const key = tileTextureKey(scene, char, tileSize, variant, themeId, theme);
      scene.add
        .image(col * tileSize + tileSize / 2, row * tileSize + tileSize / 2, key)
        .setDepth(0);
    }
  }

  function isBlockedTile(col: number, row: number): boolean {
    if (row < 0 || row >= rows || col < 0 || col >= cols) return true;
    const char = grid[row][col] as (typeof grid)[number][number];
    return BLOCKING_TILES.has(char as never);
  }

  function rectBlocked(x: number, y: number, w: number, h: number): boolean {
    const left = Math.floor((x - w / 2) / tileSize);
    const right = Math.floor((x + w / 2) / tileSize);
    const top = Math.floor((y - h / 2) / tileSize);
    const bottom = Math.floor((y + h / 2) / tileSize);
    for (let r = top; r <= bottom; r++) {
      for (let c = left; c <= right; c++) {
        if (isBlockedTile(c, r)) return true;
      }
    }
    return false;
  }

  return { tileSize, cols, rows, isBlockedTile, rectBlocked };
}
