import type { EnemyDef } from "../../game/combat/types";

// The brief's "lonely ghost" example, reskinned: you can't SPARE it by
// spamming the button. You have to stop dodging its one harmless attack
// and let it get close, which only unlocks after you've actually listened.
export const strayThought: EnemyDef = {
  id: "stray_thought",
  name: "Stray Thought",
  title: "A small drifting worry",
  maxHp: 18,
  // Softened from 2: this is nearly every player's literal first fight,
  // with zero in-game explanation before this session's How to Play
  // screen existed — first contact needs to be forgiving, not just the
  // numbers "technically" balanced.
  attackDamage: 1,
  defense: 1,
  isBoss: false,
  canFlee: true,
  fleeSuccessChance: 0.8,
  expReward: 6,
  introLines: (store) => {
    const base = "A Stray Thought drifts into view, muttering something it won't quite finish saying.";
    if (store.save.flags["tutorial_battle_seen"]) return [base];
    store.setFlag("tutorial_battle_seen", true);
    return [
      base,
      "First fight — quick primer: FIGHT and SPARE are both real ways to end this, not a right answer and a wrong one. ACT (talk instead of attack) is the only way to unlock SPARE — enough of the right choices there shifts its mood past whatever it needs. GUARD and FLEE cost nothing to try if a fight is going badly. Full rules any time from the pause menu's How to Play.",
    ];
  },
  defeatLines: ["The Stray Thought scatters into quiet static.", "It didn't get to finish its sentence."],
  spareResponseLines: [
    "It finally finishes the thought — something small and unremarkable — and drifts off, lighter.",
    "You didn't need to understand it. You just needed to let it be heard.",
  ],
  itemDrops: ["cafeteria-bun"],
  onResolved: (store) => store.setFlag("stray_thought_faced", true),
  acts: [
    {
      id: "listen",
      label: "Listen",
      effect: () => ({ trust: 2, fear: -1, curiosity: 1 }),
      responseText: () => '"...you\'re actually listening?" It seems startled, then a little less jittery.',
    },
    {
      id: "ask",
      label: "Ask what's wrong",
      effect: () => ({ trust: 1, curiosity: 2 }),
      responseText: () => 'It mutters something about exams, or maybe about being forgotten. Hard to tell.',
    },
    {
      id: "reassure",
      label: "Reassure it",
      requiresPriorActs: ["listen"],
      effect: () => ({ trust: 2, fear: -2 }),
      responseText: () => "\"...okay,\" it says, quieter now, drifting slightly closer.",
    },
    {
      id: "let_approach",
      label: "Let it approach",
      requiresPriorActs: ["listen", "reassure"],
      effect: () => ({ trust: 3, fear: -3 }),
      responseText: () =>
        "You stop dodging and hold still. It drifts all the way up to you and just... rests there a moment.",
    },
  ],
  spareCondition: (ctx) => ctx.state.trust >= 6 && ctx.state.fear <= 1,
  phases: [
    { id: "only", hpFractionAtOrBelow: 1, patternId: "stray_thought_wave", dodgeDurationMs: 4200 },
  ],
};
