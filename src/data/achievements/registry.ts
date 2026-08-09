import type { GameSaveState } from "../../game/save/schema";

export interface AchievementDef {
  id: string;
  title: string;
  description: string;
  secret?: boolean;
  isUnlocked: (save: GameSaveState) => boolean;
}

export const ACHIEVEMENTS: AchievementDef[] = [
  {
    id: "first_steps",
    title: "First Steps",
    description: "Meet Akari Hoshino.",
    isUnlocked: (s) => Boolean(s.flags["met_akari"]),
  },
  {
    id: "insert_coin",
    title: "Insert Coin",
    description: "Meet Mika Amemiya.",
    isUnlocked: (s) => Boolean(s.flags["met_mika"]),
  },
  {
    id: "locker_solved",
    title: "4-1-7",
    description: "Crack Locker 108.",
    isUnlocked: (s) => Boolean(s.flags["locker_108_opened"]),
  },
  {
    id: "first_spare",
    title: "Heard, Not Fought",
    description: "SPARE an enemy for the first time.",
    isUnlocked: (s) => s.route.sparedCount > 0,
  },
  {
    id: "first_victory",
    title: "Fair Fight",
    description: "Defeat an enemy in FIGHT for the first time.",
    isUnlocked: (s) => s.route.defeatedCount > 0,
  },
  {
    id: "galaxy_rival",
    title: "GALAXY RIVAL",
    description: "Resolve Mika's arcade challenge, however you choose to.",
    isUnlocked: (s) => Boolean(s.flags["mika_challenge_resolved"]),
  },
  {
    id: "a_page_ahead",
    title: "A Page Ahead",
    description: "Meet Yuna Kurosawa.",
    isUnlocked: (s) => Boolean(s.flags["met_yuna"]),
  },
  {
    id: "fill_in_the_blank",
    title: "Fill in the Blank",
    description: "Solve the poem in the stacks.",
    isUnlocked: (s) => Boolean(s.flags["poetry_blank_solved"]),
  },
  {
    id: "the_shelves_so_far",
    title: "The Shelves, So Far",
    description: "Find the Infinite Library.",
    isUnlocked: (s) => s.visitedRooms.includes("infiniteLibrary"),
  },
  {
    id: "no_scheduled_festival",
    title: "No Scheduled Festival",
    description: "Find the Festival Grounds.",
    isUnlocked: (s) => s.visitedRooms.includes("festivalGrounds"),
  },
  {
    id: "the_edge_of_here",
    title: "The Edge of Here",
    description: "Find the current edge of what's been built.",
    secret: true,
    isUnlocked: (s) => s.visitedRooms.includes("nullWing"),
  },
  {
    id: "for_science",
    title: "For Science",
    description: "Meet Sora Minase.",
    isUnlocked: (s) => Boolean(s.flags["met_sora"]),
  },
  {
    id: "still_wet",
    title: "Still Wet",
    description: "Meet Nana Fujimori.",
    isUnlocked: (s) => Boolean(s.flags["met_nana"]),
  },
  {
    id: "insert_coin_2",
    title: "New Challenger",
    description: "Meet Glitch Sprite in the Gaming Club.",
    isUnlocked: (s) => Boolean(s.flags["seen_enemy_glitch_sprite"]),
  },
  {
    id: "opening_night",
    title: "Opening Night",
    description: "Meet Reina Tsukishiro.",
    isUnlocked: (s) => Boolean(s.flags["met_reina"]),
  },
  {
    id: "act_two",
    title: "Act Two",
    description: "Resolve Reina's performance, however you choose to.",
    isUnlocked: (s) => Boolean(s.flags["reina_boss_resolved"]),
  },
  {
    id: "outcomes_decided",
    title: "Outcomes, Once Decided",
    description: "Find the Student Council Tower.",
    isUnlocked: (s) => Boolean(s.flags["akari_confrontation_unlocked"]),
  },
  {
    id: "question_mark",
    title: "A Question Mark",
    description: "Resolve Akari's confrontation, however you choose to.",
    isUnlocked: (s) => Boolean(s.flags["akari_boss_resolved"]),
  },
  {
    id: "somewhere_else",
    title: "Somewhere Else",
    description: "???",
    secret: true,
    isUnlocked: (s) => Boolean(s.flags["met_kaede"]),
  },
  {
    id: "every_third_light",
    title: "Every Third Light",
    description: "Encounter Flicker in the Underground Maintenance Level.",
    secret: true,
    isUnlocked: (s) => Boolean(s.flags["seen_enemy_flicker"]),
  },
  {
    id: "half_a_step_behind",
    title: "Half a Step Behind",
    description: "Encounter your Reflection.",
    secret: true,
    isUnlocked: (s) => Boolean(s.flags["seen_enemy_reflection"]),
  },
  {
    id: "it_gets_easier",
    title: "It Gets Easier",
    description: "???",
    secret: true,
    isUnlocked: (s) => s.route.deaths >= 2,
  },
  {
    id: "the_whole_rotation",
    title: "The Whole Rotation",
    description: "Find all four of Towa's nap spots.",
    secret: true,
    isUnlocked: (s) =>
      Boolean(s.flags["met_towa"]) &&
      Boolean(s.flags["met_towa_courtyard"]) &&
      Boolean(s.flags["met_towa_library"]) &&
      Boolean(s.flags["met_towa_classroom"]),
  },
];
