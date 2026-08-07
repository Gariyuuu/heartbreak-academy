import type { Arena, BulletField } from "./BulletField";

export interface PatternTickContext {
  elapsedMs: number;
  deltaMs: number;
  arena: Arena;
  field: BulletField;
  heart: { x: number; y: number };
}

export interface BulletPattern {
  id: string;
  /** called once when the dodge phase using this pattern begins */
  reset: () => void;
  /** called every frame during the dodge phase */
  tick: (ctx: PatternTickContext) => void;
}
