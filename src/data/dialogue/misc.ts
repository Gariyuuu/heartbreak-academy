import type { DialogueTreeDef } from "../../game/dialogue/types";

export const sleepyUpperclassmanIntro: DialogueTreeDef = {
  id: "sleepy_upperclassman_intro",
  pickStart: (store) => (store.save.flags["met_towa"] ? "return" : "first"),
  nodes: {
    first: {
      id: "first",
      speakerId: "sleepy_upperclassman",
      expression: "neutral",
      text: "...mm. New. You're new. I can tell because you're still walking like the floor's going to stay where you left it.",
      next: "second",
      onEnter: (store) => store.setFlag("met_towa", true),
    },
    second: {
      id: "second",
      speakerId: "sleepy_upperclassman",
      expression: "neutral",
      text: "I'm Towa. Third-year. Don't worry about the year part too much — it stopped meaning much a while ago. Nice nap spot, this. Ten out of ten, would sleep here again.",
      next: null,
    },
    return: {
      id: "return",
      speakerId: "sleepy_upperclassman",
      expression: "embarrassed",
      text: "Oh — you again. Or, hm. Have I said that to you before? Don't answer. I'd rather not know either way.",
      next: null,
    },
  },
};

export const noticeboardFlavor: DialogueTreeDef = {
  id: "noticeboard_flavor",
  pickStart: () => "read",
  nodes: {
    read: {
      id: "read",
      speakerId: null,
      expression: "neutral",
      text: 'A cork board, layered thick with flyers. GAMING CLUB — all welcome, Mika will only make fun of you a normal amount. LITERATURE CLUB — meetings suspended "until further notice." LOST & FOUND — one umbrella, one house key, and a number nobody claims: 4-1-7. Inquire at Locker 108 if it means something to you.',
      next: null,
    },
  },
};

export const towaLibrary: DialogueTreeDef = {
  id: "towa_library",
  pickStart: (store) => (store.save.flags["met_towa_library"] ? "return" : "first"),
  nodes: {
    first: {
      id: "first",
      speakerId: "sleepy_upperclassman",
      expression: "neutral",
      text: "...oh. You found this nap spot too. I have a whole rotation. This one's got the best acoustics — you can hear Yuna's pen from here. Very soothing.",
      next: null,
      onEnter: (store) => store.setFlag("met_towa_library", true),
    },
    return: {
      id: "return",
      speakerId: "sleepy_upperclassman",
      expression: "laughing",
      text: "You're getting good at finding me. I should be more insulted by that than I am.",
      next: null,
    },
  },
};

export const clubScheduleFlavor: DialogueTreeDef = {
  id: "club_schedule_flavor",
  pickStart: () => "read",
  nodes: {
    read: {
      id: "read",
      speakerId: null,
      expression: "neutral",
      text: 'A handwritten schedule pinned to corkboard. "LITERATURE CLUB — meets whenever Yuna is here, which is always, so: whenever." Below it, in different handwriting: "we should get more members" and, in Yuna\'s handwriting underneath that: "we shouldn\'t."',
      next: null,
    },
  },
};

export const resolvedWingSign: DialogueTreeDef = {
  id: "resolved_wing_sign",
  pickStart: () => "sign",
  nodes: {
    sign: {
      id: "sign",
      speakerId: null,
      expression: "neutral",
      text: "The hallway that used to flicker between ideas of itself has settled on one: shelves, mostly. It looks almost embarrassed about how long that took.",
      next: null,
    },
  },
};

export const infiniteLibrarySign: DialogueTreeDef = {
  id: "infinite_library_sign",
  pickStart: () => "sign",
  nodes: {
    sign: {
      id: "sign",
      speakerId: null,
      expression: "neutral",
      text: "Shelves, as far as you can see, and then further than that. Whatever this section was going to become, it's settled on being enormous, and not especially interested in your sense of direction.",
      next: null,
    },
  },
};
