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

export type Hairstyle = "short" | "long" | "twin-tails" | "undercut" | "ponytail" | "bangs";
export type UniformVariant = "standard" | "cardigan" | "blazer" | "open-collar";

// Character-creation stores these as display labels ("Twin-tails",
// "Casual Cardigan") since that's what the UI shows; normalize to the
// internal keys the sprite drawer understands.
export function normalizeHairstyle(label: string): Hairstyle {
  const l = label.toLowerCase();
  if (l.includes("long")) return "long";
  if (l.includes("twin")) return "twin-tails";
  if (l.includes("undercut")) return "undercut";
  if (l.includes("ponytail")) return "ponytail";
  if (l.includes("bangs")) return "bangs";
  return "short";
}
export function normalizeUniform(label: string): UniformVariant {
  const l = label.toLowerCase();
  if (l.includes("cardigan")) return "cardigan";
  if (l.includes("blazer")) return "blazer";
  if (l.includes("open")) return "open-collar";
  return "standard";
}

// Every human character (the player, and any named NPC who isn't an
// abstract anomaly/monster) is drawn as a head+torso humanoid instead of
// a single flat primitive — a bare circle or star reads as a token, not a
// person. Monsters/anomalies keep the abstract TokenShape system below;
// it's thematically correct for them (a "Stray Thought" *should* look
// like a drifting shape, not a person) and was never the complaint.
const HUMAN_CHARACTERS: Record<string, { hairstyle: Hairstyle; uniform: UniformVariant; badge: TokenShape | null }> =
  {
    akari: { hairstyle: "long", uniform: "blazer", badge: "diamond" },
    mika: { hairstyle: "twin-tails", uniform: "cardigan", badge: "star" },
    sleepy_upperclassman: { hairstyle: "short", uniform: "standard", badge: null },
    yuna: { hairstyle: "short", uniform: "cardigan", badge: "leaf" },
    sora: { hairstyle: "undercut", uniform: "standard", badge: "gear" },
    nana: { hairstyle: "long", uniform: "cardigan", badge: "petal" },
    reina: { hairstyle: "short", uniform: "blazer", badge: "mask" },
    kaede: { hairstyle: "long", uniform: "standard", badge: null },
  };

// Monsters/anomalies — abstract shapes, not humanoid.
const SHAPE_BY_CHARACTER: Record<string, TokenShape> = {
  stray_thought: "cloud",
  runaway_metaphor: "inkblot",
  stray_equation: "shard",
  glitch_sprite: "glitch",
  flicker: "star",
  reflection: "diamond",
  the_accumulation: "ring",
};

const SIZE = 40;
const R = SIZE / 2;
const HEAD_CX = R;
const HEAD_CY = R - 9;
const HEAD_R = 8;

function drawHairstyle(g: Phaser.GameObjects.Graphics, style: Hairstyle, accent: number) {
  g.fillStyle(accent, 1);
  switch (style) {
    case "short":
      // a simple cap over the top half of the head
      g.beginPath();
      g.arc(HEAD_CX, HEAD_CY, HEAD_R + 1.5, Math.PI, 0, false);
      g.closePath();
      g.fillPath();
      break;
    case "long":
      // cap on top, plus two shapes flowing down past the shoulders
      g.beginPath();
      g.arc(HEAD_CX, HEAD_CY, HEAD_R + 1.5, Math.PI, 0, false);
      g.closePath();
      g.fillPath();
      g.fillRoundedRect(HEAD_CX - HEAD_R - 3, HEAD_CY - 2, 5, 20, 2.5);
      g.fillRoundedRect(HEAD_CX + HEAD_R - 2, HEAD_CY - 2, 5, 20, 2.5);
      break;
    case "twin-tails":
      g.beginPath();
      g.arc(HEAD_CX, HEAD_CY, HEAD_R + 1, Math.PI, 0, false);
      g.closePath();
      g.fillPath();
      g.fillEllipse(HEAD_CX - HEAD_R - 2, HEAD_CY + 4, 6, 10);
      g.fillEllipse(HEAD_CX + HEAD_R + 2, HEAD_CY + 4, 6, 10);
      break;
    case "undercut":
      // asymmetric angular wedge — sharp on one side, close-cropped
      g.beginPath();
      g.moveTo(HEAD_CX - HEAD_R, HEAD_CY - 1);
      g.lineTo(HEAD_CX - 2, HEAD_CY - HEAD_R - 3);
      g.lineTo(HEAD_CX + HEAD_R + 1, HEAD_CY - 3);
      g.lineTo(HEAD_CX + HEAD_R - 2, HEAD_CY + 2);
      g.lineTo(HEAD_CX - HEAD_R + 1, HEAD_CY + 3);
      g.closePath();
      g.fillPath();
      break;
    case "ponytail":
      // cap on top, plus a single tail trailing off to one side — reads
      // distinctly from twin-tails' two symmetric side pieces
      g.beginPath();
      g.arc(HEAD_CX, HEAD_CY, HEAD_R + 1.5, Math.PI, 0, false);
      g.closePath();
      g.fillPath();
      g.fillRoundedRect(HEAD_CX + HEAD_R - 1, HEAD_CY - 4, 5, 22, 2.5);
      break;
    case "bangs":
      // a fuller, rounder cap (bob-length) instead of the half-cap
      // "short" uses — covers more of the head, no side pieces
      g.beginPath();
      g.arc(HEAD_CX, HEAD_CY, HEAD_R + 2.5, Math.PI * 0.9, Math.PI * 0.1, false);
      g.closePath();
      g.fillPath();
      break;
  }
}

function drawUniformTrim(g: Phaser.GameObjects.Graphics, uniform: UniformVariant, accent: number, torsoTop: number, torsoBottom: number, torsoW: number) {
  g.lineStyle(2, accent, 0.85);
  switch (uniform) {
    case "cardigan":
      // open V down the front
      g.beginPath();
      g.moveTo(R - 3, torsoTop + 2);
      g.lineTo(R, torsoTop + 7);
      g.lineTo(R + 3, torsoTop + 2);
      g.strokePath();
      g.lineTo(R, torsoBottom - 2);
      break;
    case "blazer":
      // sharp shoulder line
      g.beginPath();
      g.moveTo(R - torsoW / 2, torsoTop + 3);
      g.lineTo(R - 3, torsoTop);
      g.lineTo(R + 3, torsoTop);
      g.lineTo(R + torsoW / 2, torsoTop + 3);
      g.strokePath();
      break;
    case "standard":
      // small centered collar mark
      g.strokeCircle(R, torsoTop + 3, 2);
      break;
    case "open-collar":
      // two loose diagonal lines, unbuttoned at the top
      g.beginPath();
      g.moveTo(R - 4, torsoTop);
      g.lineTo(R - 1, torsoTop + 6);
      g.strokePath();
      g.beginPath();
      g.moveTo(R + 4, torsoTop);
      g.lineTo(R + 1, torsoTop + 6);
      g.strokePath();
      break;
  }
}

function drawHumanoid(
  g: Phaser.GameObjects.Graphics,
  body: number,
  accent: number,
  hairstyle: Hairstyle,
  uniform: UniformVariant,
  badge: TokenShape | null,
) {
  g.clear();
  g.fillStyle(0x000000, 0.18);
  g.fillEllipse(R, SIZE - 6, R * 1.1, 8);

  const torsoW = 17;
  const torsoTop = HEAD_CY + HEAD_R - 1;
  const torsoBottom = SIZE - 8;

  // torso
  g.fillStyle(body, 1);
  g.lineStyle(2.5, accent, 1);
  g.fillRoundedRect(R - torsoW / 2, torsoTop, torsoW, torsoBottom - torsoTop, 6);
  g.strokeRoundedRect(R - torsoW / 2, torsoTop, torsoW, torsoBottom - torsoTop, 6);
  drawUniformTrim(g, uniform, accent, torsoTop, torsoBottom, torsoW);

  // head (drawn after torso so it sits on top, before hair)
  g.fillStyle(body, 1);
  g.lineStyle(2.5, accent, 1);
  g.fillCircle(HEAD_CX, HEAD_CY, HEAD_R);
  g.strokeCircle(HEAD_CX, HEAD_CY, HEAD_R);

  drawHairstyle(g, hairstyle, accent);

  // face
  g.fillStyle(accent, 1);
  g.fillCircle(HEAD_CX - 3, HEAD_CY + 1, 1.6);
  g.fillCircle(HEAD_CX + 3, HEAD_CY + 1, 1.6);

  // badge — a small version of the character's old signature shape,
  // kept as a recognizable accessory instead of being the whole body
  if (badge) {
    const bx = R + torsoW / 2 - 1;
    const by = torsoBottom - 5;
    g.fillStyle(accent, 1);
    g.fillCircle(bx, by, 4);
    g.fillStyle(body, 1);
    g.fillCircle(bx, by, 2.2);
  }
}

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
      // wispy trailing detail so it isn't just three flat circles
      g.lineStyle(1.5, accent, 0.55);
      g.beginPath();
      g.moveTo(R - 14, cy + 8);
      g.lineTo(R - 20, cy + 12);
      g.strokePath();
      g.beginPath();
      g.moveTo(R + 14, cy + 6);
      g.lineTo(R + 19, cy + 10);
      g.strokePath();
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
      // interior facet lines so it reads as a broken crystal, not a blob
      g.lineStyle(1, accent, 0.5);
      g.beginPath();
      g.moveTo(cx, cy - s * 0.6);
      g.lineTo(cx, cy + s * 0.6);
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
      // brow line detail so the mask reads as a face, not an oval
      g.lineStyle(1.5, accent, 0.6);
      g.beginPath();
      g.moveTo(cx - 6, cy - 5);
      g.lineTo(cx + 6, cy - 5);
      g.strokePath();
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

  // uniform glossy highlight — a small light patch, top-left, on every
  // abstract monster shape. Cheap and shape-agnostic, but it's the
  // difference between "flat colored icon" and "something with a surface."
  g.fillStyle(0xffffff, 0.25);
  g.fillEllipse(R - 5, R - 11, 6, 4);

  // simple face: two eyes, gives every token a "someone's home" quality
  g.fillStyle(accent, 1);
  g.fillCircle(R - 6, R - 4, 2.5);
  g.fillCircle(R + 6, R - 4, 2.5);
}

export interface PlayerAppearanceInput {
  hairstyle: string;
  uniformVariant: string;
}

export function ensureCharacterTexture(
  scene: Phaser.Scene,
  characterId: string,
  appearance?: PlayerAppearanceInput,
): string {
  const human = HUMAN_CHARACTERS[characterId];
  const isPlayer = characterId === "player";

  if (human || isPlayer) {
    const hairstyle = isPlayer && appearance ? normalizeHairstyle(appearance.hairstyle) : (human?.hairstyle ?? "short");
    const uniform = isPlayer && appearance ? normalizeUniform(appearance.uniformVariant) : (human?.uniform ?? "standard");
    const badge = human?.badge ?? null;
    const key = isPlayer ? `token:player:${hairstyle}:${uniform}` : `token:${characterId}`;
    if (scene.textures.exists(key)) return key;
    const palette = FACE_PALETTES[characterId] ?? { body: 0x999999, accent: 0xffffff };
    const g = scene.add.graphics();
    drawHumanoid(g, palette.body, palette.accent, hairstyle, uniform, badge);
    g.generateTexture(key, SIZE, SIZE);
    g.destroy();
    return key;
  }

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
