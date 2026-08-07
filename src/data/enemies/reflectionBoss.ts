import type { EnemyDef } from "../../game/combat/types";

// Unlocked in Mirror Hall after you've already faced the regular Reflection
// once (spared or defeated — either counts). Not a named character like the
// other three bosses; the point is that the thing wearing your outline
// doesn't need a name to matter. FIGHT and ACT both still lead somewhere
// real, same as every other boss in the game.
export const reflectionBoss: EnemyDef = {
  id: "reflection_boss",
  name: "Reflection",
  title: "The Whole Glass",
  maxHp: 46,
  attackDamage: 3,
  defense: 3,
  isBoss: true,
  canFlee: false,
  fleeSuccessChance: 0,
  expReward: 30,
  introLines: [
    "Every mirror in the hall turns at once, all showing the same thing: you — except it isn't waiting half a step behind anymore. It's already moving.",
    '"You came back," it says, and for the first time it doesn\'t sound like it\'s borrowing your voice. It sounds like it grew one.',
  ],
  defeatLines: [
    "The glass doesn't shatter this time. It just goes still, all of it, all at once — every mirror in the hall showing an empty room.",
    "You don't feel like you won something. You feel like you agreed to something, and you're not sure yet what.",
  ],
  spareResponseLines: [
    '"I don\'t need you to forgive me for existing," it says. "I think I just needed you to look at me on purpose, for once."',
    "The mirrors settle back into showing the hallway, normally — except one, near the end, that keeps showing both of you, side by side, a little longer than the rest.",
  ],
  itemDrops: ["still-glass-shard"],
  onResolved: (store, outcome) => {
    store.setFlag("reflection_boss_resolved", true);
    store.recordBossOutcome("reflection_boss", outcome);
  },
  acts: [
    {
      id: "ask_why_it_came_back",
      label: "Ask why it came back",
      effect: () => ({ curiosity: 2, trust: 1 }),
      responseText: () => '"Because you did," it says. "That\'s not a dodge. It\'s genuinely the whole answer."',
    },
    {
      id: "tell_it_it_doesnt_have_to_perform_you",
      label: "Tell it it doesn't have to keep performing being you",
      requiresPriorActs: ["ask_why_it_came_back"],
      effect: () => ({ trust: 2, embarrassment: 1 }),
      responseText: () => "It goes quiet in a way that isn't hostile. Just visibly considering it, maybe for the first time.",
    },
    {
      id: "admit_you_dont_fully_know_either",
      label: "Admit you don't fully know who you are here either",
      effect: (ctx) => ({ trust: ctx.store.save.route.deaths > 0 ? 3 : 2, fear: -1 }),
      responseText: () => '"Yeah," it says, quieter than before. "I noticed. That\'s most of why I kept following you."',
    },
    {
      id: "offer_to_stop_treating_it_as_a_threat",
      label: "Offer to stop treating it like a threat",
      requiresPriorActs: ["tell_it_it_doesnt_have_to_perform_you", "admit_you_dont_fully_know_either"],
      effect: () => ({ trust: 3, fear: -2 }),
      responseText: () => 'It exhales — an actual, audible breath, which it definitely didn\'t have a moment ago. "Okay," it says. "Okay."',
    },
  ],
  spareCondition: (ctx) => ctx.state.trust >= 8 && ctx.state.fear <= 0,
  phases: [
    {
      id: "phase1",
      hpFractionAtOrBelow: 1,
      patternId: "mirror_split",
      dodgeDurationMs: 5200,
      onEnter: ["The mirrors on both walls fire in sync — everything it throws at you, it throws at itself too."],
    },
    {
      id: "phase2",
      hpFractionAtOrBelow: 0.45,
      patternId: "mirror_shatter",
      dodgeDurationMs: 5800,
      onEnter: ["The symmetry breaks. For a moment it's coming from every direction at once — and then, just as suddenly, it isn't hiding anything anymore."],
    },
  ],
};
