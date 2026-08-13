import Phaser from "phaser";
import { useBattleStore, type TurnPhase } from "../state/battleStore";
import { useGameStore } from "../state/store";
import { useEphemeralStore } from "../state/ephemeral";
import { getEnemy } from "../../data/enemies/registry";
import { ensureCharacterTexture } from "../engine/PlaceholderSprites";
import { InputManager } from "../engine/InputManager";
import { HeartController } from "../combat/HeartController";
import { BulletField, type Arena } from "../bullets/BulletField";
import { createPattern } from "../bullets/patterns";
import type { BulletPattern } from "../bullets/Pattern";
import { PALETTE } from "../engine/palette";
import { useSettingsStore } from "../state/settingsStore";
import { prefersReducedMotion } from "../../ui/a11y";

// The canvas now dynamically matches the browser window (Scale.RESIZE, see
// PhaserGame.ts) instead of a fixed 896x576, so the arena has to be
// computed off the actual current size rather than hardcoded — centered,
// sized proportionally to whatever screen it's running on.
function computeArena(canvasWidth: number, canvasHeight: number): Arena {
  const w = Math.min(canvasWidth * 0.6, 720);
  const h = Math.min(canvasHeight * 0.4, 340);
  return {
    x: (canvasWidth - w) / 2,
    y: canvasHeight * 0.28,
    w,
    h,
  };
}

// Most enemy ids match a PlaceholderSprites character id directly; bosses
// that share a character's face (e.g. Mika's arcade duel) need a mapping.
const ENEMY_TOKEN_CHARACTER: Record<string, string> = {
  mika_boss: "mika",
  reina_boss: "reina",
  akari_boss: "akari",
  reflection_boss: "reflection",
  flicker_boss: "flicker",
  runaway_metaphor_boss: "runaway_metaphor",
  stray_thought_boss: "stray_thought",
  glitch_sprite_boss: "glitch_sprite",
  stray_equation_boss: "stray_equation",
};

export class BattleScene extends Phaser.Scene {
  private input$!: InputManager;
  private heart!: HeartController;
  private bulletField!: BulletField;
  private pattern: BulletPattern | null = null;
  private dodgeElapsed = 0;
  private enemyToken!: Phaser.GameObjects.Image;
  private arena!: Arena;
  private enemyTokenBaseY = 0;
  private unsubTurnPhase?: () => void;
  private unsubResult?: () => void;
  private resolvedExit = false;
  private wasPausedLastFrame = false;

  constructor() {
    super("BattleScene");
  }

  create() {
    this.resolvedExit = false;
    // Defensive: guarantee a clean UI slate entering battle, regardless of
    // what triggered it (normal touch/interact always clears these first,
    // but the debug panel can force an encounter mid-conversation).
    const store = useGameStore.getState();
    store.closeDialogue();
    store.closePuzzle();
    store.setMenu("none");

    const enemyId = useEphemeralStore.getState().pendingEncounterId ?? "stray_thought";
    const enemy = getEnemy(enemyId);
    useBattleStore.getState().init(enemyId);

    this.cameras.main.setBackgroundColor(PALETTE.battleArena);
    this.cameras.main.fadeIn(200, 0, 0, 0);

    this.arena = computeArena(this.scale.width, this.scale.height);
    const centerX = this.scale.width / 2;

    const arenaGfx = this.add.graphics();
    arenaGfx.lineStyle(3, PALETTE.battleArenaBorder, 1);
    arenaGfx.strokeRect(this.arena.x, this.arena.y, this.arena.w, this.arena.h);
    arenaGfx.setDepth(20);

    const tokenKey = ensureCharacterTexture(this, ENEMY_TOKEN_CHARACTER[enemyId] ?? enemyId);
    this.enemyTokenBaseY = this.arena.y * 0.45;
    this.enemyToken = this.add.image(centerX, this.enemyTokenBaseY, tokenKey).setDepth(15).setScale(1.6);
    this.add
      .text(centerX, this.enemyTokenBaseY - 60, enemy.name, {
        fontFamily: "Avenir Next, sans-serif",
        fontSize: "20px",
        color: "#fff6ea",
      })
      .setOrigin(0.5)
      .setDepth(15);

    this.heart = new HeartController(this, this.arena.x + this.arena.w / 2, this.arena.y + this.arena.h - 24);
    this.bulletField = new BulletField(this, this.arena);
    this.input$ = new InputManager(this);

    this.unsubTurnPhase = useBattleStore.subscribe((state, prev) => {
      if (state.turnPhase !== prev.turnPhase) this.onTurnPhaseChange(state.turnPhase);
    });
    this.unsubResult = useBattleStore.subscribe((state, prev) => {
      if (state.result !== prev.result && state.result !== "none") this.onResult(state.result);
    });

    const onContinueAfterDefeat = () => {
      if (!this.sys?.isActive()) return;
      this.scene.start("OverworldScene");
    };
    window.addEventListener("hba:continue-after-defeat", onContinueAfterDefeat);

    // See OverworldScene for why cleanup is wired to both SHUTDOWN and
    // DESTROY: React StrictMode's dev-only double-mount destroys a
    // throwaway first scene instance via DESTROY, not SHUTDOWN.
    const cleanup = () => {
      this.unsubTurnPhase?.();
      this.unsubResult?.();
      window.removeEventListener("hba:continue-after-defeat", onContinueAfterDefeat);
    };
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, cleanup);
    this.events.once(Phaser.Scenes.Events.DESTROY, cleanup);
  }

  private onTurnPhaseChange(phase: TurnPhase) {
    if (phase === "dodge") {
      const battle = useBattleStore.getState();
      const enemy = getEnemy(battle.enemyId);
      const phaseDef = enemy.phases[battle.phaseIndex] ?? enemy.phases[0];
      this.pattern = createPattern(phaseDef.patternId);
      this.pattern.reset();
      this.dodgeElapsed = 0;
      this.bulletField.clear();
      this.heart.gfx.setVisible(true);
    } else {
      this.bulletField.clear();
    }
  }

  private onResult(result: string) {
    if (result === "defeat") return; // handled by GameOverScreen overlay, scene stays frozen
    if (this.resolvedExit) return;
    this.resolvedExit = true;
    this.time.delayedCall(1600, () => {
      const store = useGameStore.getState();
      store.setPhase("overworld");
      this.scene.start("OverworldScene");
    });
  }

  update(_time: number, delta: number) {
    const battle = useBattleStore.getState();
    if (battle.result === "defeat") return; // frozen for GameOverScreen

    const store = useGameStore.getState();
    const input = this.input$.read();

    // Pausing mid-battle (X/Escape) was previously impossible — the input
    // was read but never checked here, so bullets and the dodge-phase
    // timer kept running no matter what a player pressed. Freeze
    // everything below whenever ANY menu overlay is open, not just the
    // pause hub itself — Inventory/Phone/Save/Settings are all reachable
    // from the pause hub mid-battle too, and each has its own "back"
    // step that lands on menuOpen:"pause" before finally closing, so
    // checking only for "pause" left the dodge phase silently running
    // behind whichever sub-screen was actually open.
    if (store.ui.menuOpen !== "none") {
      this.wasPausedLastFrame = true;
      return;
    }
    if (this.wasPausedLastFrame) {
      // The same X press that just closed the menu (via its own window
      // keydown listener) is still flagged "just pressed" here —
      // InputManager and the overlay both react to one physical keydown,
      // and this frame runs after the overlay's synchronous handler
      // already flipped menuOpen back to "none". Consume it without
      // reopening, or resuming would immediately re-pause every time.
      this.wasPausedLastFrame = false;
    } else if (input.cancelPressed) {
      store.setMenu("pause");
      return;
    }

    if (battle.turnPhase === "dodge" && this.pattern) {
      this.dodgeElapsed += delta;
      const enemy = getEnemy(battle.enemyId);
      const phaseDef = enemy.phases[battle.phaseIndex] ?? enemy.phases[0];

      this.heart.update(delta, input.moveX, input.moveY, this.arena);
      this.pattern.tick({
        elapsedMs: this.dodgeElapsed,
        deltaMs: delta,
        arena: this.arena,
        field: this.bulletField,
        heart: { x: this.heart.x, y: this.heart.y },
      });
      const dmg = this.bulletField.update(delta, {
        x: this.heart.x,
        y: this.heart.y,
        radius: this.heart.radius,
        invulnerable: this.heart.invulnerable,
      });
      if (dmg > 0) {
        this.heart.triggerInvulnerability();
        useBattleStore.getState().hitByBullet(dmg);
        if (useSettingsStore.getState().screenShake && !prefersReducedMotion()) {
          this.cameras.main.shake(160, 0.006);
        }
        if (useSettingsStore.getState().flashEffects && !prefersReducedMotion()) {
          this.cameras.main.flash(120, 255, 77, 109);
        }
      }

      if (this.dodgeElapsed >= phaseDef.dodgeDurationMs && useBattleStore.getState().result === "none") {
        useBattleStore.getState().endEnemyTurn();
      }
    }

    // gentle idle bob for the enemy token so it reads as alive
    this.enemyToken.y = this.enemyTokenBaseY + Math.sin(this.time.now / 500) * 4;
  }
}
