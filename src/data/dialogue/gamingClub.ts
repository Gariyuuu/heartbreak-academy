import type { DialogueTreeDef } from "../../game/dialogue/types";

export const mikaClubroom: DialogueTreeDef = {
  id: "mika_clubroom",
  pickStart: (store) => {
    if (!store.save.flags["mika_challenge_resolved"]) return "before_challenge";
    return store.save.route.sparedCount > 0 && store.save.flags["mika_challenge_resolved"]
      ? "after_spare"
      : "after_fight";
  },
  nodes: {
    before_challenge: {
      id: "before_challenge",
      speakerId: "mika",
      expression: "happy",
      text: "Welcome to club HQ! Well — club. Singular member, technically, but I run a tight ship of one. You've met the cabinet already, right? GALAXY RIVAL doesn't play itself.",
      next: null,
    },
    after_spare: {
      id: "after_spare",
      speakerId: "mika",
      expression: "happy",
      text: "Hey, the good match! I mean it every time I say that, by the way. Half the stuff on these shelves is because of matches like that one.",
      next: null,
    },
    after_fight: {
      id: "after_fight",
      speakerId: "mika",
      expression: "laughing",
      text: "There she is — the undefeated GALAXY RIVAL champion. I'm still not over it. I might never be over it. It's fine. I'm fine.",
      next: null,
    },
  },
};

export const highScoreBoardFlavor: DialogueTreeDef = {
  id: "high_score_board_flavor",
  pickStart: () => "read",
  nodes: {
    read: {
      id: "read",
      speakerId: null,
      expression: "neutral",
      text: (store) =>
        store.save.flags["glitch_sprite_faced"]
          ? 'A hand-drawn high score board. Every entry still says "MIKA," except the tenth-place slot — the note next to it is smudged out, like something erased it to try again.'
          : 'A hand-drawn high score board. Every single entry, top to bottom, says "MIKA." The tenth-place entry has a small note next to it: "this one doesn\'t count, I was testing something."',
      next: null,
    },
  },
};
