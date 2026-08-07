import type { DialogueTreeDef } from "../../game/dialogue/types";

export const mirrorHallSignFlavor: DialogueTreeDef = {
  id: "mirror_hall_sign_flavor",
  pickStart: () => "look",
  nodes: {
    look: {
      id: "look",
      speakerId: null,
      expression: "neutral",
      text: "You look into the mirror and, for exactly one second, it looks back before it starts copying you. You decide not to test how long that gap gets if you stand here longer.",
      next: null,
    },
  },
};
