import type { DialogueTreeDef } from "../../game/dialogue/types";
import type { GameStore } from "../../game/state/store";

function nameplateText(store: GameStore): string {
  if (store.save.flags["met_yuna"]) {
    return 'A small nameplate on an otherwise empty desk reads "Y. KUROSAWA." The handwriting matches hers exactly. She has never mentioned sitting in this room.';
  }
  return 'A small nameplate on an otherwise empty desk. The name on it is smudged just enough that you can\'t quite read it, no matter which direction the light comes from.';
}

export const nameplateFlavor: DialogueTreeDef = {
  id: "nameplate_flavor",
  pickStart: () => "read",
  nodes: {
    read: {
      id: "read",
      speakerId: null,
      expression: "neutral",
      text: (store) => nameplateText(store),
      next: null,
    },
  },
};
