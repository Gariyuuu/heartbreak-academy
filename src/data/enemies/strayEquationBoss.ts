import type { EnemyDef } from "../../game/combat/types";

// Unlocked at Sora's workbench in the Science Building, once you've faced
// the regular Stray Equation at least once. Sora's whole arc is being
// endlessly, cheerfully curious about things nobody else bothers to
// study — this is framed as the equation fragment she's been quietly
// trying to stabilize, bigger and more anxious than the one that
// wanders the lab floor.
export const strayEquationBoss: EnemyDef = {
  id: "stray_equation_boss",
  name: "Stray Equation",
  title: "The Recurring Proof",
  maxHp: 40,
  attackDamage: 3,
  defense: 2,
  isBoss: true,
  canFlee: false,
  fleeSuccessChance: 0,
  expReward: 26,
  introLines: [
    "The containment board on Sora's workbench flickers, and the equation living inside it unfolds at full size, re-deriving the same three lines with none of the confidence it had before.",
    '"Someone\'s watching," it says, more lines of proof stuttering into the air around it. "That changes the error bars. That changes everything, actually."',
  ],
  defeatLines: [
    "It collapses into a contradiction, same as before, except the board goes dark afterward instead of resetting.",
    "Sora will probably have questions about that later.",
  ],
  spareResponseLines: [
    '"...so it\'s fine if this one\'s wrong too," it says, and something in its posture — if it has posture — eases. "Okay. Okay, that\'s — that\'s actually a relief."',
    "It folds itself back down to something workbench-sized, still slightly incorrect, and stays that way without apologizing for it.",
  ],
  itemDrops: ["unproven-lemma"],
  onResolved: (store, outcome) => {
    store.setFlag("stray_equation_boss_resolved", true);
    store.recordBossOutcome("stray_equation_boss", outcome);
  },
  acts: [
    {
      id: "check_its_work_thoroughly",
      label: "Check its work, thoroughly this time",
      effect: () => ({ curiosity: 1, trust: 2 }),
      responseText: () => "It shows you every line this time, not just the first three. Most of it holds up better than it thinks.",
    },
    {
      id: "point_out_which_parts_hold_up",
      label: "Point out which parts hold up",
      requiresPriorActs: ["check_its_work_thoroughly"],
      effect: () => ({ confidence: 2, trust: 1 }),
      responseText: () => '"...more of it than I expected," it admits, like the number surprised even it.',
    },
    {
      id: "tell_it_a_wrong_proof_can_still_help",
      label: "Tell it a proof can be useful even if it's wrong",
      effect: (ctx) => ({ trust: ctx.store.save.route.deaths > 0 ? 3 : 2, fear: -2 }),
      responseText: () => '"Useful," it repeats, testing the word like it hasn\'t been offered that one before.',
    },
    {
      id: "tell_it_this_one_doesnt_need_to_be_perfect_either",
      label: "Tell it this one doesn't need to be perfect either",
      requiresPriorActs: ["point_out_which_parts_hold_up", "tell_it_a_wrong_proof_can_still_help"],
      effect: () => ({ trust: 3, confidence: 2 }),
      responseText: () => "It stops re-deriving the third line. All of them, actually — every copy of itself, all at once.",
    },
  ],
  spareCondition: (ctx) => ctx.state.trust >= 7 && ctx.state.confidence >= 4,
  phases: [
    {
      id: "phase1",
      hpFractionAtOrBelow: 1,
      patternId: "geometric_lasers",
      dodgeDurationMs: 5000,
      onEnter: ["The same laser-wall proof lines as before — just re-derived at full size."],
    },
    {
      id: "phase2",
      hpFractionAtOrBelow: 0.45,
      patternId: "geometric_lasers_crossed",
      dodgeDurationMs: 5600,
      onEnter: ["It starts checking its work on two axes at once, and neither one is careful about where you're standing."],
    },
  ],
};
