import type { GameStore } from "../state/store";

export type Expression =
  | "neutral"
  | "happy"
  | "laughing"
  | "angry"
  | "sad"
  | "embarrassed"
  | "shocked"
  | "afraid"
  | "determined"
  | "glitch";

export interface DialogueChoiceDef {
  text: string;
  next: string | null;
  condition?: (store: GameStore) => boolean;
  onSelect?: (store: GameStore) => void;
}

export interface DialogueNodeDef {
  id: string;
  speakerId: string | null;
  speakerNameOverride?: string;
  expression: Expression;
  text: string | ((store: GameStore) => string);
  next?: string | null;
  choices?: DialogueChoiceDef[];
  onEnter?: (store: GameStore) => void;
  condition?: (store: GameStore) => boolean;
  /** if condition fails, jump here instead */
  fallback?: string;
}

export interface DialogueTreeDef {
  id: string;
  /** picks the entry node id; lets a tree vary on repeat visits */
  pickStart: (store: GameStore) => string;
  nodes: Record<string, DialogueNodeDef>;
}
