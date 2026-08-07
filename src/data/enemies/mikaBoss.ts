import type { EnemyDef } from "../../game/combat/types";

// The first real boss: a friendly arcade duel, not a threat. FIGHT and ACT
// both lead to a good outcome — they just lead to a *different* good
// outcome, which is the point: winning and connecting aren't always the
// same move, and neither one is "the correct answer" here.
export const mikaBoss: EnemyDef = {
  id: "mika_boss",
  name: "Mika Amemiya",
  title: "GALAXY RIVAL — Challenger Mode",
  maxHp: 42,
  attackDamage: 3,
  defense: 2,
  isBoss: true,
  canFlee: false,
  fleeSuccessChance: 0,
  expReward: 20,
  introLines: [
    "Mika slams a coin into the cabinet. \"Challenger accepted! Don't hold back — I won't.\"",
  ],
  defeatLines: [
    "Mika's score flickers and dies. She stares at the screen, then breaks into a grin.",
    '"Okay. OKAY. That was actually really good. I\'m telling everyone I lost fair."',
  ],
  spareResponseLines: [
    'Mika waves a hand, laughing, and powers down the cabinet herself. "Alright, alright — you\'ve got nothing left to prove. Good match."',
    "She bumps your shoulder on the way out. It feels like something settled, not something won.",
  ],
  itemDrops: ["student-badge"],
  acts: [
    {
      id: "compliment_combo",
      label: "Compliment her combo",
      effect: () => ({ confidence: 2, trust: 1 }),
      responseText: () => '"Right?! Nobody appreciates the technical stuff anymore." She\'s grinning now.',
    },
    {
      id: "ask_tips",
      label: "Ask for tips mid-match",
      effect: () => ({ curiosity: 2, trust: 1 }),
      responseText: () => '"Wait, you want tips DURING the match? That\'s— okay that\'s kind of cool actually."',
    },
    {
      id: "match_energy",
      label: "Match her energy",
      requiresPriorActs: ["compliment_combo"],
      effect: () => ({ confidence: 2, curiosity: 2 }),
      responseText: () => 'She whoops. "THERE it is! Okay now we\'re actually playing!"',
    },
    {
      id: "call_it_even",
      label: "Suggest calling it even",
      requiresPriorActs: ["match_energy", "ask_tips"],
      effect: () => ({ trust: 3, confidence: 1 }),
      responseText: () => 'She hesitates, then laughs. "...Yeah, okay. Honestly? Yeah."',
    },
  ],
  spareCondition: (ctx) => ctx.state.trust >= 6 && ctx.state.confidence >= 4,
  onResolved: (store, outcome) => {
    store.setFlag("mika_challenge_resolved", true);
    store.adjustAffection("mika", outcome === "spared" ? 3 : 2);
    store.adjustTrust("mika", outcome === "spared" ? 2 : 1);
    store.recordBossOutcome("mika_boss", outcome);
  },
  phases: [
    {
      id: "phase1",
      hpFractionAtOrBelow: 1,
      patternId: "arcade_grid",
      dodgeDurationMs: 5200,
      onEnter: ["ROUND 1 — dodge the descending fire, find the gap in the grid."],
    },
    {
      id: "phase2",
      hpFractionAtOrBelow: 0.5,
      patternId: "arcade_bounce",
      dodgeDurationMs: 6200,
      onEnter: [
        '"Okay, NOW we\'re in bonus stage territory!" The arena fills with bouncing light.',
      ],
    },
  ],
};
