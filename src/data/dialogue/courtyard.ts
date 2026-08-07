import type { DialogueTreeDef } from "../../game/dialogue/types";

export const towaCourtyard: DialogueTreeDef = {
  id: "towa_courtyard",
  pickStart: (store) => (store.save.flags["met_towa_courtyard"] ? "return" : "first"),
  nodes: {
    first: {
      id: "first",
      speakerId: "sleepy_upperclassman",
      expression: "neutral",
      text: "Outdoor spot number four. The grass doesn't actually get cold, which I've chosen not to think about too hard.",
      next: null,
      onEnter: (store) => store.setFlag("met_towa_courtyard", true),
    },
    return: {
      id: "return",
      speakerId: "sleepy_upperclassman",
      expression: "happy",
      text: "You're basically doing a tour of my nap spots at this point. I should charge admission.",
      next: null,
    },
  },
};

export const courtyardPondFlavor: DialogueTreeDef = {
  id: "courtyard_pond_flavor",
  pickStart: () => "look",
  nodes: {
    look: {
      id: "look",
      speakerId: null,
      expression: "neutral",
      text: "The pond is perfectly still and slightly too blue, like a photograph of a pond rather than the real thing. Something moves under the surface, unbothered by you noticing.",
      next: "decide",
    },
    decide: {
      id: "decide",
      speakerId: null,
      expression: "neutral",
      text: (store) =>
        store.save.flags["stray_thought_faced"]
          ? "There's no rod anywhere nearby. You don't need one. Whatever's under there, you already know how to listen to it."
          : "There's no rod anywhere nearby, and you don't especially want to put your hands in. Maybe another time.",
      next: null,
    },
  },
};
