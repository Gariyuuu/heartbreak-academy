import type { EnemyDef } from "../../game/combat/types";

// Unlocked at the unlabeled breaker switch in Underground Maintenance,
// once you've faced the regular Flicker at least once anywhere it
// appears (Underground Maintenance, Abandoned Classroom Block, or Null
// Wing — all three set the same shared flag). Every light in the
// building answers at once instead of just one fixture's worth.
export const flickerBoss: EnemyDef = {
  id: "flicker_boss",
  name: "Flicker",
  title: "Every Third Light",
  maxHp: 40,
  attackDamage: 3,
  defense: 2,
  isBoss: true,
  canFlee: false,
  fleeSuccessChance: 0,
  expReward: 26,
  introLines: [
    "The switch clicks. Every third light in the building answers at once — not just this hallway's — and something made of all of them steps out of the dark between fixtures.",
    '"You keep coming back to the ones like me," it says, in the same stutter as before, except now it holds still enough to finish the sentence.',
  ],
  defeatLines: [
    "Every light that answered goes out at once, all through the building, all the way up. For a second the whole school is dark.",
    "Then, one by one, ordinary and unremarkable, they come back on.",
  ],
  spareResponseLines: [
    '"I wasn\'t trying to be everywhere," it says. "I just didn\'t know how to be anywhere, on my own."',
    "The lights settle into a steady, ordinary glow, all through the building at once — not bright, not fixated. Just on.",
  ],
  itemDrops: ["steady-bulb"],
  onResolved: (store, outcome) => {
    store.setFlag("flicker_boss_resolved", true);
    store.recordBossOutcome("flicker_boss", outcome);
  },
  acts: [
    {
      id: "hold_still_and_let_it_finish",
      label: "Hold still and let it finish talking",
      effect: () => ({ trust: 1, fear: -1 }),
      responseText: () => "It seems startled that you're not looking away this time. It keeps talking anyway.",
    },
    {
      id: "ask_how_many_of_it_there_are",
      label: "Ask how many of it there are",
      requiresPriorActs: ["hold_still_and_let_it_finish"],
      effect: () => ({ trust: 2, curiosity: 1 }),
      responseText: () => '"One," it says, after a pause. "Just — in a lot of places at once. That\'s not the same as more than one. I don\'t think."',
    },
    {
      id: "tell_it_it_doesnt_need_every_fixture",
      label: "Tell it it doesn't need every fixture",
      effect: (ctx) => ({ trust: ctx.store.save.route.deaths > 0 ? 3 : 2, fear: -1 }),
      responseText: () => "The stutter across the whole hallway slows down at once, like something exhaling through every bulb at the same time.",
    },
    {
      id: "offer_to_check_on_just_one_light",
      label: "Offer to check on just one light, regularly",
      requiresPriorActs: ["ask_how_many_of_it_there_are", "tell_it_it_doesnt_need_every_fixture"],
      effect: () => ({ trust: 3, fear: -2 }),
      responseText: () => '"...okay," it says, and for the first time it sounds like it\'s coming from one place instead of everywhere.',
    },
  ],
  spareCondition: (ctx) => ctx.state.trust >= 7 && ctx.state.fear <= 0,
  phases: [
    {
      id: "phase1",
      hpFractionAtOrBelow: 1,
      patternId: "flicker_pulse",
      dodgeDurationMs: 4800,
      onEnter: ["Pulses everywhere at once, off-rhythm on purpose — the same unpredictability as before, just louder."],
    },
    {
      id: "phase2",
      hpFractionAtOrBelow: 0.45,
      patternId: "flicker_cascade",
      dodgeDurationMs: 5400,
      onEnter: ["It stops trying to hide how many places it's coming from."],
    },
  ],
};
