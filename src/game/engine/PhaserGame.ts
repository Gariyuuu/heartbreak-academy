import Phaser from "phaser";
import { OverworldScene } from "../scenes/OverworldScene";
import { BattleScene } from "../scenes/BattleScene";

// Previously a fixed 896x576 canvas scaled to fit the window (Scale.FIT) —
// on anything wider/taller than its 14:9 aspect ratio that meant visible
// letterboxing and, since fewer tiles fit in a smaller canvas, a world
// that read as small/zoomed out no matter how the camera zoom was tuned.
// RESIZE mode makes the canvas match the actual window size, so both
// scenes need to size things off `this.scale.width/height` at runtime
// instead of the old fixed constants (see BattleScene's `computeArena`).
export function createPhaserGame(parent: HTMLElement): Phaser.Game {
  return new Phaser.Game({
    type: Phaser.AUTO,
    parent,
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: "#14101c",
    pixelArt: false,
    roundPixels: true,
    scale: {
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    input: {
      gamepad: true,
    },
    scene: [OverworldScene, BattleScene],
  });
}
