export const OPENING_CUTSCENE_LINES: string[] = [
  "You don't remember the walk here. You remember deciding to walk, and then you were already inside.",
  "The building calls itself THE AFTERCLASS. Nobody you've asked seems to find that strange.",
  "It looks like a school. It mostly behaves like one, too — bells, lockers, the smell of chalk.",
  "Someone told you, very casually, that most people find their way home eventually.",
  "You intend to be one of them. For now, that just means finding out where 'home' is supposed to be.",
  "The Arrival Hall doors are open.",
];

// The meta-save (timeline) survives new games. New Game+ threads one extra
// line through the opening if you've been through this before — the world
// quietly remembering something a fresh save wouldn't know on its own.
export function getOpeningCutsceneLines(newGamePlusCount: number): string[] {
  if (newGamePlusCount <= 0) return OPENING_CUTSCENE_LINES;
  return [
    OPENING_CUTSCENE_LINES[0],
    "Except this time, some small, wordless part of you already knows which hallway comes next.",
    ...OPENING_CUTSCENE_LINES.slice(1),
  ];
}
