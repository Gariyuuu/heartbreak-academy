import type { EnemyDef } from "../../game/combat/types";

// Unlocked at the Courtyard pond, once you've spared or defeated the
// regular Stray Thought anywhere it appears (Arrival Hall or Courtyard —
// either sets the shared flag). The pond's flavor text has said
// "something moves under the surface, unbothered by you noticing" since
// the region was first built; this is that something. Not a bigger
// threat so much as the one worry that never got small enough to drift
// off on its own.
export const strayThoughtBoss: EnemyDef = {
  id: "stray_thought_boss",
  name: "Stray Thought",
  title: "The One That Didn't Drift Off",
  maxHp: 38,
  attackDamage: 3,
  defense: 1,
  isBoss: true,
  canFlee: false,
  fleeSuccessChance: 0,
  expReward: 24,
  introLines: [
    "The pond's surface breaks, once, and something rises out of it that's shaped like every small worry you've listened to so far, except this one never got light enough to leave.",
    "It doesn't drift. It just waits, the way it's apparently been waiting the whole time you've been here.",
  ],
  defeatLines: [
    "It scatters into quiet static, same as the small ones do, except the pond stays disturbed for a while after.",
    "You get the feeling it didn't get to finish saying whatever this one was about.",
  ],
  spareResponseLines: [
    '"...oh," it says, finally, the same small startled voice as always, just underneath something heavier. "You actually — okay."',
    "It sinks back under the surface, unhurried, and the pond settles back to perfectly still.",
  ],
  itemDrops: ["quiet-static"],
  onResolved: (store, outcome) => {
    store.setFlag("stray_thought_boss_resolved", true);
    store.recordBossOutcome("stray_thought_boss", outcome);
  },
  acts: [
    {
      id: "ask_why_it_never_drifted_off",
      label: "Ask why it never drifted off",
      effect: () => ({ curiosity: 2, trust: 1 }),
      responseText: () => '"Because nobody got this far down," it says. Not an accusation. Just an observation.',
    },
    {
      id: "admit_youve_been_avoiding_this_one",
      label: "Admit you've been avoiding this one",
      requiresPriorActs: ["ask_why_it_never_drifted_off"],
      effect: () => ({ trust: 2, fear: -1, embarrassment: 1 }),
      responseText: () => "It doesn't argue. It just waits a little more patiently, now that you've said it out loud.",
    },
    {
      id: "tell_it_youre_ready_to_actually_hear_it",
      label: "Tell it you're ready to actually hear it",
      effect: (ctx) => ({ trust: ctx.store.save.route.deaths > 0 ? 3 : 2, fear: -1 }),
      responseText: () => "It starts talking, finally, all the way through — not loud, not urgent. Just long overdue.",
    },
    {
      id: "stop_dodging_and_let_it_rest",
      label: "Stop dodging and let it rest, for real this time",
      requiresPriorActs: ["admit_youve_been_avoiding_this_one", "tell_it_youre_ready_to_actually_hear_it"],
      effect: () => ({ trust: 3, fear: -2 }),
      responseText: () => "You hold still. It drifts all the way up and just... stays there, the way the small ones do, except it takes longer to feel light.",
    },
  ],
  spareCondition: (ctx) => ctx.state.trust >= 7 && ctx.state.fear <= 0,
  phases: [
    {
      id: "phase1",
      hpFractionAtOrBelow: 1,
      patternId: "stray_thought_wave",
      dodgeDurationMs: 4800,
      onEnter: ["The same gentle drifting bubbles as every small Stray Thought — just more of them, and closer together."],
    },
    {
      id: "phase2",
      hpFractionAtOrBelow: 0.45,
      patternId: "stray_thought_flood",
      dodgeDurationMs: 5400,
      onEnter: ["It stops holding anything back."],
    },
  ],
};
