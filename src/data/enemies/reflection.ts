import type { EnemyDef } from "../../game/combat/types";

// Wears the player's outline and reflects their route back at them
// through the ACT responses rather than static lines — the only enemy in
// the game whose dialogue is explicitly built from what you've actually
// done, not a fixed personality.
export const reflection: EnemyDef = {
  id: "reflection",
  name: "Reflection",
  title: "???",
  maxHp: 24,
  attackDamage: 2,
  defense: 2,
  isBoss: false,
  canFlee: true,
  fleeSuccessChance: 0.65,
  expReward: 10,
  introLines: [
    "The mirror at the end of the hall doesn't show the hallway. It shows you, half a second behind, and then it steps out of the frame entirely.",
  ],
  defeatLines: [
    "The Reflection shatters into a version of you that stops existing the moment you stop looking at it.",
    "The mirror it came from shows the hallway again, normally, like nothing happened.",
  ],
  spareResponseLines: [
    "It doesn't shatter. It just steps back into the mirror, unremarkably, the way you'd step through any doorway.",
    "For a second the glass shows both of you standing side by side. Then just you.",
  ],
  itemDrops: ["sweet-tea"],
  onResolved: (store) => store.setFlag("reflection_faced", true),
  acts: [
    {
      id: "ask_what_it_sees",
      label: "Ask what it sees",
      effect: () => ({ curiosity: 2 }),
      responseText: (ctx) => {
        const { sparedCount, defeatedCount } = ctx.store.save.route;
        if (defeatedCount > sparedCount) {
          return '"Mostly fights," it says, in your voice. "You\'re efficient about it. I don\'t know if that\'s a compliment."';
        }
        if (sparedCount > 0) {
          return '"People you didn\'t have to be kind to," it says. "More than once. I keep expecting that to stop being true."';
        }
        return '"Not much yet," it admits. "You\'re still mostly a question, to me. That\'s not an insult."';
      },
    },
    {
      id: "tell_it_youre_still_deciding",
      label: "Tell it you're still deciding who you are here",
      requiresPriorActs: ["ask_what_it_sees"],
      effect: () => ({ trust: 2, fear: -1 }),
      responseText: () => '"Good," it says, and for once doesn\'t sound like it\'s quoting you. "So am I, apparently."',
    },
    {
      id: "admit_a_regret",
      label: "Admit something you regret",
      effect: (ctx) => ({ trust: ctx.store.save.route.deaths > 0 ? 3 : 2, embarrassment: 1 }),
      responseText: () => "It doesn't flinch, which is somehow worse than if it had. It already knew.",
    },
    {
      id: "ask_it_to_stop_watching",
      label: "Ask it to stop watching, gently",
      requiresPriorActs: ["tell_it_youre_still_deciding", "admit_a_regret"],
      effect: () => ({ trust: 3, fear: -2 }),
      responseText: () => '"...I can do that," it says, sounding surprised that it\'s allowed to.',
    },
  ],
  spareCondition: (ctx) => ctx.state.trust >= 7 && ctx.state.fear <= 1,
  phases: [
    { id: "only", hpFractionAtOrBelow: 1, patternId: "mirror_split", dodgeDurationMs: 4600 },
  ],
};
