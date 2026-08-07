import Phaser from "phaser";

export interface BulletSpawnConfig {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: number;
  damage: number;
  lifetimeMs?: number;
  bounce?: boolean;
  fake?: boolean; // telegraphed but harmless — rewards players who learn patterns
}

interface LiveBullet {
  gfx: Phaser.GameObjects.Arc;
  vx: number;
  vy: number;
  radius: number;
  damage: number;
  age: number;
  lifetimeMs: number;
  bounce: boolean;
  fake: boolean;
}

export interface Arena {
  x: number;
  y: number;
  w: number;
  h: number;
}

/**
 * Owns every projectile in the current dodge phase: spawning, movement,
 * wall bouncing, lifetime, and collision against the HEART. Patterns never
 * touch Phaser directly — they call `spawn()` on the field they're given.
 */
export class BulletField {
  private bullets: LiveBullet[] = [];
  private scene: Phaser.Scene;
  private arena: Arena;

  constructor(scene: Phaser.Scene, arena: Arena) {
    this.scene = scene;
    this.arena = arena;
  }

  spawn(cfg: BulletSpawnConfig) {
    const gfx = this.scene.add.circle(cfg.x, cfg.y, cfg.radius, cfg.color, cfg.fake ? 0.45 : 1);
    gfx.setDepth(30);
    if (!cfg.fake) {
      gfx.setStrokeStyle(1.5, 0xffffff, 0.6);
    }
    this.bullets.push({
      gfx,
      vx: cfg.vx,
      vy: cfg.vy,
      radius: cfg.radius,
      damage: cfg.damage,
      age: 0,
      lifetimeMs: cfg.lifetimeMs ?? 6000,
      bounce: Boolean(cfg.bounce),
      fake: Boolean(cfg.fake),
    });
  }

  setArena(arena: Arena) {
    this.arena = arena;
  }

  /** returns total damage dealt this frame (heart may be hit by >1 bullet) */
  update(delta: number, heart: { x: number; y: number; radius: number; invulnerable: boolean }): number {
    let damage = 0;
    const dt = delta / 1000;
    const { x: ax, y: ay, w, h } = this.arena;

    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const b = this.bullets[i];
      b.age += delta;
      b.gfx.x += b.vx * dt;
      b.gfx.y += b.vy * dt;

      if (b.bounce) {
        if (b.gfx.x - b.radius < ax) {
          b.gfx.x = ax + b.radius;
          b.vx *= -1;
        } else if (b.gfx.x + b.radius > ax + w) {
          b.gfx.x = ax + w - b.radius;
          b.vx *= -1;
        }
        if (b.gfx.y - b.radius < ay) {
          b.gfx.y = ay + b.radius;
          b.vy *= -1;
        } else if (b.gfx.y + b.radius > ay + h) {
          b.gfx.y = ay + h - b.radius;
          b.vy *= -1;
        }
      }

      const outOfBounds =
        !b.bounce &&
        (b.gfx.x < ax - 60 || b.gfx.x > ax + w + 60 || b.gfx.y < ay - 60 || b.gfx.y > ay + h + 60);
      const expired = b.age > b.lifetimeMs;

      if (outOfBounds || expired) {
        b.gfx.destroy();
        this.bullets.splice(i, 1);
        continue;
      }

      if (!b.fake && !heart.invulnerable) {
        const d = Phaser.Math.Distance.Between(b.gfx.x, b.gfx.y, heart.x, heart.y);
        if (d < b.radius + heart.radius) {
          damage += b.damage;
          b.gfx.destroy();
          this.bullets.splice(i, 1);
        }
      }
    }
    return damage;
  }

  clear() {
    for (const b of this.bullets) b.gfx.destroy();
    this.bullets = [];
  }

  count() {
    return this.bullets.length;
  }
}
