import type { MapDefinition } from "../../game/maps/types";

// 18 wide x 14 tall, 32px tiles. Dorm theme: beds (L) line the walls,
// Nana's easel (A) sits in a quiet alcove. North door back to Courtyard.
const W = 18;
const BORDER = "#".repeat(W);
const NORTH_DOOR_ROW = "#".repeat(8) + "D" + "#".repeat(W - 9);
const EAST_DOOR_ROW = "#" + ".".repeat(W - 2) + "D";
const PLAIN = "#" + ".".repeat(W - 2) + "#";
const BED_ROW = "#" + "." + "L" + ".".repeat(12) + "L" + "." + "#";
const EASEL_ROW = "#" + ".".repeat(8) + "A" + ".".repeat(7) + "#";

const grid: string[] = [
  NORTH_DOOR_ROW,
  PLAIN,
  BED_ROW,
  PLAIN,
  BED_ROW,
  PLAIN,
  PLAIN,
  EASEL_ROW,
  EAST_DOOR_ROW,
  PLAIN,
  BED_ROW,
  PLAIN,
  BORDER,
];

export const dormitory: MapDefinition = {
  id: "dormitory",
  name: "Dormitory",
  tileSize: 32,
  theme: "dorm",
  grid,
  spawn: { col: 8, row: 1 },
  npcs: [
    {
      id: "nana",
      characterId: "nana",
      col: 8,
      row: 7,
      facing: "down",
      dialogueId: "nana_intro",
    },
  ],
  interactables: [
    {
      id: "dorm_hall_sign",
      kind: "sign",
      col: 3,
      row: 2,
      label: "Hall Sign",
      dialogueId: "dorm_hall_sign_flavor",
    },
    {
      id: "memory_star_dorm",
      kind: "savePoint",
      col: 14,
      row: 9,
      label: "Memory Star",
    },
  ],
  exits: [
    {
      id: "to_courtyard",
      col: 8,
      row: 0,
      targetMapId: "courtyard",
      targetSpawn: { col: 12, row: 14 },
    },
    {
      id: "to_festival_grounds",
      col: 17,
      row: 8,
      targetMapId: "festivalGrounds",
      targetSpawn: { col: 1, row: 8 },
    },
  ],
  ambientNote:
    "Every room here is always slightly warmer than the hallway, like something is trying, in a small way, to be kind.",
};
