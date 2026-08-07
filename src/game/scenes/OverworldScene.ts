import Phaser from "phaser";
import { getMap } from "../maps/registry";
import { mapPixelSize, tileToPixel, type InteractablePlacement } from "../maps/types";
import { renderMap, type CollisionGrid } from "../engine/TileRenderer";
import { InputManager } from "../engine/InputManager";
import { PlayerController } from "../engine/PlayerController";
import { NpcActor } from "../characters/NpcActor";
import { ensureInteractableTexture } from "../engine/PlaceholderSprites";
import { useGameStore } from "../state/store";
import { useEphemeralStore } from "../state/ephemeral";
import { dialogueEngine } from "../dialogue/DialogueEngine";
import { getDialogueTree } from "../../data/dialogue/registry";
import { activateMemoryStar } from "../save/memoryStar";
import { PALETTE } from "../engine/palette";

const INTERACT_RADIUS = 46;
const TOUCH_RADIUS = 20;
const COMMIT_INTERVAL_MS = 800;

export class OverworldScene extends Phaser.Scene {
  private player!: PlayerController;
  private input$!: InputManager;
  private grid!: CollisionGrid;
  private npcs: NpcActor[] = [];
  private mapId!: string;
  private commitTimer = 0;
  private hintText!: Phaser.GameObjects.Text;
  // Phaser's scene.restart() reuses this same Scene instance rather than
  // constructing a fresh one — field initializers like `npcs = []` above
  // only run once, at original construction, not on every restart. Track
  // and reset restart-scoped state explicitly in create() instead of
  // relying on field initializers.
  private mapTransitionInProgress = false;

  constructor() {
    super("OverworldScene");
  }

  create() {
    const store = useGameStore.getState();
    // Defensive: clear any UI left open by whatever we transitioned from
    // (a battle outcome, a forced debug teleport mid-dialogue, etc).
    store.closeDialogue();
    store.closePuzzle();
    store.setMenu("none");

    this.npcs = [];
    this.mapTransitionInProgress = false;

    this.mapId = store.save.player.mapId;
    const map = getMap(this.mapId);
    store.visitRoom(map.id);

    this.grid = renderMap(this, map);

    for (const npc of map.npcs) {
      this.npcs.push(new NpcActor(this, npc, map.tileSize));
    }

    for (const it of map.interactables) {
      this.spawnInteractableIcon(it, map.tileSize);
    }

    this.player = new PlayerController(
      this,
      store.save.player.x,
      store.save.player.y,
      store.save.player.facing,
      store.save.player.appearance.colorway,
    );

    const { width, height } = mapPixelSize(map);
    this.cameras.main.setBounds(0, 0, width, height);
    this.cameras.main.startFollow(this.player.container, true, 0.12, 0.12);
    this.cameras.main.setZoom(1.4);
    this.cameras.main.fadeIn(220, 20, 14, 28);

    this.input$ = new InputManager(this);

    this.hintText = this.add
      .text(0, 0, "", {
        fontFamily: "Avenir Next, sans-serif",
        fontSize: "13px",
        color: "#fff6ea",
        backgroundColor: "#14101cdd",
        padding: { x: 8, y: 4 },
      })
      .setDepth(50)
      .setScrollFactor(1)
      .setVisible(false);

    // Guard every handler with isActive(): React StrictMode's dev-only
    // double-mount destroys a first Phaser.Game instance whose scenes emit
    // DESTROY, not SHUTDOWN — if a window listener from that discarded
    // instance ever fired, `this.scene` (ScenePlugin) is already torn down
    // and `this.scene.start(...)` throws. Belt-and-suspenders: listeners
    // are removed on both events below, AND check liveness before acting.
    const onDebugTeleport = (e: Event) => {
      if (!this.sys?.isActive()) return;
      const { x, y } = (e as CustomEvent<{ x: number; y: number }>).detail;
      this.player.container.setPosition(x, y);
    };
    const onDebugMapChanged = () => {
      if (!this.sys?.isActive()) return;
      this.mapTransitionInProgress = true;
      this.scene.restart();
    };
    const onDebugTriggerEncounter = () => {
      if (!this.sys?.isActive()) return;
      this.commitPosition();
      this.scene.start("BattleScene");
    };
    window.addEventListener("hba:debug-teleport", onDebugTeleport);
    window.addEventListener("hba:debug-map-changed", onDebugMapChanged);
    window.addEventListener("hba:debug-trigger-encounter", onDebugTriggerEncounter);

    const cleanupDebugListeners = () => {
      window.removeEventListener("hba:debug-teleport", onDebugTeleport);
      window.removeEventListener("hba:debug-map-changed", onDebugMapChanged);
      window.removeEventListener("hba:debug-trigger-encounter", onDebugTriggerEncounter);
    };
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      // Skip if we're shutting down BECAUSE the player/map already moved
      // on purpose (an exit or debug teleport) — committing here would
      // overwrite that fresh position with this scene's stale one.
      if (!this.mapTransitionInProgress) {
        this.commitPosition();
      }
      cleanupDebugListeners();
    });
    this.events.once(Phaser.Scenes.Events.DESTROY, cleanupDebugListeners);
  }

  private spawnInteractableIcon(it: InteractablePlacement, tileSize: number) {
    const key = ensureInteractableTexture(this, it.kind);
    const { x, y } = tileToPixel(it, tileSize);
    const img = this.add.image(x, y, key).setDepth(5);
    if (it.kind === "savePoint") {
      this.tweens.add({
        targets: img,
        alpha: { from: 0.6, to: 1 },
        scale: { from: 0.9, to: 1.08 },
        duration: 900,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
      });
      img.setTint(PALETTE.savePointGlow);
    }
  }

  private commitPosition() {
    const store = useGameStore.getState();
    store.setPlayerPosition(this.player.x, this.player.y, this.player.facing);
  }

  private uiBlocking(): boolean {
    const ui = useGameStore.getState().ui;
    return ui.dialogueOpen || ui.puzzleId !== null || ui.menuOpen !== "none";
  }

  update(_time: number, delta: number) {
    const input = this.input$.read();

    this.commitTimer += delta;
    if (this.commitTimer > COMMIT_INTERVAL_MS) {
      this.commitTimer = 0;
      if (!this.mapTransitionInProgress) this.commitPosition();
    }

    for (const npc of this.npcs) npc.update(delta);

    if (this.uiBlocking()) {
      // Dialogue/puzzle/menu are DOM input islands with their own keydown
      // listeners (see DialogueBox) — the scene's only job while blocked
      // is to not move the player and hide the world-space interact hint.
      this.hintText.setVisible(false);
      return;
    }

    if (input.cancelPressed) {
      useGameStore.getState().setMenu("pause");
      return;
    }

    this.player.update(delta, input.moveX, input.moveY, input.running, this.grid);

    this.handleProximity(input.interactPressed);
    this.handleExits();
    this.handleEncounterTouch();
  }

  private nearestWithin<T extends { x: number; y: number }>(
    items: T[],
    radius: number,
  ): T | null {
    let best: T | null = null;
    let bestDist = radius;
    for (const item of items) {
      const d = Phaser.Math.Distance.Between(this.player.x, this.player.y, item.x, item.y);
      if (d <= bestDist) {
        bestDist = d;
        best = item;
      }
    }
    return best;
  }

  private handleProximity(interactPressed: boolean) {
    const map = getMap(this.mapId);
    const store = useGameStore.getState();

    const npcPoints = this.npcs
      .filter((n) => n.def.dialogueId)
      .map((n) => ({ x: n.x, y: n.y, ref: n }));
    const nearNpc = this.nearestWithin(npcPoints, INTERACT_RADIUS);

    const interactablePoints = map.interactables.map((it) => {
      const p = tileToPixel(it, map.tileSize);
      return { x: p.x, y: p.y, ref: it };
    });
    const nearInteractable = this.nearestWithin(interactablePoints, INTERACT_RADIUS);

    let hint = "";
    if (nearNpc) hint = "Z — Talk";
    else if (nearInteractable) hint = `Z — ${nearInteractable.ref.label}`;

    if (hint) {
      this.hintText.setText(hint);
      this.hintText.setPosition(this.player.x - this.hintText.width / 2, this.player.y - 50);
      this.hintText.setVisible(true);
    } else {
      this.hintText.setVisible(false);
    }

    if (!interactPressed) return;

    if (nearNpc) {
      dialogueEngine.start(getDialogueTree(nearNpc.ref.def.dialogueId));
      return;
    }

    if (nearInteractable) {
      const it = nearInteractable.ref;
      const timelineLocked =
        it.requiresTimelineFlag !== undefined && !store.timeline[it.requiresTimelineFlag];
      if ((it.requiresFlag && !store.getFlag(it.requiresFlag)) || timelineLocked) {
        dialogueEngine.start({
          id: "locked",
          pickStart: () => "line",
          nodes: {
            line: {
              id: "line",
              speakerId: null,
              expression: "neutral",
              text: "It's locked. Whatever opens this hasn't happened yet.",
              next: null,
            },
          },
        });
        return;
      }
      switch (it.kind) {
        case "savePoint":
          activateMemoryStar(map.name);
          break;
        case "puzzle":
          store.openPuzzle(it.puzzleId ?? it.id);
          break;
        case "noticeboard":
        case "sign":
          dialogueEngine.start(getDialogueTree(it.dialogueId!));
          break;
        case "bossStage":
          useEphemeralStore.getState().setPendingEncounter(it.encounterId ?? "stray_thought");
          this.commitPosition();
          store.autosave();
          store.setPhase("battle");
          this.scene.start("BattleScene");
          break;
      }
    }
  }

  private handleExits() {
    if (this.mapTransitionInProgress) return; // already fading out to another map
    const map = getMap(this.mapId);
    for (const exit of map.exits) {
      const p = tileToPixel(exit, map.tileSize);
      const d = Phaser.Math.Distance.Between(this.player.x, this.player.y, p.x, p.y);
      if (d < 24) {
        const store = useGameStore.getState();
        const targetPixel = tileToPixel(exit.targetSpawn, getMap(exit.targetMapId).tileSize);
        store.setPlayerMap(exit.targetMapId, targetPixel.x, targetPixel.y);
        this.mapTransitionInProgress = true;
        store.autosave();
        this.cameras.main.fadeOut(180, 20, 14, 28);
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
          this.scene.restart();
        });
        return;
      }
    }
  }

  private handleEncounterTouch() {
    const store = useGameStore.getState();
    for (const npc of this.npcs) {
      if (!npc.def.encounterId) continue;
      const d = Phaser.Math.Distance.Between(this.player.x, this.player.y, npc.x, npc.y);
      if (d < TOUCH_RADIUS) {
        useEphemeralStore.getState().setPendingEncounter(npc.def.encounterId);
        this.commitPosition();
        store.autosave();
        store.setPhase("battle");
        this.scene.start("BattleScene");
        return;
      }
    }
  }
}
