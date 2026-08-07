export interface CharacterDef {
  id: string;
  name: string;
  title: string;
  bio: string;
  colorway: { body: string; accent: string };
}

export const CHARACTERS: Record<string, CharacterDef> = {
  akari: {
    id: "akari",
    name: "Akari Hoshino",
    title: "Student Council President",
    bio: "Elegant, disciplined, extremely competent — and increasingly certain that you shouldn't be able to change how things turn out.",
    colorway: { body: "#5b6ee1", accent: "#e8ebff" },
  },
  mika: {
    id: "mika",
    name: "Mika Amemiya",
    title: "Gaming Club",
    bio: "Chaotic, funny, competitive. Explains half the school's secret mechanics through games instead of telling you outright.",
    colorway: { body: "#ff8f4d", accent: "#fff1e6" },
  },
  sleepy_upperclassman: {
    id: "sleepy_upperclassman",
    name: "Towa Ebisawa",
    title: "Third-Year, Perpetually Asleep",
    bio: "Naps in a different hallway every day. Occasionally says something that implies she's noticed more than she lets on.",
    colorway: { body: "#9b8fae", accent: "#e4dcf0" },
  },
  yuna: {
    id: "yuna",
    name: "Yuna Kurosawa",
    title: "Literature Club",
    bio: "Quiet. Writes short stories that describe things before they happen.",
    colorway: { body: "#6fae8f", accent: "#e4f2ea" },
  },
  stray_thought: {
    id: "stray_thought",
    name: "Stray Thought",
    title: "???",
    bio: "A small drifting worry given shape. Common in the halls near exam season. Mostly harmless if you let it finish what it's saying.",
    colorway: { body: "#c9b8f0", accent: "#f3ecff" },
  },
  runaway_metaphor: {
    id: "runaway_metaphor",
    name: "Runaway Metaphor",
    title: "???",
    bio: "A comparison that got loose from its sentence somewhere in the stacks. Prone to over-explaining itself. Not dangerous, exactly — just insistent.",
    colorway: { body: "#4a6fa5", accent: "#dce8f5" },
  },
  sora: {
    id: "sora",
    name: "Sora Minase",
    title: "Science Club",
    bio: "Builds gadgets nobody asked for, half of which work. Has recently become obsessed with Memory Stars as an actual physical phenomenon rather than a metaphor.",
    colorway: { body: "#e8a75c", accent: "#fff3e0" },
  },
  nana: {
    id: "nana",
    name: "Nana Fujimori",
    title: "Art Student",
    bio: "Soft-spoken. Paints constantly. The paintings in her room don't always match what actually happened.",
    colorway: { body: "#d88f9e", accent: "#fbe8ec" },
  },
  reina: {
    id: "reina",
    name: "Reina Tsukishiro",
    title: "Drama Club",
    bio: "Extremely expressive and confident, treats every conversation like a performance for an audience only she can see — until she's alone with someone, and stops performing all at once.",
    colorway: { body: "#c9a13b", accent: "#fff3d6" },
  },
  kaede: {
    id: "kaede",
    name: "Kaede Shirakawa",
    title: "Transfer Student",
    bio: "Arrived recently, or so everyone says. Sometimes speaks like she's already had this conversation. Doesn't correct anyone about it.",
    colorway: { body: "#8a7fb0", accent: "#e8e4f5" },
  },
  stray_equation: {
    id: "stray_equation",
    name: "Stray Equation",
    title: "???",
    bio: "A proof that never got finished, still looking for its missing step. Attacks by trying to show its work. Common near the labs during exam season.",
    colorway: { body: "#7fb0c9", accent: "#e8f4fa" },
  },
  glitch_sprite: {
    id: "glitch_sprite",
    name: "Glitch Sprite",
    title: "???",
    bio: "A stray bit of some old cabinet's code that never got cleaned up. Mostly just wants someone to play against.",
    colorway: { body: "#5b6ee1", accent: "#ffe066" },
  },
  flicker: {
    id: "flicker",
    name: "Flicker",
    title: "???",
    bio: "A bad fluorescent tube's worth of light that decided to keep existing after the tube got replaced. Doesn't like being looked at directly. Likes being ignored even less.",
    colorway: { body: "#8fae6f", accent: "#e4f5d8" },
  },
  reflection: {
    id: "reflection",
    name: "Reflection",
    title: "???",
    bio: "Wears your outline, more or less. Doesn't say anything you haven't already done somewhere in this building.",
    colorway: { body: "#c9c9e8", accent: "#f5f5ff" },
  },
};

export function getCharacterName(id: string | null | undefined): string {
  if (!id) return "";
  return CHARACTERS[id]?.name ?? id;
}

export function getCharacter(id: string): CharacterDef | undefined {
  return CHARACTERS[id];
}
