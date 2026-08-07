import type { DialogueTreeDef } from "../../game/dialogue/types";

export const theWayOut: DialogueTreeDef = {
  id: "the_way_out",
  pickStart: () => "ask",
  nodes: {
    ask: {
      id: "ask",
      speakerId: null,
      expression: "neutral",
      text: 'A door you\'re fairly sure wasn\'t here on your first lap through the Arrival Hall. It doesn\'t lead anywhere marked on the notice board. It just says, in handwriting you don\'t recognize, "Leave, if you\'re ready."',
      choices: [
        { text: "I'm ready.", next: null, onSelect: (store) => store.setPhase("ending") },
        { text: "Not yet.", next: null },
      ],
    },
  },
};
