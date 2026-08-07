import type { DialogueTreeDef } from "../../game/dialogue/types";

export const mikaFestival: DialogueTreeDef = {
  id: "mika_festival",
  pickStart: () => "line",
  nodes: {
    line: {
      id: "line",
      speakerId: "mika",
      expression: "laughing",
      text: "Okay, nobody can explain why there's a festival this week, but I am NOT about to question free games. There's a booth over there rigged in your favor, probably. Try it.",
      next: null,
    },
  },
};

export const soraFestival: DialogueTreeDef = {
  id: "sora_festival",
  pickStart: () => "line",
  nodes: {
    line: {
      id: "line",
      speakerId: "sora",
      expression: "happy",
      text: "I brought a light meter. Purely to see if festival lanterns run warmer than regular ones. They do, for the record. I don't have a theory yet. I'm choosing to enjoy that.",
      next: null,
    },
  },
};

export const festivalBoothFlavor: DialogueTreeDef = {
  id: "festival_booth_flavor",
  pickStart: () => "look",
  nodes: {
    look: {
      id: "look",
      speakerId: null,
      expression: "neutral",
      text: 'A ring-toss booth with no attendant. A hand-written sign says "TAKE A TURN, HONOR SYSTEM." There\'s no prize counter, but somehow the rings always land exactly where you meant them to.',
      next: null,
    },
  },
};
