import type { MapDefinition } from "../../game/maps/types";

// 18 wide x 14 tall, 32px tiles. Dim maintenance tunnels, pipe clusters
// (L) along the walls. North door back to the Science Building, south
// door onward to the Abandoned Classroom Block.
const W = 18;
const PLAIN = "#" + ".".repeat(W - 2) + "#";
const NORTH_DOOR_ROW = "#".repeat(8) + "D" + "#".repeat(W - 9);
const SOUTH_DOOR_ROW = "#".repeat(4) + "D" + "#".repeat(W - 5);
const PIPE_ROW = "#" + "LL...LL...LL...L" + "#";

const grid: string[] = [
  NORTH_DOOR_ROW,
  PLAIN,
  PIPE_ROW,
  PLAIN,
  PLAIN,
  PLAIN,
  PIPE_ROW,
  PLAIN,
  PLAIN,
  PLAIN,
  PIPE_ROW,
  PLAIN,
  PLAIN,
  SOUTH_DOOR_ROW,
];

export const undergroundMaintenance: MapDefinition = {
  id: "undergroundMaintenance",
  name: "Underground Maintenance Level",
  tileSize: 32,
  theme: "maintenance",
  grid,
  spawn: { col: 8, row: 1 },
  npcs: [
    {
      id: "flicker_patrol",
      characterId: "flicker",
      col: 6,
      row: 5,
      facing: "down",
      dialogueId: "",
      patrol: [
        { col: 6, row: 5 },
        { col: 11, row: 5 },
        { col: 11, row: 9 },
        { col: 6, row: 9 },
      ],
      encounterId: "flicker",
    },
  ],
  interactables: [
    {
      id: "breaker_panel",
      kind: "sign",
      col: 3,
      row: 3,
      label: "Breaker Panel",
      dialogueId: "breaker_panel_flavor",
    },
    {
      id: "memory_star_maintenance",
      kind: "savePoint",
      col: 14,
      row: 11,
      label: "Memory Star",
    },
    {
      id: "the_unlabeled_switch",
      kind: "bossStage",
      col: 4,
      row: 3,
      label: "The Unlabeled Switch",
      requiresFlag: "flicker_faced",
      encounterId: "flicker_boss",
    },
  ],
  exits: [
    {
      id: "to_science_building",
      col: 8,
      row: 0,
      targetMapId: "scienceBuilding",
      targetSpawn: { col: 9, row: 12 },
    },
    {
      id: "to_abandoned_classroom_block",
      col: 4,
      row: 13,
      targetMapId: "abandonedClassroomBlock",
      targetSpawn: { col: 10, row: 1 },
    },
  ],
  ambientNote:
    "Every third light down here is out. It's always the same third, no matter how many times someone replaces the bulb.",
};
