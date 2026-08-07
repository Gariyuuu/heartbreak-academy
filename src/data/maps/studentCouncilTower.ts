import type { MapDefinition } from "../../game/maps/types";

// 12 wide x 16 tall, 32px tiles. Narrow, formal, tower-like — bookshelves
// (L) line the walls near the entrance. South door back to Arrival Hall.
const W = 12;
const BORDER = "#".repeat(W);
const PLAIN = "#" + ".".repeat(W - 2) + "#";
const SOUTH_DOOR_ROW = "#".repeat(5) + "D" + "#".repeat(W - 6);
const SHELF_ROW = "#" + "L" + ".".repeat(W - 4) + "L" + "#";

const grid: string[] = [
  BORDER,
  PLAIN,
  PLAIN,
  PLAIN,
  PLAIN,
  PLAIN,
  PLAIN,
  PLAIN,
  PLAIN,
  SHELF_ROW,
  SHELF_ROW,
  PLAIN,
  PLAIN,
  PLAIN,
  PLAIN,
  SOUTH_DOOR_ROW,
];

export const studentCouncilTower: MapDefinition = {
  id: "studentCouncilTower",
  name: "Student Council Tower",
  tileSize: 32,
  theme: "council",
  grid,
  spawn: { col: 6, row: 12 },
  npcs: [
    {
      id: "akari_tower",
      characterId: "akari",
      col: 6,
      row: 3,
      facing: "down",
      dialogueId: "akari_tower",
    },
  ],
  interactables: [
    {
      id: "council_rules_board",
      kind: "sign",
      col: 3,
      row: 11,
      label: "Council Rules",
      dialogueId: "council_rules_flavor",
    },
    {
      id: "memory_star_tower",
      kind: "savePoint",
      col: 8,
      row: 11,
      label: "Memory Star",
    },
    {
      id: "akari_confrontation",
      kind: "bossStage",
      col: 6,
      row: 5,
      label: "Akari",
      requiresFlag: "akari_confrontation_unlocked",
      encounterId: "akari_boss",
    },
  ],
  exits: [
    {
      id: "to_arrival_hall",
      col: 5,
      row: 15,
      targetMapId: "arrivalHall",
      targetSpawn: { col: 20, row: 1 },
    },
  ],
  ambientNote:
    "The tower is taller on the inside than the building it's attached to could possibly allow.",
};
