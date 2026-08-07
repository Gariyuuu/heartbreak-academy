import type { DialogueTreeDef } from "../../game/dialogue/types";
import type { GameStore } from "../../game/state/store";

function kaedeNullLine(store: GameStore): string {
  const { deaths } = store.save.route;
  if (deaths >= 2) {
    return "You keep finding this room. I don't think that's an accident, on either of our parts. I'm not going to pretend I understand it better than you do. I just recognize the feeling of coming back to the same place from a slightly different angle.";
  }
  if (deaths === 1) {
    return "You came back once already, didn't you. I could tell. I always can, out here — it's quieter, so it's easier to notice.";
  }
  return "This is as far as the building has decided to be, for now. I come here when I want to remember that not everything has to be finished yet to be real.";
}

export const kaedeNullWing: DialogueTreeDef = {
  id: "kaede_null_wing",
  pickStart: () => "line",
  nodes: {
    line: {
      id: "line",
      speakerId: "kaede",
      expression: "neutral",
      text: (store) => kaedeNullLine(store),
      next: null,
      onEnter: (store) => store.setFlag("met_kaede", true),
    },
  },
};

export const nullWingEdgeFlavor: DialogueTreeDef = {
  id: "null_wing_edge_flavor",
  pickStart: () => "look",
  nodes: {
    look: {
      id: "look",
      speakerId: null,
      expression: "neutral",
      text: (store) =>
        store.timeline.newGamePlusCount >= 1
          ? 'There\'s a door in the south wall now, or there always was and you just weren\'t back far enough to see it. Either way, it\'s not "not built yet" anymore.'
          : 'There isn\'t anything past this point. Not "hidden," not "locked" — just not built yet. It\'s a strange kind of honest, standing at the actual edge of somewhere.',
      next: null,
    },
  },
};
