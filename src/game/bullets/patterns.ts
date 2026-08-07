import type { BulletPattern } from "./Pattern";
import { PALETTE } from "../engine/palette";
import { useSettingsStore } from "../state/settingsStore";

function speedScale(): number {
  return useSettingsStore.getState().bulletSpeedAssist ? 0.65 : 1;
}

/** Gentle falling "worry bubbles." Teaches basic dodging, low damage. */
export function createStrayThoughtWave(): BulletPattern {
  let sinceLastSpawn = 0;
  const interval = 520;
  return {
    id: "stray_thought_wave",
    reset() {
      sinceLastSpawn = 0;
    },
    tick({ deltaMs, arena, field }) {
      sinceLastSpawn += deltaMs;
      if (sinceLastSpawn >= interval) {
        sinceLastSpawn = 0;
        const x = arena.x + 20 + Math.random() * (arena.w - 40);
        const s = speedScale();
        field.spawn({
          x,
          y: arena.y - 10,
          vx: (Math.random() - 0.5) * 30 * s,
          vy: (95 + Math.random() * 30) * s,
          radius: 9,
          color: PALETTE.strayThought,
          damage: 2,
        });
      }
    },
  };
}

/** Escalation of stray_thought_wave: faster falling bubbles, and roughly
 * two in five spawns now drop a pair side by side instead of one — still
 * the same gentle drift, just more of it at once. */
export function createStrayThoughtFlood(): BulletPattern {
  let sinceLastSpawn = 0;
  const interval = 320;
  return {
    id: "stray_thought_flood",
    reset() {
      sinceLastSpawn = 0;
    },
    tick({ deltaMs, arena, field }) {
      sinceLastSpawn += deltaMs;
      if (sinceLastSpawn >= interval) {
        sinceLastSpawn = 0;
        const s = speedScale();
        const count = Math.random() < 0.4 ? 2 : 1;
        for (let i = 0; i < count; i++) {
          const x = arena.x + 20 + Math.random() * (arena.w - 40);
          field.spawn({
            x,
            y: arena.y - 10,
            vx: (Math.random() - 0.5) * 30 * s,
            vy: (105 + Math.random() * 35) * s,
            radius: 9,
            color: PALETTE.strayThought,
            damage: 2,
          });
        }
      }
    },
  };
}

/** Space-Invaders-style descending rows with a gap to dodge through. */
export function createArcadeGrid(): BulletPattern {
  let sinceLastSpawn = 0;
  const interval = 950;
  const columns = 7;
  return {
    id: "arcade_grid",
    reset() {
      sinceLastSpawn = 0;
    },
    tick({ deltaMs, arena, field }) {
      sinceLastSpawn += deltaMs;
      if (sinceLastSpawn >= interval) {
        sinceLastSpawn = 0;
        const gapIndex = Math.floor(Math.random() * columns);
        const spacing = arena.w / columns;
        const s = speedScale();
        for (let i = 0; i < columns; i++) {
          if (i === gapIndex) continue;
          field.spawn({
            x: arena.x + spacing * i + spacing / 2,
            y: arena.y - 10,
            vx: 0,
            vy: 130 * s,
            radius: 8,
            color: PALETTE.mika,
            damage: 3,
          });
        }
      }
    },
  };
}

/** Pong-inspired bouncing balls that fill the arena for the whole phase. */
export function createArcadeBounce(): BulletPattern {
  let spawned = false;
  return {
    id: "arcade_bounce",
    reset() {
      spawned = false;
    },
    tick({ arena, field }) {
      if (spawned) return;
      spawned = true;
      const count = 3;
      const s = speedScale();
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.6;
        field.spawn({
          x: arena.x + arena.w / 2,
          y: arena.y + arena.h / 2,
          vx: Math.cos(angle) * 170 * s,
          vy: Math.sin(angle) * 170 * s,
          radius: 11,
          color: PALETTE.mikaAccent,
          damage: 4,
          bounce: true,
          lifetimeMs: 999999,
        });
      }
    },
  };
}

/** Ink-blot bursts + drifting "loose letters" — a literature-themed pattern. */
export function createInkScatter(): BulletPattern {
  let sinceBurst = 0;
  let sinceLetter = 0;
  const burstInterval = 1500;
  const letterInterval = 380;
  let t = 0;
  return {
    id: "ink_scatter",
    reset() {
      sinceBurst = 0;
      sinceLetter = 0;
      t = 0;
    },
    tick({ deltaMs, arena, field }) {
      t += deltaMs;
      const s = speedScale();

      sinceBurst += deltaMs;
      if (sinceBurst >= burstInterval) {
        sinceBurst = 0;
        const originX = arena.x + 40 + Math.random() * (arena.w - 80);
        const dropletCount = 6;
        const spread = Math.PI * 0.55;
        const baseAngle = Math.PI / 2 - spread / 2;
        for (let i = 0; i < dropletCount; i++) {
          const angle = baseAngle + (spread * i) / (dropletCount - 1);
          field.spawn({
            x: originX,
            y: arena.y + 10,
            vx: Math.cos(angle) * 90 * s,
            vy: Math.sin(angle) * 90 * s,
            radius: 7,
            color: PALETTE.runawayMetaphor,
            damage: 2,
          });
        }
      }

      sinceLetter += deltaMs;
      if (sinceLetter >= letterInterval) {
        sinceLetter = 0;
        const x = arena.x + 16 + Math.random() * (arena.w - 32);
        field.spawn({
          x,
          y: arena.y - 8,
          vx: Math.sin(t / 300 + x) * 20 * s,
          vy: 70 * s,
          radius: 5,
          color: PALETTE.runawayMetaphorAccent,
          damage: 1,
        });
      }
    },
  };
}

/** Vertical laser walls sweeping sideways across the arena — a lab-themed
 * geometric pattern. Each "laser" is a column of small bullets spanning
 * the arena height with one gap segment, moving as one unit — always
 * dodgeable by finding the gap's row, never just "stand still and tank
 * it." */
export function createGeometricLasers(): BulletPattern {
  let sinceSweep = 0;
  const sweepInterval = 1300;
  const segments = 6;
  return {
    id: "geometric_lasers",
    reset() {
      sinceSweep = 0;
    },
    tick({ deltaMs, arena, field }) {
      sinceSweep += deltaMs;
      if (sinceSweep >= sweepInterval) {
        sinceSweep = 0;
        const s = speedScale();
        const fromLeft = Math.random() < 0.5;
        const x = fromLeft ? arena.x - 10 : arena.x + arena.w + 10;
        const vx = (fromLeft ? 1 : -1) * 150 * s;
        const spacing = arena.h / segments;
        const gapIndex = Math.floor(Math.random() * segments);
        for (let i = 0; i < segments; i++) {
          if (i === gapIndex) continue;
          field.spawn({
            x,
            y: arena.y + spacing * i + spacing / 2,
            vx,
            vy: 0,
            radius: 7,
            color: PALETTE.strayEquation,
            damage: 2,
          });
        }
      }
    },
  };
}

/** Escalation of geometric_lasers: a vertical wall and a horizontal wall
 * sweep at the same time, each with its own independent gap — still
 * always dodgeable by finding either gap, just requires tracking two axes
 * instead of one. */
export function createGeometricLasersCrossed(): BulletPattern {
  let sinceSweep = 0;
  const sweepInterval = 1100;
  const segments = 6;
  return {
    id: "geometric_lasers_crossed",
    reset() {
      sinceSweep = 0;
    },
    tick({ deltaMs, arena, field }) {
      sinceSweep += deltaMs;
      if (sinceSweep >= sweepInterval) {
        sinceSweep = 0;
        const s = speedScale();

        const fromLeft = Math.random() < 0.5;
        const vx = fromLeft ? arena.x - 10 : arena.x + arena.w + 10;
        const vvx = (fromLeft ? 1 : -1) * 150 * s;
        const vSpacing = arena.h / segments;
        const vGap = Math.floor(Math.random() * segments);
        for (let i = 0; i < segments; i++) {
          if (i === vGap) continue;
          field.spawn({
            x: vx,
            y: arena.y + vSpacing * i + vSpacing / 2,
            vx: vvx,
            vy: 0,
            radius: 7,
            color: PALETTE.strayEquation,
            damage: 2,
          });
        }

        const fromTop = Math.random() < 0.5;
        const hy = fromTop ? arena.y - 10 : arena.y + arena.h + 10;
        const hvy = (fromTop ? 1 : -1) * 150 * s;
        const hSpacing = arena.w / segments;
        const hGap = Math.floor(Math.random() * segments);
        for (let i = 0; i < segments; i++) {
          if (i === hGap) continue;
          field.spawn({
            x: arena.x + hSpacing * i + hSpacing / 2,
            y: hy,
            vx: 0,
            vy: hvy,
            radius: 7,
            color: PALETTE.strayEquation,
            damage: 2,
          });
        }
      }
    },
  };
}

/** Aimed shots from a random edge toward the heart's position at fire
 * time — a Galaga-style "predictive aim" pattern rather than continuous
 * homing (kept simple: BulletField gives every bullet a fixed velocity). */
export function createArcadeChase(): BulletPattern {
  let sinceShot = 0;
  const shotInterval = 700;
  return {
    id: "arcade_chase",
    reset() {
      sinceShot = 0;
    },
    tick({ deltaMs, arena, field, heart }) {
      sinceShot += deltaMs;
      if (sinceShot >= shotInterval) {
        sinceShot = 0;
        const s = speedScale();
        const fromTop = Math.random() < 0.5;
        const x = arena.x + Math.random() * arena.w;
        const y = fromTop ? arena.y - 10 : arena.y + arena.h + 10;
        const dx = heart.x - x;
        const dy = heart.y - y;
        const dist = Math.max(1, Math.hypot(dx, dy));
        const speed = 140 * s;
        field.spawn({
          x,
          y,
          vx: (dx / dist) * speed,
          vy: (dy / dist) * speed,
          radius: 8,
          color: PALETTE.glitchSprite,
          damage: 2,
        });
      }
    },
  };
}

/** Escalation of arcade_chase: two heart-seeking shots per interval
 * instead of one, fired slightly faster — still aimed at the HEART's
 * position at spawn time, not truly homing, so outrunning a shot stays
 * possible. */
export function createArcadeSwarm(): BulletPattern {
  let sinceShot = 0;
  const shotInterval = 500;
  return {
    id: "arcade_swarm",
    reset() {
      sinceShot = 0;
    },
    tick({ deltaMs, arena, field, heart }) {
      sinceShot += deltaMs;
      if (sinceShot >= shotInterval) {
        sinceShot = 0;
        const s = speedScale();
        const speed = 150 * s;
        for (let i = 0; i < 2; i++) {
          const fromTop = Math.random() < 0.5;
          const x = arena.x + Math.random() * arena.w;
          const y = fromTop ? arena.y - 10 : arena.y + arena.h + 10;
          const dx = heart.x - x;
          const dy = heart.y - y;
          const dist = Math.max(1, Math.hypot(dx, dy));
          field.spawn({
            x,
            y,
            vx: (dx / dist) * speed,
            vy: (dy / dist) * speed,
            radius: 8,
            color: PALETTE.glitchSprite,
            damage: 2,
          });
        }
      }
    },
  };
}

/** Stage props falling from the rigging with a gap to dodge through —
 * theatrical reskin of a descending-grid pattern. */
export function createStageProps(): BulletPattern {
  let sinceLastSpawn = 0;
  const interval = 1000;
  const columns = 6;
  return {
    id: "stage_props",
    reset() {
      sinceLastSpawn = 0;
    },
    tick({ deltaMs, arena, field }) {
      sinceLastSpawn += deltaMs;
      if (sinceLastSpawn >= interval) {
        sinceLastSpawn = 0;
        const gapIndex = Math.floor(Math.random() * columns);
        const spacing = arena.w / columns;
        const s = speedScale();
        for (let i = 0; i < columns; i++) {
          if (i === gapIndex) continue;
          field.spawn({
            x: arena.x + spacing * i + spacing / 2,
            y: arena.y - 10,
            vx: 0,
            vy: 125 * s,
            radius: 9,
            color: PALETTE.reina,
            damage: 3,
          });
        }
      }
    },
  };
}

/** Slow, wide "spotlights" that hunt the heart's position — bigger and
 * more telegraphed than arcade_chase, in keeping with a stage metaphor. */
export function createSpotlightHunt(): BulletPattern {
  let sinceShot = 0;
  const shotInterval = 900;
  return {
    id: "spotlight_hunt",
    reset() {
      sinceShot = 0;
    },
    tick({ deltaMs, arena, field, heart }) {
      sinceShot += deltaMs;
      if (sinceShot >= shotInterval) {
        sinceShot = 0;
        const s = speedScale();
        const fromLeft = Math.random() < 0.5;
        const x = fromLeft ? arena.x - 12 : arena.x + arena.w + 12;
        const y = arena.y + 20 + Math.random() * (arena.h - 40);
        const dx = heart.x - x;
        const dy = heart.y - y;
        const dist = Math.max(1, Math.hypot(dx, dy));
        const speed = 95 * s;
        field.spawn({
          x,
          y,
          vx: (dx / dist) * speed,
          vy: (dy / dist) * speed,
          radius: 13,
          color: PALETTE.decorArcade,
          damage: 3,
        });
      }
    },
  };
}

/** A full-circle burst, faster and denser than ink_scatter — composure
 * cracking under pressure rather than a controlled pattern. */
export function createComposureBreak(): BulletPattern {
  let sinceBurst = 0;
  const burstInterval = 1100;
  return {
    id: "composure_break",
    reset() {
      sinceBurst = 0;
    },
    tick({ deltaMs, arena, field }) {
      sinceBurst += deltaMs;
      if (sinceBurst >= burstInterval) {
        sinceBurst = 0;
        const s = speedScale();
        const cx = arena.x + arena.w / 2;
        const cy = arena.y + arena.h / 2;
        const count = 10;
        const rotation = Math.random() * Math.PI * 2;
        for (let i = 0; i < count; i++) {
          const angle = rotation + (Math.PI * 2 * i) / count;
          field.spawn({
            x: cx,
            y: cy,
            vx: Math.cos(angle) * 130 * s,
            vy: Math.sin(angle) * 130 * s,
            radius: 7,
            color: PALETTE.akari,
            damage: 2,
          });
        }
      }
    },
  };
}

/** Irregular, flickering pulses from random points — timing itself is the
 * unsettling part, not the bullets. Sometimes a long dark gap, sometimes
 * two pulses almost on top of each other. */
export function createFlickerPulse(): BulletPattern {
  let sinceLastSpawn = 0;
  let nextInterval = 300;
  return {
    id: "flicker_pulse",
    reset() {
      sinceLastSpawn = 0;
      nextInterval = 300;
    },
    tick({ deltaMs, arena, field }) {
      sinceLastSpawn += deltaMs;
      if (sinceLastSpawn >= nextInterval) {
        sinceLastSpawn = 0;
        nextInterval = 180 + Math.random() * 900;
        const s = speedScale();
        const x = arena.x + 16 + Math.random() * (arena.w - 32);
        const y = arena.y + 16 + Math.random() * (arena.h - 32);
        const angle = Math.random() * Math.PI * 2;
        field.spawn({
          x,
          y,
          vx: Math.cos(angle) * 70 * s,
          vy: Math.sin(angle) * 70 * s,
          radius: 8,
          color: PALETTE.flicker,
          damage: 2,
          lifetimeMs: 2200,
        });
      }
    },
  };
}

/** Bullets always spawn in mirrored left/right pairs, moving toward each
 * other's starting side — the arena's own symmetry becomes the threat. */
export function createMirrorSplit(): BulletPattern {
  let sinceLastSpawn = 0;
  const interval = 850;
  return {
    id: "mirror_split",
    reset() {
      sinceLastSpawn = 0;
    },
    tick({ deltaMs, arena, field }) {
      sinceLastSpawn += deltaMs;
      if (sinceLastSpawn >= interval) {
        sinceLastSpawn = 0;
        const s = speedScale();
        const y = arena.y + 20 + Math.random() * (arena.h - 40);
        const speed = 120 * s;
        field.spawn({
          x: arena.x - 10,
          y,
          vx: speed,
          vy: 0,
          radius: 8,
          color: PALETTE.reflection,
          damage: 2,
        });
        field.spawn({
          x: arena.x + arena.w + 10,
          y,
          vx: -speed,
          vy: 0,
          radius: 8,
          color: PALETTE.reflection,
          damage: 2,
        });
      }
    },
  };
}

/** Escalation of mirror_split: pairs fire from all four sides at once,
 * one side skipped at random each wave so there's always a way through —
 * "the mirror shatters and comes from everywhere" without being unfair. */
export function createMirrorShatter(): BulletPattern {
  let sinceLastSpawn = 0;
  const interval = 700;
  return {
    id: "mirror_shatter",
    reset() {
      sinceLastSpawn = 0;
    },
    tick({ deltaMs, arena, field }) {
      sinceLastSpawn += deltaMs;
      if (sinceLastSpawn >= interval) {
        sinceLastSpawn = 0;
        const s = speedScale();
        const speed = 130 * s;
        const midX = arena.x + arena.w / 2;
        const midY = arena.y + arena.h / 2;
        const skip = Math.floor(Math.random() * 4);
        if (skip !== 0) {
          field.spawn({ x: arena.x - 10, y: midY, vx: speed, vy: 0, radius: 8, color: PALETTE.reflection, damage: 2 });
        }
        if (skip !== 1) {
          field.spawn({
            x: arena.x + arena.w + 10,
            y: midY,
            vx: -speed,
            vy: 0,
            radius: 8,
            color: PALETTE.reflection,
            damage: 2,
          });
        }
        if (skip !== 2) {
          field.spawn({ x: midX, y: arena.y - 10, vx: 0, vy: speed, radius: 8, color: PALETTE.reflection, damage: 2 });
        }
        if (skip !== 3) {
          field.spawn({
            x: midX,
            y: arena.y + arena.h + 10,
            vx: 0,
            vy: -speed,
            radius: 8,
            color: PALETTE.reflection,
            damage: 2,
          });
        }
      }
    },
  };
}

/** Escalation of flicker_pulse: the same irregular timing, but roughly
 * half the pulses now spawn in simultaneous pairs instead of alone, and
 * bullets move a little faster — still random enough that memorizing a
 * rhythm doesn't help, on purpose. */
export function createFlickerCascade(): BulletPattern {
  let sinceLastSpawn = 0;
  let nextInterval = 260;
  return {
    id: "flicker_cascade",
    reset() {
      sinceLastSpawn = 0;
      nextInterval = 260;
    },
    tick({ deltaMs, arena, field }) {
      sinceLastSpawn += deltaMs;
      if (sinceLastSpawn >= nextInterval) {
        sinceLastSpawn = 0;
        nextInterval = 150 + Math.random() * 700;
        const s = speedScale();
        const count = Math.random() < 0.5 ? 2 : 1;
        for (let i = 0; i < count; i++) {
          const x = arena.x + 16 + Math.random() * (arena.w - 32);
          const y = arena.y + 16 + Math.random() * (arena.h - 32);
          const angle = Math.random() * Math.PI * 2;
          field.spawn({
            x,
            y,
            vx: Math.cos(angle) * 85 * s,
            vy: Math.sin(angle) * 85 * s,
            radius: 8,
            color: PALETTE.flicker,
            damage: 2,
            lifetimeMs: 2000,
          });
        }
      }
    },
  };
}

/** Escalation of ink_scatter: droplet bursts now fire from two origins at
 * once instead of one, and the falling "letters" come slightly faster —
 * the same shape of threat, just more of the page at once. */
export function createInkFlood(): BulletPattern {
  let sinceBurst = 0;
  let sinceLetter = 0;
  const burstInterval = 1300;
  const letterInterval = 260;
  let t = 0;
  return {
    id: "ink_flood",
    reset() {
      sinceBurst = 0;
      sinceLetter = 0;
      t = 0;
    },
    tick({ deltaMs, arena, field }) {
      t += deltaMs;
      const s = speedScale();

      sinceBurst += deltaMs;
      if (sinceBurst >= burstInterval) {
        sinceBurst = 0;
        const dropletCount = 5;
        const spread = Math.PI * 0.5;
        const baseAngle = Math.PI / 2 - spread / 2;
        const origins = [arena.x + arena.w * 0.3, arena.x + arena.w * 0.7];
        for (const originX of origins) {
          for (let i = 0; i < dropletCount; i++) {
            const angle = baseAngle + (spread * i) / (dropletCount - 1);
            field.spawn({
              x: originX,
              y: arena.y + 10,
              vx: Math.cos(angle) * 95 * s,
              vy: Math.sin(angle) * 95 * s,
              radius: 7,
              color: PALETTE.runawayMetaphor,
              damage: 2,
            });
          }
        }
      }

      sinceLetter += deltaMs;
      if (sinceLetter >= letterInterval) {
        sinceLetter = 0;
        const x = arena.x + 16 + Math.random() * (arena.w - 32);
        field.spawn({
          x,
          y: arena.y - 8,
          vx: Math.sin(t / 300 + x) * 24 * s,
          vy: 85 * s,
          radius: 5,
          color: PALETTE.runawayMetaphorAccent,
          damage: 1,
        });
      }
    },
  };
}

/** A shot fires, then an identical delayed "echo" of it fires shortly
 * after from a slightly offset origin — the same attempt, played back
 * with a small variation, the way a repeat playthrough would look from
 * the outside. */
export function createEchoCascade(): BulletPattern {
  let sinceBurst = 0;
  const burstInterval = 1400;
  const echoDelayMs = 550;
  let echoQueue: { x: number; y: number; vx: number; vy: number; delay: number }[] = [];
  return {
    id: "echo_cascade",
    reset() {
      sinceBurst = 0;
      echoQueue = [];
    },
    tick({ deltaMs, arena, field }) {
      sinceBurst += deltaMs;
      for (const e of echoQueue) e.delay -= deltaMs;
      for (const e of echoQueue) {
        if (e.delay <= 0) {
          field.spawn({ x: e.x, y: e.y, vx: e.vx, vy: e.vy, radius: 7, color: PALETTE.theAccumulationAccent, damage: 2 });
        }
      }
      echoQueue = echoQueue.filter((e) => e.delay > 0);

      if (sinceBurst >= burstInterval) {
        sinceBurst = 0;
        const s = speedScale();
        const fromLeft = Math.random() < 0.5;
        const y = arena.y + 20 + Math.random() * (arena.h - 40);
        const speed = 130 * s;
        const x = fromLeft ? arena.x - 10 : arena.x + arena.w + 10;
        const vx = (fromLeft ? 1 : -1) * speed;
        field.spawn({ x, y, vx, vy: 0, radius: 8, color: PALETTE.theAccumulation, damage: 2 });
        echoQueue.push({ x, y: y + 36, vx, vy: 0, delay: echoDelayMs });
      }
    },
  };
}

/** Escalation of echo_cascade: two echoes queued per burst instead of
 * one (offset both above and below the original), fired more often —
 * every past attempt answering at once instead of one at a time. */
export function createEchoFlood(): BulletPattern {
  let sinceBurst = 0;
  const burstInterval = 1000;
  const echoDelayMs = 450;
  let echoQueue: { x: number; y: number; vx: number; vy: number; delay: number }[] = [];
  return {
    id: "echo_flood",
    reset() {
      sinceBurst = 0;
      echoQueue = [];
    },
    tick({ deltaMs, arena, field }) {
      sinceBurst += deltaMs;
      for (const e of echoQueue) e.delay -= deltaMs;
      for (const e of echoQueue) {
        if (e.delay <= 0) {
          field.spawn({ x: e.x, y: e.y, vx: e.vx, vy: e.vy, radius: 7, color: PALETTE.theAccumulationAccent, damage: 2 });
        }
      }
      echoQueue = echoQueue.filter((e) => e.delay > 0);

      if (sinceBurst >= burstInterval) {
        sinceBurst = 0;
        const s = speedScale();
        const fromLeft = Math.random() < 0.5;
        const y = arena.y + 20 + Math.random() * (arena.h - 40);
        const speed = 140 * s;
        const x = fromLeft ? arena.x - 10 : arena.x + arena.w + 10;
        const vx = (fromLeft ? 1 : -1) * speed;
        field.spawn({ x, y, vx, vy: 0, radius: 8, color: PALETTE.theAccumulation, damage: 2 });
        echoQueue.push({ x, y: y + 34, vx, vy: 0, delay: echoDelayMs });
        echoQueue.push({ x, y: y - 34, vx, vy: 0, delay: echoDelayMs });
      }
    },
  };
}

export const PATTERN_REGISTRY: Record<string, () => BulletPattern> = {
  stray_thought_wave: createStrayThoughtWave,
  stray_thought_flood: createStrayThoughtFlood,
  arcade_grid: createArcadeGrid,
  arcade_bounce: createArcadeBounce,
  ink_scatter: createInkScatter,
  ink_flood: createInkFlood,
  geometric_lasers: createGeometricLasers,
  geometric_lasers_crossed: createGeometricLasersCrossed,
  arcade_chase: createArcadeChase,
  arcade_swarm: createArcadeSwarm,
  stage_props: createStageProps,
  mirror_split: createMirrorSplit,
  mirror_shatter: createMirrorShatter,
  spotlight_hunt: createSpotlightHunt,
  composure_break: createComposureBreak,
  flicker_pulse: createFlickerPulse,
  flicker_cascade: createFlickerCascade,
  echo_cascade: createEchoCascade,
  echo_flood: createEchoFlood,
};

export function createPattern(id: string): BulletPattern {
  const factory = PATTERN_REGISTRY[id];
  if (!factory) throw new Error(`Unknown bullet pattern: ${id}`);
  return factory();
}
