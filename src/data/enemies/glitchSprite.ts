import type { EnemyDef } from "../../game/combat/types";

// A leftover fragment of some cabinet's NPC code that never got cleaned
// up — lonely in a very different register than Stray Thought. It doesn't
// want to be heard, it wants to be PLAYED with. SPARE means including it.
export const glitchSprite: EnemyDef = {
  id: "glitch_sprite",
  name: "Glitch Sprite",
  title: "A leftover fragment of someone's high score",
  maxHp: 20,
  attackDamage: 2,
  defense: 1,
  isBoss: false,
  canFlee: true,
  fleeSuccessChance: 0.75,
  expReward: 7,
  introLines: [
    "A Glitch Sprite blips into view, already mid-animation for a greeting nobody programmed a response to.",
  ],
  defeatLines: [
    "The Glitch Sprite breaks into a handful of stray pixels and doesn't reassemble.",
    "Whatever cabinet it came from, it's not going back.",
  ],
  spareResponseLines: [
    '"...really? You want to play WITH me, not against me?" It sounds like it\'s never been asked.',
    "It loops a small victory animation, the kind meant for a two-player game, and waits for you to copy it.",
  ],
  itemDrops: ["sweet-tea"],
  onResolved: (store) => store.setFlag("glitch_sprite_faced", true),
  acts: [
    {
      id: "say_hello",
      label: "Say hello",
      effect: () => ({ curiosity: 2, trust: 1 }),
      responseText: () => "It freezes for a second, like it wasn't expecting the greeting to be returned.",
    },
    {
      id: "ask_rematch",
      label: "Ask if it wants a rematch",
      effect: () => ({ confidence: 2 }),
      responseText: () => "It perks up immediately. This is clearly the correct question.",
    },
    {
      id: "tell_you_see_it",
      label: "Tell it you see it",
      requiresPriorActs: ["say_hello"],
      effect: () => ({ trust: 3, fear: -1 }),
      responseText: () => "Something in its sprite-sheet stutters — the closest thing it has to being moved.",
    },
    {
      id: "invite_to_stay",
      label: "Invite it to keep existing",
      requiresPriorActs: ["tell_you_see_it", "ask_rematch"],
      effect: () => ({ trust: 3, confidence: 2 }),
      responseText: () => "It doesn't have a response animation for this. It just stays a little longer than it needs to.",
    },
  ],
  spareCondition: (ctx) => ctx.state.trust >= 6 && ctx.state.confidence >= 2,
  phases: [
    { id: "only", hpFractionAtOrBelow: 1, patternId: "arcade_chase", dodgeDurationMs: 4200 },
  ],
};
