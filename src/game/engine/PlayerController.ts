import Phaser from "phaser";
import type { CollisionGrid } from "./TileRenderer";
import { ensureCharacterTexture, ensureFacingArrowTexture } from "./PlaceholderSprites";
import type { Facing } from "../save/schema";

export const COLORWAY_HEX: Record<string, number> = {
  crimson: 0xe86a92,
  azure: 0x5b8fe8,
  verdant: 0x6fae8f,
  violet: 0xa878e0,
};

const WALK_SPEED = 130;
const RUN_SPEED = 230;
export const PLAYER_BODY_SIZE = { w: 22, h: 16 };

const ARROW_OFFSET: Record<Facing, { x: number; y: number; angle: number }> = {
  down: { x: 0, y: 22, angle: 90 },
  up: { x: 0, y: -22, angle: -90 },
  left: { x: -20, y: 2, angle: 180 },
  right: { x: 20, y: 2, angle: 0 },
};

export class PlayerController {
  container: Phaser.GameObjects.Container;
  private body: Phaser.GameObjects.Image;
  private arrow: Phaser.GameObjects.Image;
  facing: Facing = "down";
  private moving = false;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    facing: Facing,
    colorway = "crimson",
    appearance?: { hairstyle: string; uniformVariant: string },
  ) {
    const bodyKey = ensureCharacterTexture(scene, "player", appearance);
    const arrowKey = ensureFacingArrowTexture(scene);
    this.body = scene.add.image(0, -6, bodyKey);
    this.body.setTint(COLORWAY_HEX[colorway] ?? COLORWAY_HEX.crimson);
    this.arrow = scene.add.image(0, 0, arrowKey);
    this.facing = facing;
    this.container = scene.add.container(x, y, [this.body, this.arrow]);
    this.container.setDepth(10);
    this.applyFacingVisual();
  }

  get x() {
    return this.container.x;
  }
  get y() {
    return this.container.y;
  }

  private applyFacingVisual() {
    const o = ARROW_OFFSET[this.facing];
    this.arrow.setPosition(o.x, o.y);
    this.arrow.setAngle(o.angle);
    this.body.setScale(this.facing === "left" ? -1 : 1, 1);
  }

  update(delta: number, moveX: number, moveY: number, running: boolean, grid: CollisionGrid) {
    const len = Math.hypot(moveX, moveY);
    this.moving = len > 0.05;

    if (this.moving) {
      const nx = moveX / len;
      const ny = moveY / len;
      const speed = running ? RUN_SPEED : WALK_SPEED;
      const dt = delta / 1000;

      if (Math.abs(nx) > Math.abs(ny)) {
        this.facing = nx > 0 ? "right" : "left";
      } else if (ny !== 0) {
        this.facing = ny > 0 ? "down" : "up";
      }

      const stepX = nx * speed * dt;
      const stepY = ny * speed * dt;

      const tryX = this.container.x + stepX;
      if (!grid.rectBlocked(tryX, this.container.y, PLAYER_BODY_SIZE.w, PLAYER_BODY_SIZE.h)) {
        this.container.x = tryX;
      }
      const tryY = this.container.y + stepY;
      if (!grid.rectBlocked(this.container.x, tryY, PLAYER_BODY_SIZE.w, PLAYER_BODY_SIZE.h)) {
        this.container.y = tryY;
      }

      this.applyFacingVisual();
    }
  }

  isMoving() {
    return this.moving;
  }

  /** tile directly in front of the player, for interaction/exit checks */
  facingWorldPoint(reach: number) {
    const dir: Record<Facing, [number, number]> = {
      up: [0, -1],
      down: [0, 1],
      left: [-1, 0],
      right: [1, 0],
    };
    const [dx, dy] = dir[this.facing];
    return { x: this.container.x + dx * reach, y: this.container.y + dy * reach };
  }
}
