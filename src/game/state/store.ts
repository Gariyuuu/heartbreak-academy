import { create } from "zustand";
import {
  createDefaultSave,
  createDefaultTimeline,
  type Facing,
  type GameSaveState,
  type Pronouns,
  type PlayerAppearance,
  type QuestStatus,
  type RouteLeaning,
  type TimelineState,
} from "../save/schema";
import { saveManager } from "../save/saveManager";
import type { Expression } from "../dialogue/types";
import { getEffectiveMaxHp } from "./derived";

export type GamePhase =
  | "boot"
  | "title"
  | "characterCreate"
  | "cutscene"
  | "overworld"
  | "battle"
  | "gameOver"
  | "ending";

export interface DialogueChoice {
  text: string;
  next: string | null;
}

export interface ActiveDialogueLine {
  speakerId: string | null;
  speakerName: string;
  expression: Expression;
  text: string;
  choices: DialogueChoice[] | null;
}

interface UiState {
  dialogueOpen: boolean;
  currentLine: ActiveDialogueLine | null;
  selectedChoiceIndex: number;
  menuOpen: "none" | "pause" | "inventory" | "phone" | "save" | "settings" | "extras";
  toast: string | null;
  puzzleId: string | null;
}

export interface GameStore {
  phase: GamePhase;
  save: GameSaveState;
  timeline: TimelineState;
  ui: UiState;
  activeSlot: number;
  playSessionStart: number;

  // --- phase / flow ---
  setPhase: (phase: GamePhase) => void;
  startNewGamePlus: () => void;
  startNewGame: (opts: {
    name: string;
    pronouns: Pronouns;
    appearance: PlayerAppearance;
  }) => void;
  loadSlot: (slot: number) => boolean;
  loadAutosave: () => boolean;
  saveToSlot: (slot: number) => void;
  autosave: () => void;

  // --- player/movement ---
  setPlayerPosition: (x: number, y: number, facing?: Facing) => void;
  setPlayerMap: (mapId: string, x: number, y: number) => void;
  damagePlayer: (amount: number) => void;
  healPlayer: (amount: number) => void;

  // --- dialogue ---
  openDialogue: (line: ActiveDialogueLine) => void;
  closeDialogue: () => void;
  setSelectedChoiceIndex: (index: number) => void;

  // --- menu ---
  setMenu: (menu: UiState["menuOpen"]) => void;
  showToast: (msg: string) => void;

  // --- puzzle ---
  openPuzzle: (id: string) => void;
  closePuzzle: () => void;

  // --- inventory ---
  addItem: (itemId: string, qty?: number) => void;
  removeItem: (itemId: string, qty?: number) => boolean;
  equipWeapon: (weaponId: string | null) => void;
  equipAccessory: (accessoryId: string | null) => void;

  // --- flags / quests / rooms ---
  setFlag: (key: string, value: boolean | number | string) => void;
  getFlag: (key: string) => boolean | number | string | undefined;
  setQuest: (questId: string, status: QuestStatus) => void;
  visitRoom: (roomId: string) => void;

  // --- relationships ---
  adjustAffection: (characterId: string, delta: number) => void;
  adjustTrust: (characterId: string, delta: number) => void;
  setRelationshipFlag: (characterId: string, flag: string, value: boolean) => void;

  // --- route/consequence ---
  recordSpare: () => void;
  recordDefeat: () => void;
  recordFlee: () => void;
  recordDeath: () => void;
  recordLie: () => void;
  recordPromiseKept: () => void;
  recordPromiseBroken: () => void;
  recordItemStolen: () => void;
  routeLeaning: () => RouteLeaning;

  // --- meta-save (timeline) ---
  recordBossOutcome: (bossId: string, outcome: "spared" | "defeated") => void;
  recordEnding: (endingId: string) => void;
}

function computeRouteLeaning(route: GameSaveState["route"]): RouteLeaning {
  const violence = route.defeatedCount;
  const peace = route.sparedCount;
  if (violence === 0 && peace === 0) return "connection";
  const ratio = violence / Math.max(1, violence + peace);
  if (ratio >= 0.6) return "severance";
  if (ratio <= 0.15) return "connection";
  return "mixed";
}

export const useGameStore = create<GameStore>((set, get) => ({
  phase: "boot",
  save: createDefaultSave(0),
  timeline: saveManager.readTimeline(),
  activeSlot: 0,
  playSessionStart: Date.now(),
  ui: {
    dialogueOpen: false,
    currentLine: null,
    selectedChoiceIndex: 0,
    menuOpen: "none",
    toast: null,
    puzzleId: null,
  },

  setPhase: (phase) => set({ phase }),

  startNewGame: ({ name, pronouns, appearance }) => {
    const fresh = createDefaultSave(get().activeSlot);
    fresh.player.name = name.trim() || "Student";
    fresh.player.pronouns = pronouns;
    fresh.player.appearance = appearance;
    set({
      save: fresh,
      phase: "cutscene",
      playSessionStart: Date.now(),
    });
  },

  startNewGamePlus: () => {
    const timeline: TimelineState = {
      ...get().timeline,
      resets: get().timeline.resets + 1,
      newGamePlusCount: get().timeline.newGamePlusCount + 1,
    };
    saveManager.writeTimeline(timeline);
    set({
      save: createDefaultSave(get().activeSlot),
      timeline,
      phase: "characterCreate",
      playSessionStart: Date.now(),
    });
  },

  loadSlot: (slot) => {
    const found = saveManager.read(slot);
    if (!found) return false;
    set({ save: found, activeSlot: slot, phase: "overworld", playSessionStart: Date.now() });
    return true;
  },

  loadAutosave: () => {
    const found = saveManager.readAutosave();
    if (!found) return false;
    set({ save: found, phase: "overworld", playSessionStart: Date.now() });
    return true;
  },

  saveToSlot: (slot) => {
    const elapsed = (Date.now() - get().playSessionStart) / 1000;
    const updated: GameSaveState = {
      ...get().save,
      playtimeSeconds: get().save.playtimeSeconds + elapsed,
    };
    saveManager.write(slot, updated);
    set({ save: updated, activeSlot: slot, playSessionStart: Date.now() });
  },

  autosave: () => {
    const elapsed = (Date.now() - get().playSessionStart) / 1000;
    const updated: GameSaveState = {
      ...get().save,
      playtimeSeconds: get().save.playtimeSeconds + elapsed,
    };
    saveManager.writeAutosave(updated);
    set({ save: updated, playSessionStart: Date.now() });
  },

  setPlayerPosition: (x, y, facing) =>
    set((s) => ({
      save: {
        ...s.save,
        player: { ...s.save.player, x, y, facing: facing ?? s.save.player.facing },
      },
    })),

  setPlayerMap: (mapId, x, y) =>
    set((s) => ({
      save: { ...s.save, player: { ...s.save.player, mapId, x, y } },
    })),

  damagePlayer: (amount) =>
    set((s) => ({
      save: {
        ...s.save,
        player: { ...s.save.player, hp: Math.max(0, s.save.player.hp - amount) },
      },
    })),

  healPlayer: (amount) =>
    set((s) => ({
      save: {
        ...s.save,
        player: {
          ...s.save.player,
          hp: Math.min(getEffectiveMaxHp(s), s.save.player.hp + amount),
        },
      },
    })),

  openDialogue: (line) =>
    set((s) => ({
      ui: { ...s.ui, dialogueOpen: true, currentLine: line, selectedChoiceIndex: 0 },
    })),

  closeDialogue: () =>
    set((s) => ({
      ui: { ...s.ui, dialogueOpen: false, currentLine: null, selectedChoiceIndex: 0 },
    })),

  setSelectedChoiceIndex: (index) =>
    set((s) => ({ ui: { ...s.ui, selectedChoiceIndex: index } })),

  setMenu: (menu) => set((s) => ({ ui: { ...s.ui, menuOpen: menu } })),

  openPuzzle: (id) => set((s) => ({ ui: { ...s.ui, puzzleId: id } })),
  closePuzzle: () => set((s) => ({ ui: { ...s.ui, puzzleId: null } })),

  showToast: (msg) => {
    set((s) => ({ ui: { ...s.ui, toast: msg } }));
    window.setTimeout(() => {
      set((s) => (s.ui.toast === msg ? { ui: { ...s.ui, toast: null } } : {}));
    }, 3200);
  },

  addItem: (itemId, qty = 1) =>
    set((s) => {
      const items = { ...s.save.inventory.items };
      items[itemId] = (items[itemId] ?? 0) + qty;
      return { save: { ...s.save, inventory: { ...s.save.inventory, items } } };
    }),

  removeItem: (itemId, qty = 1) => {
    const current = get().save.inventory.items[itemId] ?? 0;
    if (current < qty) return false;
    set((s) => {
      const items = { ...s.save.inventory.items };
      const remaining = current - qty;
      if (remaining <= 0) delete items[itemId];
      else items[itemId] = remaining;
      return { save: { ...s.save, inventory: { ...s.save.inventory, items } } };
    });
    return true;
  },

  equipWeapon: (weaponId) =>
    set((s) => ({
      save: { ...s.save, inventory: { ...s.save.inventory, weaponId } },
    })),

  equipAccessory: (accessoryId) =>
    set((s) => ({
      save: { ...s.save, inventory: { ...s.save.inventory, accessoryId } },
    })),

  setFlag: (key, value) =>
    set((s) => ({ save: { ...s.save, flags: { ...s.save.flags, [key]: value } } })),

  getFlag: (key) => get().save.flags[key],

  setQuest: (questId, status) =>
    set((s) => ({ save: { ...s.save, quests: { ...s.save.quests, [questId]: status } } })),

  visitRoom: (roomId) =>
    set((s) =>
      s.save.visitedRooms.includes(roomId)
        ? {}
        : { save: { ...s.save, visitedRooms: [...s.save.visitedRooms, roomId] } },
    ),

  adjustAffection: (characterId, delta) =>
    set((s) => {
      const rel = s.save.relationships[characterId] ?? {
        affection: 0,
        trust: 0,
        flags: {},
      };
      return {
        save: {
          ...s.save,
          relationships: {
            ...s.save.relationships,
            [characterId]: { ...rel, affection: rel.affection + delta },
          },
        },
      };
    }),

  adjustTrust: (characterId, delta) =>
    set((s) => {
      const rel = s.save.relationships[characterId] ?? {
        affection: 0,
        trust: 0,
        flags: {},
      };
      return {
        save: {
          ...s.save,
          relationships: {
            ...s.save.relationships,
            [characterId]: { ...rel, trust: rel.trust + delta },
          },
        },
      };
    }),

  setRelationshipFlag: (characterId, flag, value) =>
    set((s) => {
      const rel = s.save.relationships[characterId] ?? {
        affection: 0,
        trust: 0,
        flags: {},
      };
      return {
        save: {
          ...s.save,
          relationships: {
            ...s.save.relationships,
            [characterId]: { ...rel, flags: { ...rel.flags, [flag]: value } },
          },
        },
      };
    }),

  recordSpare: () =>
    set((s) => ({
      save: {
        ...s.save,
        route: { ...s.save.route, sparedCount: s.save.route.sparedCount + 1 },
      },
    })),

  recordDefeat: () =>
    set((s) => ({
      save: {
        ...s.save,
        route: { ...s.save.route, defeatedCount: s.save.route.defeatedCount + 1 },
      },
    })),

  recordFlee: () =>
    set((s) => ({
      save: {
        ...s.save,
        route: { ...s.save.route, fledCount: s.save.route.fledCount + 1 },
      },
    })),

  recordDeath: () => {
    set((s) => ({
      save: { ...s.save, route: { ...s.save.route, deaths: s.save.route.deaths + 1 } },
    }));
    const timeline: TimelineState = {
      ...get().timeline,
      totalDeaths: get().timeline.totalDeaths + 1,
    };
    saveManager.writeTimeline(timeline);
    set({ timeline });
  },

  recordLie: () =>
    set((s) => ({
      save: { ...s.save, route: { ...s.save.route, liesTold: s.save.route.liesTold + 1 } },
    })),

  recordPromiseKept: () =>
    set((s) => ({
      save: {
        ...s.save,
        route: { ...s.save.route, promisesKept: s.save.route.promisesKept + 1 },
      },
    })),

  recordPromiseBroken: () =>
    set((s) => ({
      save: {
        ...s.save,
        route: { ...s.save.route, promisesBroken: s.save.route.promisesBroken + 1 },
      },
    })),

  recordItemStolen: () =>
    set((s) => ({
      save: {
        ...s.save,
        route: { ...s.save.route, itemsStolen: s.save.route.itemsStolen + 1 },
      },
    })),

  routeLeaning: () => computeRouteLeaning(get().save.route),

  recordBossOutcome: (bossId, outcome) => {
    const timeline = get().timeline;
    const key = outcome === "spared" ? "bossesSparedEver" : "bossesDefeatedEver";
    if (timeline[key].includes(bossId)) return;
    const next: TimelineState = { ...timeline, [key]: [...timeline[key], bossId] };
    saveManager.writeTimeline(next);
    set({ timeline: next });
  },

  recordEnding: (endingId) => {
    const timeline = get().timeline;
    if (timeline.endingsReached.includes(endingId)) return;
    const next: TimelineState = { ...timeline, endingsReached: [...timeline.endingsReached, endingId] };
    saveManager.writeTimeline(next);
    set({ timeline: next });
  },
}));

export function resetTimelineForNewCycle() {
  const timeline = createDefaultTimeline();
  saveManager.writeTimeline(timeline);
  return timeline;
}
