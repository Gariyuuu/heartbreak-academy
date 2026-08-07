import type { DialogueTreeDef } from "../../game/dialogue/types";
import type { GameStore } from "../../game/state/store";

function storyFragment(store: GameStore): string {
  const s = store.save;
  if (s.route.sparedCount > 0 && s.flags["locker_108_opened"]) {
    return '"...someone finds what was left behind, and instead of keeping it, they let something small go instead. I don\'t know why I wrote it that way. It just felt correct."';
  }
  if (s.flags["locker_108_opened"]) {
    return '"...there\'s a locker no one claims, and someone opens it anyway, and it turns out to have been waiting for them specifically. I wrote that before I knew you\'d do it."';
  }
  if (s.route.sparedCount > 0) {
    return '"...a girl stops fighting something halfway through, not because she has to, but because she noticed it was scared. That part I\'m fairly sure about."';
  }
  return '"...I don\'t have anything about you yet. That\'s either reassuring or it isn\'t. I haven\'t decided."';
}

export const yunaIntro: DialogueTreeDef = {
  id: "yuna_intro",
  pickStart: (store) => (store.save.flags["met_yuna"] ? "return_greeting" : "first_greeting"),
  nodes: {
    first_greeting: {
      id: "first_greeting",
      speakerId: "yuna",
      expression: "neutral",
      text: "...oh. You're really here. I mean — hello. Sorry. I write things down before I'm sure they're going to happen, and it makes actual arrivals a little disorienting.",
      next: "explain",
      onEnter: (store) => {
        store.setFlag("met_yuna", true);
        store.adjustAffection("yuna", 1);
      },
    },
    explain: {
      id: "explain",
      speakerId: "yuna",
      expression: "neutral",
      text: "I'm Yuna. Literature club, technically — it's just me most days. I write short stories. Some of them are about people I haven't met yet. I've stopped mentioning that to new people, but you're new, so I'm mentioning it.",
      choices: [
        { text: "Can I read one?", next: "read_one" },
        { text: "That's a little unsettling.", next: "unsettling" },
        { text: "I won't pry. Nice to meet you.", next: "polite_close" },
      ],
    },
    read_one: {
      id: "read_one",
      speakerId: "yuna",
      expression: "embarrassed",
      text: "Okay. Not the whole thing — just the part I'm sure about.",
      next: "fragment",
    },
    fragment: {
      id: "fragment",
      speakerId: "yuna",
      expression: "neutral",
      text: (store) => storyFragment(store),
      next: "close",
      onEnter: (store) => store.adjustTrust("yuna", 2),
    },
    unsettling: {
      id: "unsettling",
      speakerId: "yuna",
      expression: "sad",
      text: "Yeah. I know. I used to think it meant something was wrong with me. Now I mostly just try not to write about anything I'd feel bad about being right about.",
      next: "close",
    },
    polite_close: {
      id: "polite_close",
      speakerId: "yuna",
      expression: "happy",
      text: "That's kind of you. Most people ask more questions than I want to answer on a first meeting.",
      next: null,
      onEnter: (store) => store.adjustAffection("yuna", 1),
    },
    close: {
      id: "close",
      speakerId: "yuna",
      expression: "neutral",
      text: "Anyway. I'm usually here, or somewhere with a shelf nearby. Come back if you want — I might have more written down by then.",
      next: null,
    },
    return_greeting: {
      id: "return_greeting",
      speakerId: "yuna",
      expression: "neutral",
      text: (store) => {
        if (store.save.route.deaths > 0) {
          return "...you again. That's — that's fine, that's normal, people come back. I just wrote something about that too. I'm not going to show you that one.";
        }
        return "You came back. I don't have a new fragment yet. Give it time. Or don't — I'm not in a hurry either way.";
      },
      next: null,
    },
  },
};
