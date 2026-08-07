import type { MapDefinition } from "../../game/maps/types";

// 24 wide x 14 tall, 32px tiles. Rows of seats (L) face a stage at the
// north end where Reina rehearses alone. South door back to Courtyard.
const W = 24;
const PLAIN = "#" + ".".repeat(W - 2) + "#";
const SOUTH_DOOR_ROW = "#".repeat(11) + "D" + "#".repeat(W - 12);
const NORTH_DOOR_ROW = "#".repeat(20) + "D" + "#".repeat(W - 21);
const SEAT_ROW = "#" + "." + "LL.".repeat(7) + "#";

const grid: string[] = [
  NORTH_DOOR_ROW,
  PLAIN,
  PLAIN,
  PLAIN,
  PLAIN,
  SEAT_ROW,
  SEAT_ROW,
  PLAIN,
  SEAT_ROW,
  SEAT_ROW,
  PLAIN,
  PLAIN,
  PLAIN,
  SOUTH_DOOR_ROW,
];

export const theaterWing: MapDefinition = {
  id: "theaterWing",
  name: "Theater Wing",
  tileSize: 32,
  theme: "theater",
  grid,
  spawn: { col: 12, row: 12 },
  npcs: [
    {
      id: "reina",
      characterId: "reina",
      col: 12,
      row: 3,
      facing: "down",
      dialogueId: "reina_intro",
    },
  ],
  interactables: [
    {
      id: "program_note",
      kind: "sign",
      col: 3,
      row: 3,
      label: "Program Note",
      dialogueId: "program_note_flavor",
    },
    {
      id: "memory_star_theater",
      kind: "savePoint",
      col: 20,
      row: 3,
      label: "Memory Star",
    },
    {
      id: "the_stage",
      kind: "bossStage",
      col: 12,
      row: 1,
      label: "The Stage",
      requiresFlag: "reina_stage_unlocked",
      encounterId: "reina_boss",
    },
  ],
  exits: [
    {
      id: "to_courtyard",
      col: 11,
      row: 13,
      targetMapId: "courtyard",
      targetSpawn: { col: 5, row: 1 },
    },
    {
      id: "to_rooftop_gardens",
      col: 20,
      row: 0,
      targetMapId: "rooftopGardens",
      targetSpawn: { col: 9, row: 11 },
    },
  ],
  ambientNote:
    "The seats are always empty, but the stage lights are always on, like they're waiting for an audience that stopped coming a long time ago.",
};
