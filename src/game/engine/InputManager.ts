import Phaser from "phaser";

export interface InputSnapshot {
  moveX: number; // -1..1
  moveY: number; // -1..1
  running: boolean;
  interactPressed: boolean;
  cancelPressed: boolean;
  /** edge-triggered, used for menu/dialogue-choice navigation */
  upJustPressed: boolean;
  downJustPressed: boolean;
}

const MOVE_LEFT = new Set(["arrowleft", "a"]);
const MOVE_RIGHT = new Set(["arrowright", "d"]);
const MOVE_UP = new Set(["arrowup", "w"]);
const MOVE_DOWN = new Set(["arrowdown", "s"]);
const INTERACT = new Set(["z", "enter"]);
const CANCEL = new Set(["x", "escape"]);
// Prevent default for keys that would otherwise scroll the page or
// trigger browser shortcuts while playing.
const PREVENT_DEFAULT = new Set([
  "arrowleft",
  "arrowright",
  "arrowup",
  "arrowdown",
  " ",
]);

/**
 * Central input reader. Deliberately does NOT use Phaser's Key/JustDown
 * system — that state proved unreliable specifically after
 * `scene.restart()` (every map transition calls it), silently eating all
 * "just pressed" edges until the game was reloaded. Raw DOM keydown/keyup
 * tracking is what every other input island in this codebase already uses
 * (DialogueBox, FightBar, menu escape handling) and has proven solid, so
 * movement/interact/cancel now go through the same mechanism instead of
 * two parallel, inconsistently-reliable input systems.
 *
 * Gamepad still reads Phaser's Gamepad plugin directly (unaffected by the
 * JustDown issue, since it's a different subsystem) — wiring more of it up
 * later means adding axis/button reads here, not touching scene logic.
 */
export class InputManager {
  private keysDown = new Set<string>();
  private justPressed = new Set<string>();
  private pad: Phaser.Input.Gamepad.Gamepad | undefined;
  private onKeyDown: (e: KeyboardEvent) => void;
  private onKeyUp: (e: KeyboardEvent) => void;

  constructor(scene: Phaser.Scene) {
    this.onKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (PREVENT_DEFAULT.has(key)) e.preventDefault();
      if (!this.keysDown.has(key)) this.justPressed.add(key);
      this.keysDown.add(key);
    };
    this.onKeyUp = (e: KeyboardEvent) => {
      this.keysDown.delete(e.key.toLowerCase());
    };
    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);

    const cleanup = () => this.destroy();
    scene.events.once(Phaser.Scenes.Events.SHUTDOWN, cleanup);
    scene.events.once(Phaser.Scenes.Events.DESTROY, cleanup);

    if (scene.input.gamepad) {
      scene.input.gamepad.once("connected", (pad: Phaser.Input.Gamepad.Gamepad) => {
        this.pad = pad;
      });
    }
  }

  destroy() {
    window.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("keyup", this.onKeyUp);
  }

  private isAnyDown(keys: Set<string>): boolean {
    for (const k of this.keysDown) if (keys.has(k)) return true;
    return false;
  }

  private isAnyJustPressed(keys: Set<string>): boolean {
    for (const k of this.justPressed) if (keys.has(k)) return true;
    return false;
  }

  read(): InputSnapshot {
    let moveX = 0;
    let moveY = 0;
    if (this.isAnyDown(MOVE_LEFT)) moveX -= 1;
    if (this.isAnyDown(MOVE_RIGHT)) moveX += 1;
    if (this.isAnyDown(MOVE_UP)) moveY -= 1;
    if (this.isAnyDown(MOVE_DOWN)) moveY += 1;

    if (this.pad) {
      const ax = this.pad.axes.length > 0 ? this.pad.axes[0].getValue() : 0;
      const ay = this.pad.axes.length > 1 ? this.pad.axes[1].getValue() : 0;
      if (Math.abs(ax) > 0.2) moveX = ax;
      if (Math.abs(ay) > 0.2) moveY = ay;
    }

    const running = this.keysDown.has("shift") || Boolean(this.pad?.buttons[10]?.pressed);
    const interactPressed = this.isAnyJustPressed(INTERACT) || Boolean(this.pad?.buttons[0]?.pressed);
    const cancelPressed = this.isAnyJustPressed(CANCEL);
    const upJustPressed = this.isAnyJustPressed(MOVE_UP);
    const downJustPressed = this.isAnyJustPressed(MOVE_DOWN);

    this.justPressed.clear();

    return {
      moveX,
      moveY,
      running,
      interactPressed,
      cancelPressed,
      upJustPressed,
      downJustPressed,
    };
  }
}
