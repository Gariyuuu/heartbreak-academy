import type { EnemyDef } from "../../game/combat/types";

// Unlocked at "A Shelf Without an End" in the Infinite Library, once
// you've faced the regular Runaway Metaphor at least once (Literature
// Wing or the Infinite Library — either sets the shared flag). The whole
// shelf's worth of unfinished sentences, rather than just one.
export const runawayMetaphorBoss: EnemyDef = {
  id: "runaway_metaphor_boss",
  name: "Runaway Metaphor",
  title: "Every Unfinished Sentence",
  maxHp: 42,
  attackDamage: 3,
  defense: 2,
  isBoss: true,
  canFlee: false,
  fleeSuccessChance: 0,
  expReward: 27,
  introLines: [
    "The shelf that isn't supposed to have a corner unspools all at once, every unfinished title on it trying to become a sentence at the same time.",
    '"It\'s like— " they all start together, badly out of sync, and none of them finish.',
  ],
  defeatLines: [
    "Every voice collapses into the same period, all at once, and the shelf goes back to just being a shelf.",
    "You almost feel bad about how quiet it gets.",
  ],
  spareResponseLines: [
    '"...it\'s like—" they say, one more time, together, and then just stop. All of them, at once, and none of them seem bothered by it anymore.',
    "The shelf keeps running around its impossible corner, same as always, except now it doesn't feel like it's straining to.",
  ],
  itemDrops: ["unfinished-bookmark"],
  onResolved: (store, outcome) => {
    store.setFlag("runaway_metaphor_boss_resolved", true);
    store.recordBossOutcome("runaway_metaphor_boss", outcome);
  },
  acts: [
    {
      id: "ask_it_to_just_start_imperfectly",
      label: "Ask it to just start, imperfectly",
      effect: () => ({ curiosity: 2, trust: 1 }),
      responseText: () => '"Okay," it says, all at once, from everywhere on the shelf. "Okay. It\'s like—" Still nothing after that. But it tried.',
    },
    {
      id: "wait_through_the_pause",
      label: "Wait through the pause without filling it",
      requiresPriorActs: ["ask_it_to_just_start_imperfectly"],
      effect: () => ({ trust: 2, fear: -1 }),
      responseText: () => "Nobody rushes to finish the sentence for it this time. The silence holds, and doesn't collapse into anything.",
    },
    {
      id: "admit_you_leave_things_unfinished_too",
      label: "Admit you also leave things unfinished",
      effect: (ctx) => ({ trust: ctx.store.save.route.deaths > 0 ? 3 : 2, embarrassment: 1 }),
      responseText: () => "The whole shelf goes quiet in a way that feels like recognition, not agreement.",
    },
    {
      id: "tell_it_the_shelf_doesnt_need_an_ending",
      label: "Tell it the shelf doesn't need an ending",
      requiresPriorActs: ["wait_through_the_pause", "admit_you_leave_things_unfinished_too"],
      effect: () => ({ trust: 3, fear: -2 }),
      responseText: () => 'Every title on it, all at once, stops reaching for a last word. "...oh," they say together. "Oh, okay."',
    },
  ],
  spareCondition: (ctx) => ctx.state.trust >= 7 && ctx.state.fear <= 0,
  phases: [
    {
      id: "phase1",
      hpFractionAtOrBelow: 1,
      patternId: "ink_scatter",
      dodgeDurationMs: 5000,
      onEnter: ["Ink bursts from between the shelves, the same shape as before — just from the whole wall this time."],
    },
    {
      id: "phase2",
      hpFractionAtOrBelow: 0.45,
      patternId: "ink_flood",
      dodgeDurationMs: 5600,
      onEnter: ["Two origins now, at once — the sentence trying to finish itself twice as fast, and getting no closer."],
    },
  ],
};
