import Phaser from "phaser";
import type { Arena } from "../bullets/BulletField";
import { PALETTE } from "../engine/palette";
import { useSettingsStore } from "../state/settingsStore";

const SPEED = 190;
const INVULN_MS = 550;
// Collision hitbox never changes with the "larger heart" accessibility
// option — only the visual grows. Otherwise "easier to see" would also
// mean "easier to get hit," which defeats the point of the assist.
const HIT_RADIUS = 7;

/**
 * HEART states per the design doc: only NORMAL (free 8-directional
 * movement) is implemented. The `state` field and switch in `update()` are
 * the extension point for GRAVITY/SHIELD/DASH/RHYTHM/TETHER/GLITCH —
 * add a case, not a rewrite.
 */
export type HeartState = "normal";

export class HeartController {
  gfx: Phaser.GameObjects.Container;
  private shape: Phaser.GameObjects.Arc;
  state: HeartState = "normal";
  private invulnMs = 0;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    const visualRadius = useSettingsStore.getState().largeHeart ? HIT_RADIUS + 4 : HIT_RADIUS;
    this.shape = scene.add.circle(0, 0, visualRadius, PALETTE.heart);
    this.shape.setStrokeStyle(2, 0xffffff, 0.9);
    this.gfx = scene.add.container(x, y, [this.shape]);
    this.gfx.setDepth(40);
  }

  get x() {
    return this.gfx.x;
  }
  get y() {
    return this.gfx.y;
  }

  get radius() {
    return HIT_RADIUS;
  }

  get invulnerable() {
    return this.invulnMs > 0;
  }

  triggerInvulnerability() {
    this.invulnMs = INVULN_MS;
  }

  update(delta: number, moveX: number, moveY: number, arena: Arena) {
    if (this.invulnMs > 0) {
      this.invulnMs -= delta;
      this.shape.setAlpha(Math.floor(this.invulnMs / 80) % 2 === 0 ? 0.35 : 1);
    } else {
      this.shape.setAlpha(1);
    }

    switch (this.state) {
      case "normal":
      default: {
        const len = Math.hypot(moveX, moveY);
        if (len > 0.05) {
          const dt = delta / 1000;
          const nx = (moveX / len) * SPEED * dt;
          const ny = (moveY / len) * SPEED * dt;
          const minX = arena.x + HIT_RADIUS + 4;
          const maxX = arena.x + arena.w - HIT_RADIUS - 4;
          const minY = arena.y + HIT_RADIUS + 4;
          const maxY = arena.y + arena.h - HIT_RADIUS - 4;
          this.gfx.x = Phaser.Math.Clamp(this.gfx.x + nx, minX, maxX);
          this.gfx.y = Phaser.Math.Clamp(this.gfx.y + ny, minY, maxY);
        }
        break;
      }
    }
  }

  destroy() {
    this.gfx.destroy();
  }
}
