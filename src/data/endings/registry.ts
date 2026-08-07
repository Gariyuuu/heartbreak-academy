import type { GameStore } from "../../game/state/store";

export type EndingMood = "warm" | "neutral" | "cold" | "strange";

export interface EndingDef {
  id: string;
  title: string;
  mood: EndingMood;
  paragraphs: string[];
  matches: (store: GameStore) => boolean;
}

// Every boss's onResolved sets one of these, regardless of spare/defeat —
// used by "the_whole_building" below to detect a completionist run.
const ALL_BOSS_RESOLVED_FLAGS = [
  "mika_challenge_resolved",
  "reina_boss_resolved",
  "akari_boss_resolved",
  "reflection_boss_resolved",
  "flicker_boss_resolved",
  "runaway_metaphor_boss_resolved",
  "stray_thought_boss_resolved",
  "glitch_sprite_boss_resolved",
  "stray_equation_boss_resolved",
];

// Checked in order — first match wins. Most-specific/secret conditions
// come first so a broad route-leaning check never shadows them.
export const ENDINGS: EndingDef[] = [
  {
    id: "second_draft",
    title: "SECOND DRAFT",
    mood: "strange",
    matches: (store) => store.timeline.newGamePlusCount >= 1,
    paragraphs: [
      "Nothing about this run looks like the first one, exactly, and yet the building keeps doing this small, specific thing where a hallway feels over-familiar half a second before you turn into it.",
      "Nobody here remembers you starting over. You're fairly sure of that. But something underneath the normal memory clearly does, because none of this quite qualifies as new anymore, and it hasn't since the moment you walked back in.",
      "You don't get an explanation for that. You get a school that's slightly less surprising than it should be, and you get to decide for yourself whether that's comforting.",
    ],
  },
  {
    id: "the_whole_building",
    title: "THE WHOLE BUILDING",
    mood: "strange",
    matches: (store) => ALL_BOSS_RESOLVED_FLAGS.every((flag) => Boolean(store.save.flags[flag])),
    paragraphs: [
      "You've stood in every room that had something waiting in it — the tower, the pond, the switch, the shelf, the mirror, the board, all of it — and every single one of them has an answer now, for better or worse.",
      "The building doesn't feel smaller for it. If anything it feels more honest, like a floor plan that finally admits how much of itself it was hiding.",
      'You\'re not sure "finished" is a word THE AFTERCLASS actually has a use for. But you\'ve run out of doors that haven\'t been opened, and that has to count for something.',
    ],
  },
  {
    id: "the_short_version",
    title: "THE SHORT VERSION",
    mood: "neutral",
    matches: (store) => ALL_BOSS_RESOLVED_FLAGS.filter((flag) => Boolean(store.save.flags[flag])).length <= 1,
    paragraphs: [
      "You didn't linger. Most of the doors that opened, you left closed on purpose — not out of fear, exactly, just a sense that you didn't need to check behind every single one of them to know you'd been here.",
      "THE AFTERCLASS doesn't seem to mind. If anything, it barely notices you've gone, the way a room doesn't notice which visitors stayed for the whole tour.",
      "You leave with most of the building still a rumor. That's not nothing. It's just brief.",
    ],
  },
  {
    id: "the_edge",
    title: "THE EDGE",
    mood: "strange",
    matches: (store) => store.save.route.deaths >= 3 && Boolean(store.save.flags.met_kaede),
    paragraphs: [
      "You stop counting the times you've come back. Somewhere past the third or fourth, it quit feeling like failure and started feeling like a route — one more hallway the school just hadn't gotten around to admitting was there.",
      "Kaede is at the edge again when you find her, like she always is. She doesn't ask how many times this makes. She never has.",
      '"I don\'t think the building minds," she says. "I think it just wanted someone to notice it wasn\'t finished, and to come back anyway."',
      "You stand with her at the place the floor plan runs out, and for once neither of you tries to turn it into an answer.",
    ],
  },
  {
    id: "full_bloom",
    title: "FULL BLOOM",
    mood: "warm",
    matches: (store) => {
      const r = store.save.relationships;
      const f = store.save.flags;
      return (
        store.routeLeaning() === "connection" &&
        Boolean(f.akari_boss_resolved) &&
        r.akari.affection >= 3 &&
        Boolean(f.met_yuna) &&
        Boolean(f.met_sora) &&
        Boolean(f.met_nana) &&
        Boolean(f.met_reina)
      );
    },
    paragraphs: [
      "Akari finds you before you go looking for her, which by itself tells you something has changed.",
      '"I updated the record again," she says. "It doesn\'t read like a warning anymore. I wanted you to know that, in case you were wondering whether any of it mattered."',
      "You think about the locker, the arcade cabinet, the greenhouse, the dorm hallway, the stage — every door you didn't have to walk through and did anyway. None of them close behind you. That's new too.",
      "The Afterclass doesn't stop being strange. It just stops being something you're only surviving.",
    ],
  },
  {
    id: "the_one_you_kept_coming_back_to",
    title: "THE ONE YOU KEPT COMING BACK TO",
    mood: "warm",
    matches: (store) => {
      const entries = Object.values(store.save.relationships);
      if (entries.length === 0) return false;
      const sorted = [...entries].sort((a, b) => b.affection - a.affection);
      const top = sorted[0].affection;
      const second = sorted[1]?.affection ?? 0;
      return top >= 5 && top - second >= 3;
    },
    paragraphs: [
      "There's one person you kept finding excuses to talk to, more than made any real sense given how many hallways this place has and how little time any of it seemed to actually cost you.",
      "You couldn't have explained it cleanly at the start. You're not sure you can now, either. It just kept being the conversation you wanted to have again.",
      "Everyone else in THE AFTERCLASS gets a version of you that's polite, curious, occasionally brave. One person gets more than that, and you don't especially regret which one.",
    ],
  },
  {
    id: "kept_the_door_open",
    title: "KEPT THE DOOR OPEN",
    mood: "warm",
    matches: (store) => store.routeLeaning() === "connection",
    paragraphs: [
      "Nobody in this building keeps a perfect record of you, and you're starting to think that's the point rather than the flaw.",
      "You spared more than you broke. It shows in small ways — a shortcut someone mentions without being asked, a name remembered on the second meeting instead of the third.",
      "Whatever THE AFTERCLASS actually is, you leave it a little less locked than you found it.",
    ],
  },
  {
    id: "what_the_record_says",
    title: "WHAT THE RECORD SAYS",
    mood: "cold",
    matches: (store) => store.routeLeaning() === "severance" && !store.save.flags.akari_boss_resolved,
    paragraphs: [
      "You never do make it up the tower stairs to finish what Akari started. Maybe you meant to. Maybe you didn't.",
      "The record she's keeping on you stays exactly as unflattering as it was the day she opened it, un-updated, un-argued-with.",
      "The building doesn't punish you for that. It just quietly stops introducing you to anyone new.",
    ],
  },
  {
    id: "the_updated_record",
    title: "THE UPDATED RECORD",
    mood: "cold",
    matches: (store) => store.routeLeaning() === "severance",
    paragraphs: [
      '"I did warn you," Akari says, and she isn\'t wrong. "I keep a record of what people do here, not what they meant to do."',
      "You defeated more than you spared, and the tally follows you out of every room whether or not anyone mentions it out loud.",
      "This isn't a bad ending, exactly. It's an honest one. THE AFTERCLASS remembers you as someone who came through hard, and doesn't pretend otherwise.",
    ],
  },
  {
    id: "somewhere_in_between",
    title: "SOMEWHERE IN BETWEEN",
    mood: "neutral",
    matches: () => true,
    paragraphs: [
      "You didn't pick a side, exactly — or you picked several, depending on the day and who was asking.",
      "The record the school keeps on you reads less like a verdict and more like a rough draft: contradictory in places, unfinished in others, entirely honest about both.",
      "Some doors close. Others, unexpectedly, don't. You leave THE AFTERCLASS the same way you found it — unresolved, and not entirely sure that's a bad thing.",
    ],
  },
];

export function resolveEnding(store: GameStore): EndingDef {
  return ENDINGS.find((ending) => ending.matches(store)) ?? ENDINGS[ENDINGS.length - 1];
}
