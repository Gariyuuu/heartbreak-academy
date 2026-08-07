import type { DialogueTreeDef } from "../../game/dialogue/types";

export const mikaIntro: DialogueTreeDef = {
  id: "mika_intro",
  pickStart: (store) =>
    store.save.flags["mika_challenge_unlocked"] ? "return_greeting" : "first_greeting",
  nodes: {
    first_greeting: {
      id: "first_greeting",
      speakerId: "mika",
      expression: "laughing",
      text: "NEW PERSON! Okay, quick tip since nobody else will actually tell you this straight: when something's about to fight you, you don't have to fight back. You can just... talk. Ask stuff. See how it reacts.",
      next: "explain_act",
      onEnter: (store) => {
        store.setFlag("met_mika", true);
        store.adjustAffection("mika", 1);
      },
    },
    explain_act: {
      id: "explain_act",
      speakerId: "mika",
      expression: "happy",
      text: "It's basically a rhythm game where the rhythm is 'does this creature feel heard.' Tease it, compliment it, ask it questions, whatever fits. Get it calm enough and you can just... let it go. No blood, no foul.",
      choices: [
        { text: "And if I'd rather just fight?", next: "fight_option" },
        { text: "That's oddly specific advice.", next: "oddly_specific" },
        { text: "Got it. Thanks.", next: "to_challenge" },
      ],
    },
    fight_option: {
      id: "fight_option",
      speakerId: "mika",
      expression: "neutral",
      text: "You can. Some things you can't talk down anyway. Just — the school notices which one you reach for first. Don't ask me how. I don't run the place.",
      next: "to_challenge",
    },
    oddly_specific: {
      id: "oddly_specific",
      speakerId: "mika",
      expression: "embarrassed",
      text: "...I had a rough first week, okay? I fought everything. Turns out that's not a great strategy or a great personality. Learn from me.",
      next: "to_challenge",
    },
    to_challenge: {
      id: "to_challenge",
      speakerId: "mika",
      expression: "determined",
      text: "ANYWAY. See that cabinet behind me? GALAXY RIVAL. I am unbeaten. I will not be beaten. But you're welcome to try, once you've got a feel for dodging things that want to hit you.",
      next: "unlock",
    },
    unlock: {
      id: "unlock",
      speakerId: "mika",
      expression: "laughing",
      text: "Go get some practice in first — there's usually a Stray Thought or two wandering around feeling sorry for itself. Come back and challenge me whenever. I'm not going anywhere. Literally. I live here now, I think.",
      next: null,
      onEnter: (store) => store.setFlag("mika_challenge_unlocked", true),
    },
    return_greeting: {
      id: "return_greeting",
      speakerId: "mika",
      expression: "happy",
      text: (store) => {
        const rel = store.save.relationships["mika"];
        if (rel && rel.affection >= 3) {
          return "My favorite undefeated — well, un-un-defeated — challenger. Cabinet's right there whenever you want another round.";
        }
        return "Back for round two? Cabinet's warmed up. So am I.";
      },
      next: null,
    },
  },
};
