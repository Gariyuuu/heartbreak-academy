import type { EnemyDef } from "../../game/combat/types";

// Fourth boss, and the most personally invested one so far — this isn't a
// game or a performance, it's Akari actually testing whether you can be
// trusted with the fact that outcomes here aren't fixed. Phase 2 begins
// once her composure genuinely starts to crack.
export const akariBoss: EnemyDef = {
  id: "akari_boss",
  name: "Akari Hoshino",
  title: "Student Council President — In Earnest",
  maxHp: 50,
  attackDamage: 3,
  defense: 3,
  isBoss: true,
  canFlee: false,
  fleeSuccessChance: 0,
  expReward: 26,
  introLines: [
    '"I want to be clear," Akari says, settling into a stance that is somehow still perfectly composed. "I am not doing this to hurt you. I need to know."',
  ],
  defeatLines: [
    "Akari lowers her guard, breathing hard, and looks almost relieved to have lost.",
    '"...good," she says, quietly. "I think I needed you to be stronger than my rule book. Thank you for that."',
  ],
  spareResponseLines: [
    "She doesn't lower her guard so much as simply stop needing it.",
    '"I believe you," she says, and it sounds like the most difficult sentence she\'s said all year. "That\'s new for both of us, apparently."',
  ],
  itemDrops: ["fountain-pen"],
  acts: [
    {
      id: "keep_your_word",
      label: "Keep your word",
      effect: () => ({ trust: 2, confidence: 1 }),
      responseText: () => '"You said that already, once." Her eyes narrow slightly. "I\'m checking whether you meant it."',
    },
    {
      id: "show_restraint",
      label: "Show restraint",
      effect: () => ({ trust: 2, fear: -1 }),
      responseText: () => "You could press the advantage. You don't. Something in her stance changes, almost imperceptibly.",
    },
    {
      id: "admit_uncertainty",
      label: "Admit you don't have this all figured out either",
      requiresPriorActs: ["show_restraint"],
      effect: () => ({ trust: 2, embarrassment: 1 }),
      responseText: () => '"...no. I suppose you wouldn\'t." For a moment she looks less like a president and more like someone your age.',
    },
    {
      id: "ask_her_to_trust_you",
      label: "Ask her to trust you",
      requiresPriorActs: ["keep_your_word", "admit_uncertainty"],
      effect: () => ({ trust: 3, confidence: 2 }),
      responseText: () => '"That\'s an enormous thing to ask of me." A pause. "Ask me again in a moment. I want to mean it when I answer."',
    },
  ],
  spareCondition: (ctx) => ctx.state.trust >= 8 && ctx.state.fear <= 1,
  onResolved: (store, outcome) => {
    store.setFlag("akari_boss_resolved", true);
    store.adjustAffection("akari", outcome === "spared" ? 3 : 2);
    store.adjustTrust("akari", outcome === "spared" ? 3 : 1);
    store.recordBossOutcome("akari_boss", outcome);
  },
  phases: [
    {
      id: "phase1",
      hpFractionAtOrBelow: 1,
      patternId: "geometric_lasers",
      dodgeDurationMs: 5200,
      onEnter: ["She moves with total precision — every attack lands exactly where the rules say it should."],
    },
    {
      id: "phase2",
      hpFractionAtOrBelow: 0.5,
      patternId: "composure_break",
      dodgeDurationMs: 5800,
      onEnter: [
        '"...you weren\'t supposed to get this far." For the first time, she sounds less than certain.',
      ],
    },
  ],
};
