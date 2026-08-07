import type { DialogueTreeDef } from "../../game/dialogue/types";

export const soraIntro: DialogueTreeDef = {
  id: "sora_intro",
  pickStart: (store) => (store.save.flags["met_sora"] ? "return_greeting" : "first_greeting"),
  nodes: {
    first_greeting: {
      id: "first_greeting",
      speakerId: "sora",
      expression: "happy",
      text: "Oh — hi! You're not one of mine, are you? New arrival. Sorry, I catalogue everyone, it's a whole thing. I'm Sora, science club, currently a club of one.",
      next: "explain",
      onEnter: (store) => {
        store.setFlag("met_sora", true);
        store.adjustAffection("sora", 1);
      },
    },
    explain: {
      id: "explain",
      speakerId: "sora",
      expression: "determined",
      text: "I build things. Most of them work eventually. Right now I'm obsessed — and I mean OBSESSED — with Memory Stars. They save your progress, sure, fine, but nobody can tell me what they're actually MADE of.",
      choices: [
        { text: "Have you tried opening one?", next: "tried_opening" },
        { text: "Maybe some things aren't meant to be explained.", next: "not_meant_to" },
        { text: "That's a very science-club thing to be obsessed with.", next: "on_brand" },
      ],
    },
    tried_opening: {
      id: "tried_opening",
      speakerId: "sora",
      expression: "embarrassed",
      text: "...once. It didn't so much 'open' as 'stop existing for four seconds and then be exactly where it started.' I've decided to respect its boundaries now.",
      next: "offer",
    },
    not_meant_to: {
      id: "not_meant_to",
      speakerId: "sora",
      expression: "sad",
      text: "That's what Akari says too, except she means it like a threat and I think you mean it nicely. I'm going to keep trying regardless. Sorry. Some of us cope through data.",
      next: "offer",
    },
    on_brand: {
      id: "on_brand",
      speakerId: "sora",
      expression: "laughing",
      text: "I'll take that as a compliment! It's not like the alternative — hi, I'm Sora, I don't care about anything — was going to be more fun at parties.",
      next: "offer",
    },
    offer: {
      id: "offer",
      speakerId: "sora",
      expression: "happy",
      text: "Anyway — if you ever want your gear looked at, I'm here. I can't promise upgrades yet, my workbench is a crime scene, but ask again sometime.",
      next: null,
    },
    return_greeting: {
      id: "return_greeting",
      speakerId: "sora",
      expression: "happy",
      text: (store) =>
        store.save.route.deaths > 0
          ? "Hey — question, and don't take this the wrong way: do you feel different after you come back? Purely for research."
          : "Back again! No new Memory Star breakthroughs yet. I'll tell you the second there are. You'll probably wish I hadn't.",
      next: null,
    },
  },
};

export const gadgetShelfFlavor: DialogueTreeDef = {
  id: "gadget_shelf_flavor",
  pickStart: () => "read",
  nodes: {
    read: {
      id: "read",
      speakerId: null,
      expression: "neutral",
      text: 'A shelf of half-finished gadgets, each labeled on masking tape. "AUTO-NOTETAKER (works if you shout)." "HEART-RATE READER (reads everyone as calm, unclear if broken)." "MEMORY STAR SCANNER (returns only the word \'no\')."',
      next: null,
    },
  },
};
