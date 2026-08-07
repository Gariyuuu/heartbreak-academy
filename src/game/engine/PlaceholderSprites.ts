import Phaser from "phaser";
import { FACE_PALETTES, PALETTE } from "./palette";

export type TokenShape =
  | "circle"
  | "diamond"
  | "star"
  | "cloud"
  | "soft-square"
  | "leaf"
  | "inkblot"
  | "gear"
  | "petal"
  | "shard"
  | "glitch"
  | "mask"
  | "ring";

const SHAPE_BY_CHARACTER: Record<string, TokenShape> = {
  player: "circle",
  akari: "diamond",
  mika: "star",
  sleepy_upperclassman: "soft-square",
  yuna: "leaf",
  stray_thought: "cloud",
  runaway_metaphor: "inkblot",
  sora: "gear",
  nana: "petal",
  stray_equation: "shard",
  glitch_sprite: "glitch",
  reina: "mask",
  flicker: "star",
  reflection: "diamond",
  kaede: "leaf",
  the_accumulation: "ring",
};

const SIZE = 40;
const R = SIZE / 2;

function drawShape(g: Phaser.GameObjects.Graphics, shape: TokenShape, body: number, accent: number) {
  g.clear();
  g.fillStyle(0x000000, 0.18);
  g.fillEllipse(R, SIZE - 6, R * 1.1, 8);

  g.fillStyle(body, 1);
  g.lineStyle(3, accent, 1);

  switch (shape) {
    case "circle":
      g.fillCircle(R, R - 2, R - 6);
      g.strokeCircle(R, R - 2, R - 6);
      break;
    case "diamond": {
      const cx = R;
      const cy = R - 2;
      const s = R - 6;
      g.beginPath();
      g.moveTo(cx, cy - s);
      g.lineTo(cx + s, cy);
      g.lineTo(cx, cy + s);
      g.lineTo(cx - s, cy);
      g.closePath();
      g.fillPath();
      g.strokePath();
      break;
    }
    case "star": {
      const cx = R;
      const cy = R - 2;
      const spikes = 5;
      const outer = R - 5;
      const inner = outer * 0.5;
      const points: number[] = [];
      for (let i = 0; i < spikes * 2; i++) {
        const radius = i % 2 === 0 ? outer : inner;
        const angle = (Math.PI / spikes) * i - Math.PI / 2;
        points.push(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius);
      }
      g.beginPath();
      g.moveTo(points[0], points[1]);
      for (let i = 2; i < points.length; i += 2) g.lineTo(points[i], points[i + 1]);
      g.closePath();
      g.fillPath();
      g.strokePath();
      break;
    }
    case "cloud": {
      const cy = R - 2;
      g.fillCircle(R - 8, cy + 2, 10);
      g.fillCircle(R + 8, cy + 2, 10);
      g.fillCircle(R, cy - 6, 12);
      g.strokeCircle(R - 8, cy + 2, 10);
      g.strokeCircle(R + 8, cy + 2, 10);
      g.strokeCircle(R, cy - 6, 12);
      break;
    }
    case "soft-square": {
      const s = R - 6;
      g.fillRoundedRect(R - s, R - 2 - s, s * 2, s * 2, 8);
      g.strokeRoundedRect(R - s, R - 2 - s, s * 2, s * 2, 8);
      break;
    }
    case "leaf": {
      const cx = R;
      const cy = R - 2;
      const s = R - 6;
      g.beginPath();
      g.moveTo(cx, cy - s);
      g.lineTo(cx + s * 0.85, cy);
      g.lineTo(cx, cy + s);
      g.lineTo(cx - s * 0.55, cy - s * 0.15);
      g.closePath();
      g.fillPath();
      g.strokePath();
      break;
    }
    case "inkblot": {
      const cx = R;
      const cy = R - 2;
      g.beginPath();
      g.moveTo(cx - 10, cy - 4);
      g.lineTo(cx - 4, cy - 12);
      g.lineTo(cx + 6, cy - 10);
      g.lineTo(cx + 12, cy - 1);
      g.lineTo(cx + 7, cy + 10);
      g.lineTo(cx - 2, cy + 13);
      g.lineTo(cx - 11, cy + 6);
      g.closePath();
      g.fillPath();
      g.strokePath();
      break;
    }
    case "gear": {
      const cx = R;
      const cy = R - 2;
      const teeth = 8;
      const outer = R - 5;
      const inner = outer * 0.72;
      const points: number[] = [];
      for (let i = 0; i < teeth * 2; i++) {
        const radius = i % 2 === 0 ? outer : inner;
        const angle = (Math.PI / teeth) * i;
        points.push(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius);
      }
      g.beginPath();
      g.moveTo(points[0], points[1]);
      for (let i = 2; i < points.length; i += 2) g.lineTo(points[i], points[i + 1]);
      g.closePath();
      g.fillPath();
      g.strokePath();
      g.fillStyle(accent, 1);
      g.fillCircle(cx, cy, inner * 0.4);
      g.fillStyle(body, 1);
      break;
    }
    case "petal": {
      const cx = R;
      const cy = R - 2;
      const s = R - 7;
      for (let i = 0; i < 4; i++) {
        const angle = (Math.PI / 2) * i + Math.PI / 4;
        const px = cx + Math.cos(angle) * s * 0.6;
        const py = cy + Math.sin(angle) * s * 0.6;
        g.fillEllipse(px, py, s * 0.9, s * 0.55);
      }
      g.fillCircle(cx, cy, s * 0.35);
      break;
    }
    case "shard": {
      const cx = R;
      const cy = R - 2;
      const s = R - 6;
      g.beginPath();
      g.moveTo(cx, cy - s);
      g.lineTo(cx + s * 0.6, cy - s * 0.1);
      g.lineTo(cx + s * 0.3, cy + s);
      g.lineTo(cx - s * 0.5, cy + s * 0.6);
      g.lineTo(cx - s * 0.65, cy - s * 0.2);
      g.closePath();
      g.fillPath();
      g.strokePath();
      break;
    }
    case "glitch": {
      const s = R - 8;
      // three offset blocky rectangles, like a sprite mid-corruption
      g.fillRect(R - s, R - 2 - s, s * 1.6, s * 1.6);
      g.strokeRect(R - s, R - 2 - s, s * 1.6, s * 1.6);
      g.fillStyle(accent, 0.55);
      g.fillRect(R - s + 4, R - 2 - s - 3, s * 1.6, 5);
      g.fillRect(R - s - 3, R - 2, 5, s * 0.8);
      g.fillStyle(body, 1);
      break;
    }
    case "mask": {
      const cx = R;
      const cy = R - 2;
      g.fillEllipse(cx, cy, (R - 6) * 2, (R - 4) * 2);
      g.strokeEllipse(cx, cy, (R - 6) * 2, (R - 4) * 2);
      break;
    }
    case "ring": {
      const cx = R;
      const cy = R - 2;
      g.fillCircle(cx, cy, R - 6);
      g.strokeCircle(cx, cy, R - 6);
      g.lineStyle(2, accent, 0.8);
      g.strokeCircle(cx, cy, R - 12);
      g.strokeCircle(cx, cy, R - 18);
      g.fillStyle(accent, 1);
      g.fillCircle(cx, cy, 4);
      g.fillStyle(body, 1);
      break;
    }
  }

  // simple face: two eyes, gives every token a "someone's home" quality
  g.fillStyle(accent, 1);
  g.fillCircle(R - 6, R - 4, 2.5);
  g.fillCircle(R + 6, R - 4, 2.5);
}

export function ensureCharacterTexture(scene: Phaser.Scene, characterId: string): string {
  const key = `token:${characterId}`;
  if (scene.textures.exists(key)) return key;
  const palette = FACE_PALETTES[characterId] ?? { body: 0x999999, accent: 0xffffff };
  const shape = SHAPE_BY_CHARACTER[characterId] ?? "circle";
  const g = scene.add.graphics();
  drawShape(g, shape, palette.body, palette.accent);
  g.generateTexture(key, SIZE, SIZE);
  g.destroy();
  return key;
}

export function ensureFacingArrowTexture(scene: Phaser.Scene): string {
  const key = "facing-arrow";
  if (scene.textures.exists(key)) return key;
  const g = scene.add.graphics();
  g.fillStyle(0x2b1f38, 0.85);
  g.beginPath();
  g.moveTo(6, 0);
  g.lineTo(-6, -5);
  g.lineTo(-6, 5);
  g.closePath();
  g.fillPath();
  g.generateTexture(key, 12, 10);
  g.destroy();
  return key;
}

export function ensureInteractableTexture(scene: Phaser.Scene, kind: string): string {
  const key = `interact:${kind}`;
  if (scene.textures.exists(key)) return key;
  const g = scene.add.graphics();
  const colors: Record<string, number> = {
    // kept visually distinct from savePoint's warm gold-yellow glow
    noticeboard: 0xa8734a,
    puzzle: 0x5c8ed8,
    savePoint: PALETTE.savePointGlow,
    bossStage: 0xe86a92,
    sign: 0xa89bc9,
    door: PALETTE.door,
  };
  const color = colors[kind] ?? 0xcccccc;
  g.fillStyle(color, 1);
  g.lineStyle(2, 0x2b1f38, 0.6);
  g.fillRoundedRect(2, 2, 24, 24, 6);
  g.strokeRoundedRect(2, 2, 24, 24, 6);
  g.generateTexture(key, 28, 28);
  g.destroy();
  return key;
}
