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

// Towa's fourth nap spot (after Arrival Hall, Courtyard, Literature
// Wing) — the side story's next beat. The first three appearances are
// all a light, deflecting joke about a "rotation" of napping spots; this
// one is the same voice, in a room that's already established as
// quietly wrong (see nameplateFlavor above), and lets the joke crack
// open into something real for exactly one line before Towa steers it
// back to the bit on purpose.
export const towaClassroom: DialogueTreeDef = {
  id: "towa_classroom",
  pickStart: (store) => (store.save.flags["met_towa_classroom"] ? "return" : "first"),
  nodes: {
    first: {
      id: "first",
      speakerId: "sleepy_upperclassman",
      expression: "neutral",
      text: "...you again. Nap spot number four, if you're keeping count. I wasn't sure anyone would actually find this one — it's not exactly advertised.",
      next: "second",
      onEnter: (store) => store.setFlag("met_towa_classroom", true),
    },
    second: {
      id: "second",
      speakerId: "sleepy_upperclassman",
      expression: "sad",
      text: "This used to be my homeroom. Third year, first period, assigned seat and everything. I still come back, sometimes. Don't ask me how long \"sometimes\" has actually been — I stopped keeping close track around the same time the year did.",
      next: "third",
    },
    third: {
      id: "third",
      speakerId: "sleepy_upperclassman",
      expression: "neutral",
      text: "Anyway. Don't let me make it a whole mood about it. You found the spot — that's the fun part. Welcome to the rotation, officially, four for four.",
      next: null,
    },
    return: {
      id: "return",
      speakerId: "sleepy_upperclassman",
      expression: "happy",
      text: "Back in the old homeroom. I promise I'm not always this sentimental about desks.",
      next: null,
    },
  },
};
