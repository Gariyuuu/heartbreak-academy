import type { DialogueTreeDef } from "../../game/dialogue/types";

export const reinaIntro: DialogueTreeDef = {
  id: "reina_intro",
  pickStart: (store) => (store.save.flags["reina_stage_unlocked"] ? "return_greeting" : "first_greeting"),
  nodes: {
    first_greeting: {
      id: "first_greeting",
      speakerId: "reina",
      expression: "happy",
      text: "AH — an audience! Do forgive the empty house, darling, the rest of the cast seems to have wandered off to another building entirely. I'm Reina. Drama club, presently a company of one.",
      next: "explain",
      onEnter: (store) => {
        store.setFlag("met_reina", true);
        store.adjustAffection("reina", 1);
      },
    },
    explain: {
      id: "explain",
      speakerId: "reina",
      expression: "determined",
      text: "I rehearse whether or not anyone's watching. Old habit. Actually — since you're here — would you do me the honor of a scene partner? Nothing serious. Just enough to see if the lights still work.",
      choices: [
        { text: "I'd love to watch you perform.", next: "watch" },
        { text: "You don't have to perform for me.", next: "no_performance" },
        { text: "Maybe another time.", next: "polite_close" },
      ],
    },
    watch: {
      id: "watch",
      speakerId: "reina",
      expression: "happy",
      text: "Wonderful! Then get comfortable — the stage is right there, and I promise you, I do not do things by half measures.",
      next: "unlock",
    },
    no_performance: {
      id: "no_performance",
      speakerId: "reina",
      expression: "shocked",
      text: "...oh. That's — no one's really said that to me before. Most people either want the show or don't want anything at all.",
      next: "serious",
    },
    serious: {
      id: "serious",
      speakerId: "reina",
      expression: "sad",
      text: "It's easier, honestly. Performing. I know exactly what I'm supposed to be doing at every second. Off the stage I mostly just... don't. But thank you. Truly.",
      next: "unlock",
      onEnter: (store) => store.adjustTrust("reina", 2),
    },
    polite_close: {
      id: "polite_close",
      speakerId: "reina",
      expression: "happy",
      text: "The offer stands indefinitely, darling. The stage isn't going anywhere. Neither, alarmingly, am I.",
      next: null,
      onEnter: (store) => store.adjustAffection("reina", 1),
    },
    unlock: {
      id: "unlock",
      speakerId: "reina",
      expression: "determined",
      text: "Whenever you're ready — the stage is right behind me. Try to keep up.",
      next: null,
      onEnter: (store) => store.setFlag("reina_stage_unlocked", true),
    },
    return_greeting: {
      id: "return_greeting",
      speakerId: "reina",
      expression: "happy",
      text: (store) =>
        store.save.flags["reina_boss_resolved"]
          ? "Back for an encore? I do love a repeat audience."
          : "The stage awaits, darling. Whenever your nerve returns.",
      next: null,
    },
  },
};

export const programNoteFlavor: DialogueTreeDef = {
  id: "program_note_flavor",
  pickStart: () => "read",
  nodes: {
    read: {
      id: "read",
      speakerId: null,
      expression: "neutral",
      text: 'A programme from a show that, as far as you can tell, never actually happened. The cast list has one name on it, twice, in two different kinds of handwriting.',
      next: null,
    },
  },
};
