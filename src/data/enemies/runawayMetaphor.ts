import type { EnemyDef } from "../../game/combat/types";

// Thematic pair with Yuna's whole arc: this enemy is anxious about being
// unfinished. Where Stray Thought needed to be heard, this one needs
// permission to stay incomplete — SPARE isn't about resolving it, it's
// about NOT resolving it.
export const runawayMetaphor: EnemyDef = {
  id: "runaway_metaphor",
  name: "Runaway Metaphor",
  title: "A comparison that got loose",
  maxHp: 22,
  attackDamage: 2,
  defense: 2,
  isBoss: false,
  canFlee: true,
  fleeSuccessChance: 0.75,
  expReward: 8,
  introLines: [
    "A Runaway Metaphor unspools itself from between two shelves, already halfway through explaining what it's like.",
  ],
  defeatLines: [
    "The Runaway Metaphor collapses into a period, then nothing.",
    "It never got to finish the comparison.",
  ],
  spareResponseLines: [
    '"...it\'s like— " it starts, and then just stops, and seems relieved to have stopped.',
    "It settles into the space between two sentences and stays there, unfinished and fine with it.",
  ],
  itemDrops: ["sweet-tea"],
  onResolved: (store) => store.setFlag("metaphor_faced", true),
  acts: [
    {
      id: "ask_clarify",
      label: "Ask it to clarify",
      effect: () => ({ curiosity: 2, embarrassment: 1 }),
      responseText: () => '"It\'s like— okay, it\'s like when— " It loses the thread immediately. This seems to happen a lot.',
    },
    {
      id: "finish_sentence",
      label: "Finish its sentence for it",
      effect: () => ({ embarrassment: 2, trust: 1 }),
      responseText: () => 'It blinks. "...maybe? Sure. Let\'s say that\'s what I meant." It seems both relieved and a little bothered.',
    },
    {
      id: "doesnt_need_to_be_perfect",
      label: "Tell it the comparison doesn't need to be perfect",
      requiresPriorActs: ["ask_clarify"],
      effect: () => ({ trust: 2, fear: -1, embarrassment: -1 }),
      responseText: () => 'Something in it unclenches. "...it doesn\'t?" No. It really doesn\'t.',
    },
    {
      id: "let_stay_unfinished",
      label: "Let it stay unfinished",
      requiresPriorActs: ["doesnt_need_to_be_perfect", "finish_sentence"],
      effect: () => ({ trust: 3, fear: -2 }),
      responseText: () => "You stop waiting for the ending. It stops reaching for one.",
    },
  ],
  spareCondition: (ctx) => ctx.state.trust >= 6 && ctx.state.fear <= 1,
  phases: [
    { id: "only", hpFractionAtOrBelow: 1, patternId: "ink_scatter", dodgeDurationMs: 4400 },
  ],
};
