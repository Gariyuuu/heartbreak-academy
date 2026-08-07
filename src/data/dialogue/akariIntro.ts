import type { DialogueTreeDef } from "../../game/dialogue/types";

export const akariIntro: DialogueTreeDef = {
  id: "akari_intro",
  pickStart: (store) => (store.save.flags["met_akari"] ? "return_greeting" : "first_greeting"),
  nodes: {
    first_greeting: {
      id: "first_greeting",
      speakerId: "akari",
      expression: "neutral",
      text: (store) =>
        `You must be the new arrival. I'm Akari Hoshino, student council president. ${store.save.player.name}, was it? Someone already wrote your name on the attendance ledger. I don't know who.`,
      next: "explain",
      onEnter: (store) => {
        store.setFlag("met_akari", true);
        store.adjustAffection("akari", 1);
      },
    },
    explain: {
      id: "explain",
      speakerId: "akari",
      expression: "determined",
      text: "This is the Afterclass. Most people find their way home eventually. I intend to make sure you're one of them — properly, not by accident.",
      choices: [
        { text: "What do you mean, 'not by accident'?", next: "not_by_accident" },
        { text: "You seem very sure of how this place works.", next: "sure_of_herself" },
        { text: "Thanks. I'll try not to cause trouble.", next: "polite_close" },
      ],
    },
    not_by_accident: {
      id: "not_by_accident",
      speakerId: "akari",
      expression: "neutral",
      text: "Some students leave without meaning to. It doesn't always look like an ending anyone would choose. I'd rather you leave because you're ready, not because the building got tired of you.",
      next: "close",
    },
    sure_of_herself: {
      id: "sure_of_herself",
      speakerId: "akari",
      expression: "embarrassed",
      text: "I've read every rule book this school has produced. That's not the same as understanding it. I'm working on the gap.",
      next: "close",
    },
    polite_close: {
      id: "polite_close",
      speakerId: "akari",
      expression: "happy",
      text: "Good. That's more than I can say for the last few.",
      next: null,
      onEnter: (store) => store.adjustAffection("akari", 1),
    },
    close: {
      id: "close",
      speakerId: "akari",
      expression: "neutral",
      text: "If you need anything, the council tower is northeast of here — assuming the halls agree with that direction today. Try the gaming club too. Mika bites less than she looks like she might.",
      next: null,
    },
    return_greeting: {
      id: "return_greeting",
      speakerId: "akari",
      expression: "neutral",
      text: (store) => {
        if (store.save.route.deaths > 0) {
          return "You're back. You always come back looking slightly more tired than the last version of you. I don't say that to be unkind.";
        }
        if (store.save.route.defeatedCount > store.save.route.sparedCount) {
          return "You've been fighting more than talking, lately. I'm not going to lecture you. I'm just... keeping count.";
        }
        return "Still finding your feet? That's fine. Most of us are, longer than we admit.";
      },
      next: null,
    },
  },
};
