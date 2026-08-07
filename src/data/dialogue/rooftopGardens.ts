import type { DialogueTreeDef } from "../../game/dialogue/types";
import type { GameStore } from "../../game/state/store";

function kaedeLine(store: GameStore): string {
  const deaths = store.save.route.deaths;
  if (deaths > 0) {
    return "...you came back differently this time. I can't always tell how. Just that you did.";
  }
  if (store.save.route.sparedCount > 2) {
    return "You're gentler than usual, this time. I mean that as a genuine observation, not a compliment. I haven't decided if it's better.";
  }
  return "Oh — you're still early. Good. I always forget how much I like this part.";
}

export const kaedeGlimpse: DialogueTreeDef = {
  id: "kaede_glimpse",
  pickStart: () => "line",
  nodes: {
    line: {
      id: "line",
      speakerId: "kaede",
      expression: "neutral",
      text: "...hm? Oh. Sorry — I was somewhere else for a second. I do that. I'm Kaede. Transfer student, apparently, though I couldn't tell you transferred from where.",
      next: "second",
      onEnter: (store) => store.setFlag("met_kaede", true),
    },
    second: {
      id: "second",
      speakerId: "kaede",
      expression: "neutral",
      text: (store) => kaedeLine(store),
      next: null,
    },
  },
};

export const rooftopViewFlavor: DialogueTreeDef = {
  id: "rooftop_view_flavor",
  pickStart: () => "look",
  nodes: {
    look: {
      id: "look",
      speakerId: null,
      expression: "neutral",
      text: "From up here, the Academy's rooflines don't quite line up with its hallways. You could swear the Literature Wing is directly below you. It's not, from any angle you've actually walked.",
      next: null,
    },
  },
};
