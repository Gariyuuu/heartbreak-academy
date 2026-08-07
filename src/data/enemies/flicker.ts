import type { EnemyDef } from "../../game/combat/types";

// The first enemy that isn't warm or funny about what it wants — quieter
// unease rather than a joke wrapped around a worry. It doesn't want to be
// stared at, but it can't stand being ignored either. Spare means finding
// the middle: acknowledged, not fixated on.
export const flicker: EnemyDef = {
  id: "flicker",
  name: "Flicker",
  title: "???",
  maxHp: 22,
  attackDamage: 2,
  defense: 2,
  isBoss: false,
  canFlee: true,
  fleeSuccessChance: 0.7,
  expReward: 9,
  introLines: [
    "The maintenance lights stutter, and something made of the stutter steps out of the wall fixture.",
  ],
  defeatLines: [
    "Flicker goes out. Actually out — the hallway is darker than it was a moment ago.",
    "The fixture it came from doesn't turn back on.",
  ],
  spareResponseLines: [
    "It settles into a steady, ordinary glow — not bright, not fixated. Just on.",
    "You look away first, on purpose, and it doesn't seem to mind anymore.",
  ],
  itemDrops: ["cafeteria-bun"],
  onResolved: (store) => store.setFlag("flicker_faced", true),
  acts: [
    {
      id: "look_away_briefly",
      label: "Look away, briefly",
      effect: () => ({ trust: 1, fear: -1 }),
      responseText: () => "The stutter slows, just slightly, like something that was bracing for a reaction relaxing a little.",
    },
    {
      id: "acknowledge_without_staring",
      label: "Acknowledge it without staring",
      requiresPriorActs: ["look_away_briefly"],
      effect: () => ({ trust: 2, curiosity: 1 }),
      responseText: () => '"...oh," it seems to say, without a mouth. Something about being noticed correctly, for once.',
    },
    {
      id: "ask_what_it_needs",
      label: "Ask what it actually needs",
      effect: () => ({ curiosity: 2 }),
      responseText: () => "It doesn't have an answer ready. That, at least, feels honest.",
    },
    {
      id: "offer_steady_attention",
      label: "Offer it steady attention, not fixation",
      requiresPriorActs: ["acknowledge_without_staring", "ask_what_it_needs"],
      effect: () => ({ trust: 3, fear: -2 }),
      responseText: () => "The stutter stops entirely. It just glows, plainly, like it forgot it was supposed to be unsettling.",
    },
  ],
  spareCondition: (ctx) => ctx.state.trust >= 6 && ctx.state.fear <= 1,
  phases: [
    { id: "only", hpFractionAtOrBelow: 1, patternId: "flicker_pulse", dodgeDurationMs: 4400 },
  ],
};
