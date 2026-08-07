import type { EnemyDef } from "../../game/combat/types";

// Third real boss. The performance IS the armor — winning by damage means
// she puts on a good show and respects a worthy scene partner; winning by
// ACT means getting her to drop the performance entirely, which she's
// visibly not used to being allowed to do.
export const reinaBoss: EnemyDef = {
  id: "reina_boss",
  name: "Reina Tsukishiro",
  title: "A Company of One — Opening Night",
  maxHp: 46,
  attackDamage: 3,
  defense: 2,
  isBoss: true,
  canFlee: false,
  fleeSuccessChance: 0,
  expReward: 22,
  introLines: [
    'Reina strikes a pose as the house lights drop. "Places, everyone! Well — place, singular. Let\'s not waste the spotlight."',
  ],
  defeatLines: [
    "Reina staggers back a step, then breaks into delighted, breathless applause for herself as much as for you.",
    '"Bravo. No, truly — bravo. I haven\'t had a scene partner keep pace like that in longer than I\'d like to admit."',
  ],
  spareResponseLines: [
    "She lets the pose drop. Actually drop, not fade theatrically — just stop.",
    '"...thank you," she says, in a voice with no projection behind it at all. "I don\'t think I\'ve said that on this stage before."',
  ],
  itemDrops: ["student-badge"],
  acts: [
    {
      id: "compliment_performance",
      label: "Compliment the performance",
      effect: () => ({ confidence: 2, trust: 1 }),
      responseText: () => '"Isn\'t it though?" She beams, fully back in character. "I workshopped that entrance for weeks. To an empty house, but still."',
    },
    {
      id: "ask_whats_real",
      label: "Ask what's real",
      effect: () => ({ curiosity: 2, embarrassment: 1 }),
      responseText: () => 'The smile flickers — just barely. "That\'s a very unglamorous question for a theater."',
    },
    {
      id: "doesnt_have_to_perform",
      label: "Tell her she doesn't have to perform for you",
      requiresPriorActs: ["ask_whats_real"],
      effect: () => ({ trust: 3, fear: -1 }),
      responseText: () => 'She goes quiet mid-gesture. "...no one has actually said that to me before. Not once."',
    },
    {
      id: "stay_for_quiet_part",
      label: "Stay for the quiet part",
      requiresPriorActs: ["doesnt_have_to_perform", "compliment_performance"],
      effect: () => ({ trust: 3, confidence: 2 }),
      responseText: () => "You don't say anything else. Neither does she, for a while. It doesn't feel like a scene ending — more like one finally starting.",
    },
  ],
  spareCondition: (ctx) => ctx.state.trust >= 7 && ctx.state.confidence >= 2,
  onResolved: (store, outcome) => {
    store.setFlag("reina_boss_resolved", true);
    store.adjustAffection("reina", outcome === "spared" ? 3 : 2);
    store.adjustTrust("reina", outcome === "spared" ? 2 : 1);
    store.recordBossOutcome("reina_boss", outcome);
  },
  phases: [
    {
      id: "phase1",
      hpFractionAtOrBelow: 1,
      patternId: "stage_props",
      dodgeDurationMs: 5000,
      onEnter: ['"ACT ONE!" Set pieces begin dropping from the rigging, precisely on her cue.'],
    },
    {
      id: "phase2",
      hpFractionAtOrBelow: 0.5,
      patternId: "spotlight_hunt",
      dodgeDurationMs: 5600,
      onEnter: [
        '"Act two tends to get personal." The house lights swing to follow you instead of her.',
      ],
    },
  ],
};
