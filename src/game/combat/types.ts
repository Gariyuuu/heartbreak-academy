import type { GameStore } from "../state/store";

export interface EmotionalState {
  anger: number;
  trust: number;
  fear: number;
  embarrassment: number;
  confidence: number;
  curiosity: number;
}

export const NEUTRAL_EMOTIONAL_STATE: EmotionalState = {
  anger: 0,
  trust: 0,
  fear: 0,
  embarrassment: 0,
  confidence: 0,
  curiosity: 0,
};

export interface ActContext {
  state: EmotionalState;
  actsUsed: Set<string>;
  store: GameStore;
}

export interface ActOption {
  id: string;
  label: string;
  /** returns the delta to apply to each emotional dimension */
  effect: (ctx: ActContext) => Partial<EmotionalState>;
  responseText: (ctx: ActContext) => string;
  /** hide after first use */
  oncePerBattle?: boolean;
  /** only offered once these ACT ids have already been used */
  requiresPriorActs?: string[];
  /** only offered once these flags are true in emotional state (min thresholds) */
  requiresState?: Partial<EmotionalState>;
}

export interface EnemyPhaseDef {
  id: string;
  /** phase becomes active once enemy HP fraction drops to/below this (1 = start) */
  hpFractionAtOrBelow: number;
  patternId: string;
  dodgeDurationMs: number;
  onEnter?: string[]; // log lines announced when entering this phase
}

export interface EnemyDef {
  id: string;
  name: string;
  title: string;
  maxHp: number;
  attackDamage: number; // per bullet hit, before any player mitigation
  defense: number; // subtracted from FIGHT damage (min 1)
  isBoss: boolean;
  canFlee: boolean;
  /** static for most enemies; a function for the rare boss whose intro
   * needs to read live meta-save data (see the_accumulation) */
  introLines: string[] | ((store: GameStore) => string[]);
  acts: ActOption[];
  spareCondition: (ctx: ActContext) => boolean;
  spareResponseLines: string[];
  defeatLines: string[];
  fleeSuccessChance: number;
  phases: EnemyPhaseDef[]; // ordered by hpFractionAtOrBelow descending; index 0 = opening phase
  itemDrops?: string[];
  expReward: number;
  /** called once the battle resolves via SPARE or FIGHT-defeat — the place
   * for boss-specific flags/relationship bumps instead of hardcoding enemy
   * ids in battleStore. */
  onResolved?: (store: GameStore, outcome: "spared" | "defeated") => void;
}
