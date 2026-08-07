import type { DialogueTreeDef } from "../../game/dialogue/types";
import type { GameStore } from "../../game/state/store";

function openingLine(store: GameStore): string {
  const { route } = store.save;
  if (route.defeatedCount > route.sparedCount && route.defeatedCount >= 2) {
    return "You found the tower. I wondered when you would. I've been keeping a record of you, since we met — and I don't like what it currently says.";
  }
  if (route.sparedCount > route.defeatedCount && route.sparedCount >= 2) {
    return "You found the tower. I'll admit, the record I've been keeping on you is more reassuring than most. That doesn't mean I'm not going to test it.";
  }
  return "You found the tower. Good. I was going to come find you eventually — it's easier this way.";
}

export const akariTower: DialogueTreeDef = {
  id: "akari_tower",
  pickStart: (store) => (store.save.flags["akari_confrontation_unlocked"] ? "post_challenge" : "opening"),
  nodes: {
    opening: {
      id: "opening",
      speakerId: "akari",
      expression: "determined",
      text: (store) => openingLine(store),
      next: "explain",
    },
    explain: {
      id: "explain",
      speakerId: "akari",
      expression: "neutral",
      text: "As council president, I'm supposed to be the one who understands how this place works. I've read every rule. And yet you — an arrival, no less — keep changing outcomes I was certain were fixed. I need to know if that's something I should be worried about.",
      choices: [
        { text: "You can test me, if it helps.", next: "invite_test" },
        { text: "I'm not trying to break anything.", next: "not_trying" },
        { text: "Maybe the rules were never fixed.", next: "rules_werent_fixed" },
      ],
    },
    invite_test: {
      id: "invite_test",
      speakerId: "akari",
      expression: "determined",
      text: "...that's either very brave or very foolish. I haven't decided which. Very well. I intend to find out what you're made of, properly, before I decide how much of this school to trust you with.",
      next: "unlock",
    },
    not_trying: {
      id: "not_trying",
      speakerId: "akari",
      expression: "sad",
      text: "I believe that. That's almost worse, somehow — the idea that you're not even doing it on purpose. Come. Let's see what you do when it isn't an accident.",
      next: "unlock",
    },
    rules_werent_fixed: {
      id: "rules_werent_fixed",
      speakerId: "akari",
      expression: "shocked",
      text: '"Never fixed." I\'ve spent a long time assuming otherwise, because the alternative is frightening. I\'d like to be wrong about that. Prove it to me directly — not with words.',
      next: "unlock",
    },
    unlock: {
      id: "unlock",
      speakerId: "akari",
      expression: "determined",
      text: "This isn't punishment. I want that understood going in. It's the only honest way I know how to actually get to know someone.",
      next: null,
      onEnter: (store) => store.setFlag("akari_confrontation_unlocked", true),
    },
    post_challenge: {
      id: "post_challenge",
      speakerId: "akari",
      expression: "neutral",
      text: (store) =>
        store.save.flags["akari_boss_resolved"]
          ? "I've updated my record on you. It's a more complicated document than it used to be. I mean that as the highest compliment I currently have available."
          : "The offer remains open, whenever your nerve does.",
      next: null,
    },
  },
};

export const councilRulesFlavor: DialogueTreeDef = {
  id: "council_rules_flavor",
  pickStart: () => "read",
  nodes: {
    read: {
      id: "read",
      speakerId: null,
      expression: "neutral",
      text: 'A framed list of Academy rules, hand-copied in careful handwriting. Rule 1 reads: "Outcomes, once decided, remain decided." Someone — recently, in different ink — has added a question mark after it.',
      next: null,
    },
  },
};
