import type { MapDefinition } from "../../game/maps/types";

// 20 wide x 14 tall, 32px tiles. Lab theme: workbenches (L) and shelving
// (A) clutter the room. West door connects back to the Courtyard.
const W = 20;
const BORDER = "#".repeat(W);
const PLAIN = "#" + ".".repeat(W - 2) + "#";
const WEST_DOOR_ROW = "D" + ".".repeat(W - 2) + "#";
const LAB_ROW = "#" + "..LL....LL....LL.." + "#";
const SHELF_ROW = "#" + ".".repeat(2) + "AAAA" + ".".repeat(7) + "AAAA" + "." + "#";
const SOUTH_DOOR_ROW = "#".repeat(9) + "D" + "#".repeat(W - 10);

const grid: string[] = [
  BORDER,
  PLAIN,
  LAB_ROW,
  LAB_ROW,
  PLAIN,
  PLAIN,
  WEST_DOOR_ROW,
  PLAIN,
  PLAIN,
  SHELF_ROW,
  PLAIN,
  PLAIN,
  PLAIN,
  SOUTH_DOOR_ROW,
];

export const scienceBuilding: MapDefinition = {
  id: "scienceBuilding",
  name: "Science Building",
  tileSize: 32,
  theme: "lab",
  grid,
  spawn: { col: 1, row: 6 },
  npcs: [
    {
      id: "sora",
      characterId: "sora",
      col: 10,
      row: 10,
      facing: "down",
      dialogueId: "sora_intro",
    },
    {
      id: "stray_equation",
      characterId: "stray_equation",
      col: 6,
      row: 3,
      facing: "down",
      dialogueId: "",
      patrol: [
        { col: 6, row: 3 },
        { col: 12, row: 3 },
        { col: 12, row: 4 },
        { col: 6, row: 4 },
      ],
      encounterId: "stray_equation",
    },
  ],
  interactables: [
    {
      id: "gadget_shelf",
      kind: "sign",
      col: 4,
      row: 9,
      label: "Gadget Shelf",
      dialogueId: "gadget_shelf_flavor",
    },
    {
      id: "memory_star_science",
      kind: "savePoint",
      col: 15,
      row: 11,
      label: "Memory Star",
    },
    {
      id: "soras_containment_board",
      kind: "bossStage",
      col: 17,
      row: 2,
      label: "The Containment Board",
      requiresFlag: "stray_equation_faced",
      encounterId: "stray_equation_boss",
    },
  ],
  exits: [
    {
      id: "to_courtyard",
      col: 0,
      row: 6,
      targetMapId: "courtyard",
      targetSpawn: { col: 20, row: 13 },
    },
    {
      id: "to_underground_maintenance",
      col: 9,
      row: 13,
      targetMapId: "undergroundMaintenance",
      targetSpawn: { col: 9, row: 1 },
    },
  ],
  ambientNote:
    "Every surface hums faintly, even the ones that clearly aren't plugged into anything.",
};
