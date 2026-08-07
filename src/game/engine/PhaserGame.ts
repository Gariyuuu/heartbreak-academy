import Phaser from "phaser";
import { OverworldScene } from "../scenes/OverworldScene";
import { BattleScene } from "../scenes/BattleScene";

export function createPhaserGame(parent: HTMLElement): Phaser.Game {
  return new Phaser.Game({
    type: Phaser.AUTO,
    parent,
    width: 896,
    height: 576,
    backgroundColor: "#14101c",
    pixelArt: false,
    roundPixels: true,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    input: {
      gamepad: true,
    },
    scene: [OverworldScene, BattleScene],
  });
}
