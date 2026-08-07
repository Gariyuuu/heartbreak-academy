import type { EnemyDef } from "../../game/combat/types";

// Contrast with Runaway Metaphor's "let it stay unfinished": this one is
// anxious about being WRONG, not incomplete. SPARE means convincing it
// that being wrong sometimes is fine, not that it doesn't need an ending.
export const strayEquation: EnemyDef = {
  id: "stray_equation",
  name: "Stray Equation",
  title: "A proof that never got finished",
  maxHp: 24,
  attackDamage: 3,
  defense: 2,
  isBoss: false,
  canFlee: true,
  fleeSuccessChance: 0.7,
  expReward: 9,
  introLines: [
    "A Stray Equation unfolds itself across the air, anxiously re-deriving the same three lines over and over.",
  ],
  defeatLines: [
    "The Stray Equation collapses into a contradiction and cancels itself out.",
    "It never found out if it was right.",
  ],
  spareResponseLines: [
    '"...so I don\'t have to finish it?" It sounds almost offended by how relieved it feels.',
    "It folds itself into something smaller and less urgent, and drifts off still slightly wrong, and fine with that.",
  ],
  itemDrops: ["cafeteria-bun"],
  onResolved: (store) => store.setFlag("stray_equation_faced", true),
  acts: [
    {
      id: "check_work",
      label: "Check its work",
      effect: () => ({ curiosity: 1, trust: 1 }),
      responseText: () => 'It shows you three lines of proof. Two are solid. The third one is doing something deeply illegal.',
    },
    {
      id: "point_out_correct_part",
      label: "Point out the part that's right",
      requiresPriorActs: ["check_work"],
      effect: () => ({ confidence: 2, trust: 1 }),
      responseText: () => '"...the first two lines ARE good, aren\'t they." It sounds surprised to hear it out loud.',
    },
    {
      id: "reassure_wrong_ok",
      label: "Tell it being wrong is fine",
      effect: () => ({ trust: 2, fear: -2 }),
      responseText: () => '"Being wrong is — fine? People just. Allow that?" This appears to be new information.',
    },
    {
      id: "doesnt_need_perfect",
      label: "It doesn't need to be perfect",
      requiresPriorActs: ["point_out_correct_part", "reassure_wrong_ok"],
      effect: () => ({ trust: 3, confidence: 2 }),
      responseText: () => "Something in its posture relaxes. It stops re-deriving the third line.",
    },
  ],
  spareCondition: (ctx) => ctx.state.trust >= 6 && ctx.state.confidence >= 2,
  phases: [
    { id: "only", hpFractionAtOrBelow: 1, patternId: "geometric_lasers", dodgeDurationMs: 4600 },
  ],
};
