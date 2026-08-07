import type { DialogueTreeDef } from "../../game/dialogue/types";

export const endlessShelfFlavor: DialogueTreeDef = {
  id: "endless_shelf_flavor",
  pickStart: () => "read",
  nodes: {
    read: {
      id: "read",
      speakerId: null,
      expression: "neutral",
      text: (store) =>
        store.save.flags["metaphor_faced"]
          ? "A single shelf runs the length of the wall and keeps going around a corner that, as far as you can tell, the room doesn't actually have. You could follow it around, this time, if you wanted to."
          : "A single shelf runs the length of the wall and keeps going around a corner that, as far as you can tell, the room doesn't actually have. Every book on it is titled the same thing, in a language you don't recognize but somehow understand isn't finished being written.",
      next: null,
    },
  },
};
