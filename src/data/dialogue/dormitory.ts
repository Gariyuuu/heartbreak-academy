import type { DialogueTreeDef } from "../../game/dialogue/types";
import type { GameStore } from "../../game/state/store";

function paintingDescription(store: GameStore): string {
  const { route } = store.save;
  if (route.defeatedCount > route.sparedCount && route.defeatedCount >= 2) {
    return "The newest one is mostly red and grey, and it doesn't look like anything specific, which somehow makes it worse.";
  }
  if (route.sparedCount > 0 && route.defeatedCount === 0) {
    return "The newest one is soft-edged and warm-colored — she says she painted it 'after something went better than it usually does.'";
  }
  return "The newest one is unfinished, just an outline of a hallway that doesn't match any hallway you've actually seen here.";
}

export const nanaIntro: DialogueTreeDef = {
  id: "nana_intro",
  pickStart: (store) => (store.save.flags["met_nana"] ? "return_greeting" : "first_greeting"),
  nodes: {
    first_greeting: {
      id: "first_greeting",
      speakerId: "nana",
      expression: "embarrassed",
      text: "...oh! Sorry, I didn't hear you. I'm Nana. This is my room, technically, though I'm mostly just in the corner painting.",
      next: "paintings",
      onEnter: (store) => {
        store.setFlag("met_nana", true);
        store.adjustAffection("nana", 1);
      },
    },
    paintings: {
      id: "paintings",
      speakerId: "nana",
      expression: "neutral",
      text: (store) => paintingDescription(store),
      next: "explain",
    },
    explain: {
      id: "explain",
      speakerId: "nana",
      expression: "neutral",
      text: "I don't always paint what happened. Sometimes it's what almost happened, or what I'm worried will. I've stopped trying to tell the difference while I'm working — it ruins the painting.",
      choices: [
        { text: "That sounds a little lonely.", next: "lonely" },
        { text: "Can I see more of your work?", next: "more_work" },
        { text: "I'll let you get back to it.", next: "polite_close" },
      ],
    },
    lonely: {
      id: "lonely",
      speakerId: "nana",
      expression: "sad",
      text: "Maybe. It's quieter than lonely, though. There's a difference, even if it doesn't look like one from outside.",
      next: "close",
    },
    more_work: {
      id: "more_work",
      speakerId: "nana",
      expression: "happy",
      text: "Most of it's still wet, so — carefully. Thank you for asking instead of just looking. Most people just look.",
      next: "close",
      onEnter: (store) => store.adjustTrust("nana", 2),
    },
    polite_close: {
      id: "polite_close",
      speakerId: "nana",
      expression: "happy",
      text: "Thank you. Most people don't offer that either.",
      next: null,
      onEnter: (store) => store.adjustAffection("nana", 1),
    },
    close: {
      id: "close",
      speakerId: "nana",
      expression: "neutral",
      text: "Come by whenever. I'm always here, or somewhere close enough that the paint hasn't dried.",
      next: null,
    },
    return_greeting: {
      id: "return_greeting",
      speakerId: "nana",
      expression: "neutral",
      text: (store) => `Back again. ${paintingDescription(store)}`,
      next: null,
    },
  },
};

export const dormHallSignFlavor: DialogueTreeDef = {
  id: "dorm_hall_sign_flavor",
  pickStart: () => "read",
  nodes: {
    read: {
      id: "read",
      speakerId: null,
      expression: "neutral",
      text: 'A hand-lettered sign by the stairs: "QUIET HOURS: ALWAYS. — Management (there is no management)."',
      next: null,
    },
  },
};
