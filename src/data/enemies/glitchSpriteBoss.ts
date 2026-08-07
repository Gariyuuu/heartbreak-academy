import type { EnemyDef } from "../../game/combat/types";

// Unlocked at the Gaming Club high score board, once you've faced the
// regular Glitch Sprite at least once. The board's tenth-place entry has
// said "this one doesn't count, I was testing something" since the region
// was first built — this is what was being tested. Not a rival, exactly.
// Just something that wanted a real match and never got one.
export const glitchSpriteBoss: EnemyDef = {
  id: "glitch_sprite_boss",
  name: "Glitch Sprite",
  title: "The Tenth-Place Entry",
  maxHp: 40,
  attackDamage: 3,
  defense: 1,
  isBoss: true,
  canFlee: false,
  fleeSuccessChance: 0,
  expReward: 25,
  introLines: [
    "The high score board flickers, and the tenth-place entry steps out of its own asterisk — the same sprite as before, except this time it loaded every animation it has at once.",
    '"You found the note," it says, in the mid-sync voice of something that\'s never had a full conversation before. "I really was just testing something. Nobody ever came back to check the results."',
  ],
  defeatLines: [
    "It breaks into stray pixels, same as before, except this time the board updates: tenth place, blank.",
    "You're not sure if that's better or worse than the note.",
  ],
  spareResponseLines: [
    '"A real match," it says, sounding almost too surprised to loop its victory animation properly. "Okay. Okay, that actually counts."',
    "The board updates anyway — tenth place, a name this time, one that isn't Mika's.",
  ],
  itemDrops: ["tenth-place-token"],
  onResolved: (store, outcome) => {
    store.setFlag("glitch_sprite_boss_resolved", true);
    store.recordBossOutcome("glitch_sprite_boss", outcome);
  },
  acts: [
    {
      id: "say_hello_and_mean_it",
      label: "Say hello, and mean it",
      effect: () => ({ curiosity: 2, trust: 1 }),
      responseText: () => "It runs its greeting animation again, slower this time, like it's making sure you actually see all of it.",
    },
    {
      id: "ask_if_it_remembers_being_tested",
      label: "Ask if it remembers being tested",
      requiresPriorActs: ["say_hello_and_mean_it"],
      effect: () => ({ trust: 2, curiosity: 1 }),
      responseText: () => '"Mostly," it says. "Mostly I remember waiting for round two. It just never loaded."',
    },
    {
      id: "tell_it_the_note_was_wrong",
      label: "Tell it the tenth-place note was wrong",
      effect: (ctx) => ({ trust: ctx.store.save.route.deaths > 0 ? 3 : 2, confidence: 2 }),
      responseText: () => "Something in its sprite-sheet stutters, hard — the closest thing it has to actually being moved.",
    },
    {
      id: "invite_a_real_high_score",
      label: "Invite it to have an actual high score, for real this time",
      requiresPriorActs: ["ask_if_it_remembers_being_tested", "tell_it_the_note_was_wrong"],
      effect: () => ({ trust: 3, confidence: 2 }),
      responseText: () => "It doesn't have an animation queued for this. It just holds still, for the first time since it loaded.",
    },
  ],
  spareCondition: (ctx) => ctx.state.trust >= 7 && ctx.state.confidence >= 3,
  phases: [
    {
      id: "phase1",
      hpFractionAtOrBelow: 1,
      patternId: "arcade_chase",
      dodgeDurationMs: 4800,
      onEnter: ["The same heart-seeking shots as before — it's just not holding anything back this time."],
    },
    {
      id: "phase2",
      hpFractionAtOrBelow: 0.45,
      patternId: "arcade_swarm",
      dodgeDurationMs: 5400,
      onEnter: ["Two shots at once now — the round it never got to finish, played back at double speed."],
    },
  ],
};
