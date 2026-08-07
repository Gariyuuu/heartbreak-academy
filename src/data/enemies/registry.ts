import type { EnemyDef } from "../../game/combat/types";
import { strayThought } from "./strayThought";
import { mikaBoss } from "./mikaBoss";
import { runawayMetaphor } from "./runawayMetaphor";
import { strayEquation } from "./strayEquation";
import { glitchSprite } from "./glitchSprite";
import { reinaBoss } from "./reinaBoss";
import { akariBoss } from "./akariBoss";
import { flicker } from "./flicker";
import { reflection } from "./reflection";
import { reflectionBoss } from "./reflectionBoss";
import { flickerBoss } from "./flickerBoss";
import { runawayMetaphorBoss } from "./runawayMetaphorBoss";
import { strayThoughtBoss } from "./strayThoughtBoss";
import { glitchSpriteBoss } from "./glitchSpriteBoss";
import { strayEquationBoss } from "./strayEquationBoss";
import { theAccumulationBoss } from "./theAccumulationBoss";

export const ENEMY_REGISTRY: Record<string, EnemyDef> = {
  stray_thought: strayThought,
  mika_boss: mikaBoss,
  runaway_metaphor: runawayMetaphor,
  stray_equation: strayEquation,
  glitch_sprite: glitchSprite,
  reina_boss: reinaBoss,
  akari_boss: akariBoss,
  flicker: flicker,
  reflection: reflection,
  reflection_boss: reflectionBoss,
  flicker_boss: flickerBoss,
  runaway_metaphor_boss: runawayMetaphorBoss,
  stray_thought_boss: strayThoughtBoss,
  glitch_sprite_boss: glitchSpriteBoss,
  stray_equation_boss: strayEquationBoss,
  the_accumulation: theAccumulationBoss,
};

export function getEnemy(id: string): EnemyDef {
  const enemy = ENEMY_REGISTRY[id];
  if (!enemy) throw new Error(`Unknown enemy id: ${id}`);
  return enemy;
}
