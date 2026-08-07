export interface QuestDef {
  id: string;
  title: string;
  description: string;
  /** flags that mark completion, checked in order; first match wins */
  isComplete: (flags: Record<string, boolean | number | string>) => boolean;
  isActive: (flags: Record<string, boolean | number | string>) => boolean;
}

export const QUESTS: QuestDef[] = [
  {
    id: "locker_108",
    title: "Locker 108",
    description: "Something about the number on that Lost & Found flyer won't leave you alone.",
    isActive: () => true,
    isComplete: (flags) => Boolean(flags["locker_108_opened"]),
  },
  {
    id: "mika_challenge",
    title: "GALAXY RIVAL",
    description: "Mika's daring you to challenge her cabinet. Win, or win her over.",
    isActive: (flags) => Boolean(flags["mika_challenge_unlocked"]),
    isComplete: (flags) => Boolean(flags["mika_challenge_resolved"]),
  },
  {
    id: "poetry_blank",
    title: "An Open Book",
    description: "A book left out in the stacks, open to an unfinished poem.",
    isActive: (flags) => Boolean(flags["met_yuna"]),
    isComplete: (flags) => Boolean(flags["poetry_blank_solved"]),
  },
];
