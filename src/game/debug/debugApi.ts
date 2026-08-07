import { useGameStore } from "../state/store";
import { useEphemeralStore } from "../state/ephemeral";
import { useSettingsStore } from "../state/settingsStore";
import { getMap } from "../maps/registry";
import { tileToPixel } from "../maps/types";
import { dialogueEngine } from "../dialogue/DialogueEngine";
import { getDialogueTree } from "../../data/dialogue/registry";

/**
 * Dev-only debug surface (section 42 of the design doc). Never imported
 * by production UI paths — only wired up behind `import.meta.env.DEV` in
 * main.tsx and DebugPanel.tsx. Safe to call from an external driver (e.g.
 * a Playwright smoke test) via `window.__HBA_DEBUG__`.
 */
export const debugApi = {
  /** live-teleports the player sprite if OverworldScene is listening, and
   * updates the store so it survives the next position commit either way */
  teleportToTile(col: number, row: number) {
    const store = useGameStore.getState();
    const map = getMap(store.save.player.mapId);
    const p = tileToPixel({ col, row }, map.tileSize);
    store.setPlayerPosition(p.x, p.y);
    window.dispatchEvent(new CustomEvent("hba:debug-teleport", { detail: { x: p.x, y: p.y } }));
  },
  teleportToMap(mapId: string, col: number, row: number) {
    const map = getMap(mapId);
    const p = tileToPixel({ col, row }, map.tileSize);
    useGameStore.getState().setPlayerMap(mapId, p.x, p.y);
    window.dispatchEvent(new CustomEvent("hba:debug-map-changed"));
  },
  setHp(hp: number) {
    const store = useGameStore.getState();
    store.healPlayer(hp - store.save.player.hp);
  },
  giveItem(id: string, qty = 1) {
    useGameStore.getState().addItem(id, qty);
  },
  setFlag(key: string, value: boolean | number | string) {
    useGameStore.getState().setFlag(key, value);
  },
  setAffection(characterId: string, value: number) {
    const store = useGameStore.getState();
    const current = store.save.relationships[characterId]?.affection ?? 0;
    store.adjustAffection(characterId, value - current);
  },
  triggerEncounter(enemyId: string) {
    useEphemeralStore.getState().setPendingEncounter(enemyId);
    useGameStore.getState().setPhase("battle");
    window.dispatchEvent(new CustomEvent("hba:debug-trigger-encounter"));
  },
  getState() {
    return useGameStore.getState().save;
  },
  getUiState() {
    return useGameStore.getState().ui;
  },
  getPlayerWorldPos() {
    return { x: useGameStore.getState().save.player.x, y: useGameStore.getState().save.player.y };
  },
  setInstantText(on: boolean) {
    useSettingsStore.getState().setTextSpeed(on ? "instant" : "normal");
  },
  /** starts any registered dialogue tree by id, bypassing NPC proximity */
  directStartDialogue(id: string) {
    try {
      dialogueEngine.start(getDialogueTree(id));
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e instanceof Error ? e.message : String(e) };
    }
  },
  resetSave() {
    localStorage.clear();
    window.location.reload();
  },
};

export type DebugApi = typeof debugApi;
