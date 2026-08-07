import { create } from "zustand";
import { NEUTRAL_EMOTIONAL_STATE, type ActContext, type EmotionalState } from "../combat/types";
import { getEnemy } from "../../data/enemies/registry";
import { getItem } from "../../data/items/registry";
import { useGameStore } from "./store";
import { audioManager } from "../audio/AudioManager";

export type TurnPhase = "intro" | "menu" | "act" | "item" | "fight" | "dodge" | "ended";
export type BattleResult = "none" | "victory" | "spared" | "fled" | "defeat";

export interface BattleLogEntry {
  id: number;
  text: string;
}

let logCounter = 0;

interface BattleStoreState {
  enemyId: string;
  enemyHp: number;
  emotional: EmotionalState;
  phaseIndex: number;
  turnPhase: TurnPhase;
  result: BattleResult;
  log: BattleLogEntry[];
  actsUsed: string[];
  guarding: boolean;
  spareAvailable: boolean;
  dodgeSeed: number;

  init: (enemyId: string) => void;
  pushLog: (text: string) => void;
  setTurnPhase: (phase: TurnPhase) => void;
  openAct: () => void;
  openItem: () => void;
  chooseFight: () => void;
  closeSubmenu: () => void;
  beginMenu: () => void;
  performAct: (actId: string) => void;
  performItem: (itemId: string) => void;
  performGuard: () => void;
  performFightDamage: (amount: number) => void;
  performSpare: () => void;
  performFlee: () => void;
  damageEnemy: (amount: number) => void;
  currentActContext: () => ActContext;
  refreshSpareAvailability: () => void;
  advanceAfterPlayerAction: () => void;
  currentPhase: () => { patternId: string; dodgeDurationMs: number } | null;
  hitByBullet: (amount: number) => void;
  endEnemyTurn: () => void;
}

export const useBattleStore = create<BattleStoreState>((set, get) => ({
  enemyId: "",
  enemyHp: 0,
  emotional: { ...NEUTRAL_EMOTIONAL_STATE },
  phaseIndex: 0,
  turnPhase: "intro",
  result: "none",
  log: [],
  actsUsed: [],
  guarding: false,
  spareAvailable: false,
  dodgeSeed: 0,

  init: (enemyId) => {
    const enemy = getEnemy(enemyId);
    logCounter = 0;
    const store = useGameStore.getState();
    store.setFlag(`seen_enemy_${enemyId}`, true);
    const introLines = typeof enemy.introLines === "function" ? enemy.introLines(store) : enemy.introLines;
    set({
      enemyId,
      enemyHp: enemy.maxHp,
      emotional: { ...NEUTRAL_EMOTIONAL_STATE },
      phaseIndex: 0,
      turnPhase: "intro",
      result: "none",
      log: introLines.map((text) => ({ id: logCounter++, text })),
      actsUsed: [],
      guarding: false,
      spareAvailable: false,
      dodgeSeed: 0,
    });
  },

  pushLog: (text) => set((s) => ({ log: [...s.log.slice(-30), { id: logCounter++, text }] })),

  setTurnPhase: (phase) => set({ turnPhase: phase }),

  openAct: () => set({ turnPhase: "act" }),
  openItem: () => set({ turnPhase: "item" }),
  chooseFight: () => set({ turnPhase: "fight" }),
  closeSubmenu: () => set({ turnPhase: "menu" }),
  beginMenu: () => set({ turnPhase: "menu" }),

  currentActContext: () => ({
    state: get().emotional,
    actsUsed: new Set(get().actsUsed),
    store: useGameStore.getState(),
  }),

  performAct: (actId) => {
    const enemy = getEnemy(get().enemyId);
    const act = enemy.acts.find((a) => a.id === actId);
    if (!act) return;
    const ctx = get().currentActContext();
    const delta = act.effect(ctx);
    const nextEmotional: EmotionalState = { ...get().emotional };
    for (const key of Object.keys(delta) as (keyof EmotionalState)[]) {
      const v = (nextEmotional[key] ?? 0) + (delta[key] ?? 0);
      nextEmotional[key] = Math.max(0, Math.min(10, v));
    }
    const responseCtx = { ...ctx, state: nextEmotional };
    const response = act.responseText(responseCtx);
    // Every performed act is recorded (for requiresPriorActs lookups),
    // even ones that aren't oncePerBattle — ActMenu is what decides
    // whether a repeatable act stays visible after use, not this list.
    set((s) => ({
      emotional: nextEmotional,
      actsUsed: s.actsUsed.includes(actId) ? s.actsUsed : [...s.actsUsed, actId],
    }));
    get().pushLog(response);
    get().refreshSpareAvailability();
    get().advanceAfterPlayerAction();
  },

  performItem: (itemId) => {
    const store = useGameStore.getState();
    const def = getItem(itemId);
    if (!def || def.category !== "consumable" || !def.onUse) return;
    const had = store.removeItem(itemId, 1);
    if (!had) return;
    const result = def.onUse(store);
    if (result.consumed) get().pushLog(result.message);
    get().advanceAfterPlayerAction();
  },

  performGuard: () => {
    set({ guarding: true });
    get().pushLog("You brace yourself, ready to block.");
    get().advanceAfterPlayerAction();
  },

  performFightDamage: (amount) => {
    get().damageEnemy(amount);
    get().pushLog(amount > 0 ? `You land a hit for ${amount} damage.` : "Your attack goes wide.");
    if (get().result === "none") get().advanceAfterPlayerAction();
  },

  performSpare: () => {
    if (!get().spareAvailable) return;
    audioManager.spare();
    const enemy = getEnemy(get().enemyId);
    set({ result: "spared", turnPhase: "ended" });
    for (const line of enemy.spareResponseLines) get().pushLog(line);
    const store = useGameStore.getState();
    store.recordSpare();
    if (enemy.itemDrops?.length) {
      for (const item of enemy.itemDrops) store.addItem(item, 1);
    }
    enemy.onResolved?.(store, "spared");
  },

  performFlee: () => {
    const enemy = getEnemy(get().enemyId);
    if (!enemy.canFlee) {
      get().pushLog("There's no fleeing this one.");
      return;
    }
    if (Math.random() < enemy.fleeSuccessChance) {
      set({ result: "fled", turnPhase: "ended" });
      useGameStore.getState().recordFlee();
      get().pushLog("You get away safely.");
    } else {
      get().pushLog("You can't find an opening to run!");
      get().advanceAfterPlayerAction();
    }
  },

  damageEnemy: (amount) => {
    const nextHp = Math.max(0, get().enemyHp - amount);
    set({ enemyHp: nextHp });
    if (nextHp <= 0) {
      const enemy = getEnemy(get().enemyId);
      set({ result: "victory", turnPhase: "ended" });
      for (const line of enemy.defeatLines) get().pushLog(line);
      const store = useGameStore.getState();
      store.recordDefeat();
      if (enemy.itemDrops?.length) {
        for (const item of enemy.itemDrops) store.addItem(item, 1);
      }
      enemy.onResolved?.(store, "defeated");
      return;
    }
    const enemy = getEnemy(get().enemyId);
    const fraction = nextHp / enemy.maxHp;
    const nextPhaseIndex = enemy.phases.findIndex((p, i) => {
      const isLast = i === enemy.phases.length - 1;
      const next = enemy.phases[i + 1];
      return fraction <= p.hpFractionAtOrBelow && (isLast || fraction > (next?.hpFractionAtOrBelow ?? 0));
    });
    if (nextPhaseIndex >= 0 && nextPhaseIndex !== get().phaseIndex) {
      set({ phaseIndex: nextPhaseIndex });
      const phase = enemy.phases[nextPhaseIndex];
      for (const line of phase.onEnter ?? []) get().pushLog(line);
    }
  },

  refreshSpareAvailability: () => {
    const enemy = getEnemy(get().enemyId);
    const ctx = get().currentActContext();
    set({ spareAvailable: enemy.spareCondition(ctx) });
  },

  currentPhase: () => {
    const enemy = getEnemy(get().enemyId);
    return enemy.phases[get().phaseIndex] ?? enemy.phases[0] ?? null;
  },

  advanceAfterPlayerAction: () => {
    if (get().result !== "none") return;
    set({ turnPhase: "dodge", dodgeSeed: get().dodgeSeed + 1 });
  },

  hitByBullet: (amount) => {
    const store = useGameStore.getState();
    const mitigated = get().guarding ? Math.ceil(amount * 0.4) : amount;
    audioManager.damage();
    store.damagePlayer(mitigated);
    get().pushLog(get().guarding ? `Blocked! You take ${mitigated} damage.` : `Hit! You take ${mitigated} damage.`);
    if (useGameStore.getState().save.player.hp <= 0) {
      set({ result: "defeat", turnPhase: "ended" });
      useGameStore.getState().recordDeath();
    }
  },

  endEnemyTurn: () => {
    if (get().result !== "none") return;
    set({ turnPhase: "menu", guarding: false });
  },
}));
