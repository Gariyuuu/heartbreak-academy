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

// Deterministic pseudo-random in [0,1), seeded by tile position — flecks
// and seam offsets need to look scattered without actually being random
// (same tile position must always generate the same cached texture).
function hashRand(seed: number): number {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

function darken(color: number, amount: number): number {
  const r = Math.max(0, ((color >> 16) & 0xff) * (1 - amount));
  const g = Math.max(0, ((color >> 8) & 0xff) * (1 - amount));
  const b = Math.max(0, (color & 0xff) * (1 - amount));
  return (r << 16) | (g << 8) | b;
}

function lighten(color: number, amount: number): number {
  const r = Math.min(255, ((color >> 16) & 0xff) + (255 - ((color >> 16) & 0xff)) * amount);
  const g = Math.min(255, ((color >> 8) & 0xff) + (255 - ((color >> 8) & 0xff)) * amount);
  const b = Math.min(255, (color & 0xff) + (255 - (color & 0xff)) * amount);
  return (r << 16) | (g << 8) | b;
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
        case "#": {
          // paneled wall instead of a flat rect: vertical seams + a top
          // highlight and bottom shadow strip for real dimensionality
          g.fillStyle(theme.wall, 1);
          g.fillRect(0, 0, size, size);
          g.fillStyle(lighten(theme.wall, 0.14), 1);
          g.fillRect(0, 0, size, 3);
          g.lineStyle(1, darken(theme.wall, 0.25), 0.6);
          const seamX = size / 2 + (variant % 2 === 0 ? -1 : 1) * 2;
          g.beginPath();
          g.moveTo(seamX, 3);
          g.lineTo(seamX, size - 6);
          g.strokePath();
          g.fillStyle(theme.wallShadow, 1);
          g.fillRect(0, size - 6, size, 6);
          break;
        }
        case "L": {
          g.fillStyle(theme.floor, 1);
          g.fillRect(0, 0, size, size);
          const lx = 4;
          const ly = 2;
          const lw = size - 8;
          const lh = size - 8;
          g.fillStyle(theme.decorPrimary, 1);
          g.fillRect(lx, ly, lw, lh);
          // manual bevel (lighter top-left triangle, darker bottom-right)
          // instead of fillGradientStyle, which silently no-ops on fillRect
          g.fillStyle(lighten(theme.decorPrimary, 0.2), 0.6);
          g.beginPath();
          g.moveTo(lx, ly);
          g.lineTo(lx + lw, ly);
          g.lineTo(lx, ly + lh);
          g.closePath();
          g.fillPath();
          g.fillStyle(darken(theme.decorPrimary, 0.2), 0.5);
          g.beginPath();
          g.moveTo(lx + lw, ly);
          g.lineTo(lx + lw, ly + lh);
          g.lineTo(lx, ly + lh);
          g.closePath();
          g.fillPath();
          g.lineStyle(2, 0x2b1f38, 0.4);
          g.strokeRect(lx, ly, lw, lh);
          break;
        }
        case "A": {
          g.fillStyle(theme.floor, 1);
          g.fillRect(0, 0, size, size);
          const ax = 3;
          const ay = 1;
          const aw = size - 6;
          const ah = size - 6;
          g.fillStyle(theme.decorSecondary, 1);
          g.fillRoundedRect(ax, ay, aw, ah, 5);
          g.fillStyle(lighten(theme.decorSecondary, 0.2), 0.5);
          g.fillCircle(ax + aw * 0.32, ay + ah * 0.32, aw * 0.28);
          g.lineStyle(1.5, darken(theme.decorSecondary, 0.3), 0.5);
          g.strokeRoundedRect(ax, ay, aw, ah, 5);
          break;
        }
        case "D": {
          // a two-leaf door with a frame and handles, not a flat block
          g.fillStyle(darken(theme.door, 0.3), 1);
          g.fillRect(0, 0, size, size);
          g.fillStyle(theme.door, 1);
          g.fillRect(2, 2, size / 2 - 3, size - 4);
          g.fillRect(size / 2 + 1, 2, size / 2 - 3, size - 4);
          g.fillStyle(darken(theme.door, 0.35), 1);
          g.fillCircle(size / 2 - 5, size / 2, 1.4);
          g.fillCircle(size / 2 + 5, size / 2, 1.4);
          g.lineStyle(2, 0x2b1f38, 0.5);
          g.strokeRect(1, 1, size - 2, size - 2);
          break;
        }
        default: {
          // A strict alternating checkerboard is exactly what reads as
          // "grid block style" — most tiles now stay the base floor
          // color, with only a scattered ~1-in-5 getting the accent
          // shade, so the pattern looks like laid flooring instead of a
          // boardgame grid.
          const seed = variant * 97.13;
          const accented = hashRand(seed) > 0.8;
          const base = accented ? theme.floorAccent : theme.floor;
          g.fillStyle(base, 1);
          g.fillRect(0, 0, size, size);
          // faint grout seam so tiles read as laid pieces, not one flat plane
          g.lineStyle(1, darken(base, 0.06), 0.35);
          g.strokeRect(0, 0, size, size);
          // a couple of deterministic flecks per tile for grain, subtle
          // enough not to fight the character/decor sprites on top
          const fleckCount = 1 + Math.floor(hashRand(seed + 0.5) * 2);
          for (let i = 0; i < fleckCount; i++) {
            const fx = 4 + hashRand(seed + i * 3.1) * (size - 8);
            const fy = 4 + hashRand(seed + i * 7.7) * (size - 8);
            const fleckLighter = hashRand(seed + i * 1.3) > 0.5;
            g.fillStyle(fleckLighter ? lighten(base, 0.1) : darken(base, 0.08), 0.6);
            g.fillCircle(fx, fy, 0.9);
          }
        }
      }
    },
    size,
  );
}

// A soft directional shadow, cast onto floor tiles that sit next to a
// wall — one shared texture (theme/direction-independent), rotated per
// edge at placement time. This is what makes a room read as a room with
// walls around it instead of a flat plane with wall-colored tiles
// scattered on top.
function ensureEdgeShadowTexture(scene: Phaser.Scene, size: number): string {
  const key = `edge-shadow:${size}`;
  if (scene.textures.exists(key)) return key;
  const g = scene.add.graphics();
  const depthPx = Math.round(size * 0.4);
  for (let y = 0; y < depthPx; y++) {
    const alpha = 0.26 * (1 - y / depthPx);
    g.fillStyle(0x000000, alpha);
    g.fillRect(0, y, size, 1);
  }
  g.generateTexture(key, size, size);
  g.destroy();
  return key;
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

  const shadowKey = ensureEdgeShadowTexture(scene, tileSize);

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const char = grid[row][col];
      // floor tiles get a wider variant range (more distinct cached
      // textures) so the fleck/seam texture doesn't repeat in an obvious
      // 2-tile checkerboard; walls/decor/doors don't need as many.
      const variantRange = char === "." ? 24 : 2;
      const variant = (row * 7 + col * 13) % variantRange;
      const key = tileTextureKey(scene, char, tileSize, variant, themeId, theme);
      const px = col * tileSize + tileSize / 2;
      const py = row * tileSize + tileSize / 2;
      scene.add.image(px, py, key).setDepth(0);

      if (char === ".") {
        const isWall = (c: number, r: number) => (grid[r]?.[c] ?? "#") === "#";
        if (isWall(col, row - 1)) scene.add.image(px, py, shadowKey).setAngle(0).setDepth(0.5);
        if (isWall(col, row + 1)) scene.add.image(px, py, shadowKey).setAngle(180).setDepth(0.5);
        if (isWall(col - 1, row)) scene.add.image(px, py, shadowKey).setAngle(-90).setDepth(0.5);
        if (isWall(col + 1, row)) scene.add.image(px, py, shadowKey).setAngle(90).setDepth(0.5);
      }
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
