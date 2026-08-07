import Phaser from "phaser";
import type { NpcPlacement } from "../maps/types";
import { ensureCharacterTexture } from "../engine/PlaceholderSprites";
import { tileToPixel } from "../maps/types";

const PATROL_SPEED = 45;

export class NpcActor {
  container: Phaser.GameObjects.Container;
  def: NpcPlacement;
  private patrolIndex = 1;
  private tileSize: number;

  constructor(scene: Phaser.Scene, def: NpcPlacement, tileSize: number) {
    this.def = def;
    this.tileSize = tileSize;
    const key = ensureCharacterTexture(scene, def.characterId);
    const { x, y } = tileToPixel(def, tileSize);
    const sprite = scene.add.image(0, -6, key);
    this.container = scene.add.container(x, y, [sprite]);
    this.container.setDepth(9);
  }

  get x() {
    return this.container.x;
  }
  get y() {
    return this.container.y;
  }

  update(delta: number) {
    const patrol = this.def.patrol;
    if (!patrol || patrol.length < 2) return;
    const target = tileToPixel(patrol[this.patrolIndex], this.tileSize);
    const dx = target.x - this.container.x;
    const dy = target.y - this.container.y;
    const dist = Math.hypot(dx, dy);
    if (dist < 2) {
      this.patrolIndex = (this.patrolIndex + 1) % patrol.length;
      return;
    }
    const step = (PATROL_SPEED * delta) / 1000;
    this.container.x += (dx / dist) * Math.min(step, dist);
    this.container.y += (dy / dist) * Math.min(step, dist);
  }
}
