import type { EnemyDef } from "../../game/combat/types";

// The design doc's "meta-timeline boss that recognizes repeated
// attempts," built directly on the meta-save (hba:timeline) rather than
// anything scoped to a single playthrough. Only reachable past the edge
// of the Null Wing, and only once you've actually looped through New
// Game+ at least once — the timeline has to have something to recognize
// before it can recognize it. Its intro lines read real numbers out of
// `store.timeline`, not flavor text guessing at them.
export const theAccumulationBoss: EnemyDef = {
  id: "the_accumulation",
  name: "The Accumulation",
  title: "Every Time You Came Back",
  maxHp: 50,
  attackDamage: 3,
  defense: 3,
  isBoss: true,
  canFlee: false,
  fleeSuccessChance: 0,
  expReward: 35,
  introLines: (store) => {
    const t = store.timeline;
    const totalResolved = t.bossesDefeatedEver.length + t.bossesSparedEver.length;
    const lines: string[] = [
      `You've been here, in some form, ${t.resets + 1} time${t.resets === 0 ? "" : "s"} now. The building doesn't say that part out loud. It doesn't have to — it's standing in front of you.`,
    ];
    if (t.totalDeaths > 0) {
      lines.push(
        `${t.totalDeaths} of those attempts ended before you meant them to, across every time you've tried. It remembers all of them, not just whichever one you're currently having.`,
      );
    }
    if (totalResolved > 0) {
      lines.push(
        `You've resolved ${totalResolved} of the things here worth resolving, cumulatively. That number is the only part of any of your attempts it actually keeps.`,
      );
    }
    lines.push(
      '"I\'m not a person," it says, in a voice built out of overlapping copies of itself, none of them quite in sync. "I\'m just what\'s left over when something keeps count."',
    );
    return lines;
  },
  defeatLines: [
    "It doesn't scatter so much as settle, every overlapping copy of its voice collapsing down into one.",
    "The count doesn't stop. It just gets quieter about doing it.",
  ],
  spareResponseLines: [
    '"...okay," all of it says, together, for once actually together. "Okay. I can be quieter about it than that."',
    "It doesn't disappear. It just stops needing to remind you it's counting, which turns out to be most of what was unsettling about it in the first place.",
  ],
  itemDrops: ["worn-coin"],
  onResolved: (store, outcome) => {
    store.setFlag("the_accumulation_resolved", true);
    store.recordBossOutcome("the_accumulation", outcome);
  },
  acts: [
    {
      id: "ask_it_how_many_times_exactly",
      label: "Ask it how many times, exactly",
      effect: () => ({ curiosity: 2, trust: 1 }),
      responseText: () => "It tells you. The number doesn't matter as much as how evenly it says it — no shame in it, no pride either.",
    },
    {
      id: "tell_it_the_number_doesnt_scare_you",
      label: "Tell it the number doesn't scare you",
      requiresPriorActs: ["ask_it_how_many_times_exactly"],
      effect: () => ({ trust: 2, fear: -1 }),
      responseText: () => "Something in the overlap of its voice steadies, like one fewer copy is bracing for you to flinch.",
    },
    {
      id: "point_out_it_still_says_current_one",
      label: "Point out that it still calls this \"the current one\"",
      effect: (ctx) => ({ trust: ctx.store.save.route.deaths > 0 ? 3 : 2, curiosity: 1 }),
      responseText: () => '"...I do, don\'t I," it says, sounding genuinely caught off guard by its own word choice.',
    },
    {
      id: "tell_it_it_doesnt_have_to_be_the_only_one_counting",
      label: "Tell it it doesn't have to be the only one counting",
      requiresPriorActs: ["tell_it_the_number_doesnt_scare_you", "point_out_it_still_says_current_one"],
      effect: () => ({ trust: 3, fear: -2 }),
      responseText: () => "All the overlapping copies go quiet at once, like they finally agree on something without needing to say it out loud.",
    },
  ],
  spareCondition: (ctx) => ctx.state.trust >= 7 && ctx.state.fear <= 0,
  phases: [
    {
      id: "phase1",
      hpFractionAtOrBelow: 1,
      patternId: "echo_cascade",
      dodgeDurationMs: 5200,
      onEnter: ["Every shot arrives twice — once, and then again, a half-beat later, from somewhere slightly different."],
    },
    {
      id: "phase2",
      hpFractionAtOrBelow: 0.45,
      patternId: "echo_flood",
      dodgeDurationMs: 5800,
      onEnter: ["It stops spacing the echoes out. Every attempt answers at once."],
    },
  ],
};
