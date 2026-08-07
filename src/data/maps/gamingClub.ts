import type { MapDefinition } from "../../game/maps/types";

// 20 wide x 14 tall, 32px tiles. Mika's actual home turf — rows of retro
// cabinets (L), neon arcade theme. East door back to the Courtyard.
const W = 20;
const BORDER = "#".repeat(W);
const PLAIN = "#" + ".".repeat(W - 2) + "#";
const EAST_DOOR_ROW = "#" + ".".repeat(W - 2) + "D";
const CABINET_ROW = "#" + "..LL..LL..LL..LL.." + "#";

const grid: string[] = [
  BORDER,
  PLAIN,
  CABINET_ROW,
  CABINET_ROW,
  PLAIN,
  PLAIN,
  EAST_DOOR_ROW,
  PLAIN,
  CABINET_ROW,
  CABINET_ROW,
  PLAIN,
  PLAIN,
  PLAIN,
  BORDER,
];

export const gamingClub: MapDefinition = {
  id: "gamingClub",
  name: "Gaming Club",
  tileSize: 32,
  theme: "arcade",
  grid,
  spawn: { col: 18, row: 6 },
  npcs: [
    {
      id: "mika_clubroom",
      characterId: "mika",
      col: 6,
      row: 6,
      facing: "right",
      dialogueId: "mika_clubroom",
    },
    {
      id: "glitch_sprite",
      characterId: "glitch_sprite",
      col: 10,
      row: 9,
      facing: "down",
      dialogueId: "",
      patrol: [
        { col: 6, row: 9 },
        { col: 14, row: 9 },
        { col: 14, row: 11 },
        { col: 6, row: 11 },
      ],
      encounterId: "glitch_sprite",
    },
  ],
  interactables: [
    {
      id: "high_score_board",
      kind: "sign",
      col: 3,
      row: 2,
      label: "High Score Board",
      dialogueId: "high_score_board_flavor",
    },
    {
      id: "memory_star_gaming_club",
      kind: "savePoint",
      col: 16,
      row: 4,
      label: "Memory Star",
    },
    {
      id: "the_tenth_place_slot",
      kind: "bossStage",
      col: 5,
      row: 2,
      label: "Check the Tenth-Place Entry",
      requiresFlag: "glitch_sprite_faced",
      encounterId: "glitch_sprite_boss",
    },
  ],
  exits: [
    {
      id: "to_courtyard",
      col: 19,
      row: 6,
      targetMapId: "courtyard",
      targetSpawn: { col: 1, row: 7 },
    },
  ],
  ambientNote:
    "Every cabinet in here is plugged into an outlet that, if you trace it, doesn't connect to anything.",
};
