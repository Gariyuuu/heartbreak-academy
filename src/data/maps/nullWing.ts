import type { MapDefinition } from "../../game/maps/types";

// 14 wide x 12 tall, 32px tiles. Deliberately sparse and dark — the
// current edge of the built world. North door back to Mirror Hall.
const W = 14;
const PLAIN = "#" + ".".repeat(W - 2) + "#";
const NORTH_DOOR_ROW = "#".repeat(6) + "D" + "#".repeat(W - 7);

const grid: string[] = [
  NORTH_DOOR_ROW,
  PLAIN,
  PLAIN,
  PLAIN,
  PLAIN,
  PLAIN,
  PLAIN,
  PLAIN,
  PLAIN,
  PLAIN,
  PLAIN,
  NORTH_DOOR_ROW,
];

export const nullWing: MapDefinition = {
  id: "nullWing",
  name: "The Null Wing",
  tileSize: 32,
  theme: "null_wing",
  grid,
  spawn: { col: 6, row: 8 },
  npcs: [
    {
      id: "kaede_null_wing",
      characterId: "kaede",
      col: 6,
      row: 4,
      facing: "down",
      dialogueId: "kaede_null_wing",
    },
    {
      id: "flicker_null_wing",
      characterId: "flicker",
      col: 9,
      row: 7,
      facing: "down",
      dialogueId: "",
      patrol: [
        { col: 9, row: 6 },
        { col: 9, row: 9 },
      ],
      encounterId: "flicker",
    },
  ],
  interactables: [
    {
      id: "the_edge",
      kind: "sign",
      col: 3,
      row: 7,
      label: "???",
      dialogueId: "null_wing_edge_flavor",
    },
    {
      id: "memory_star_null_wing",
      kind: "savePoint",
      col: 6,
      row: 6,
      label: "Memory Star",
    },
    {
      id: "past_the_edge",
      kind: "bossStage",
      col: 6,
      row: 11,
      label: "Go Through",
      requiresTimelineFlag: "newGamePlusCount",
      encounterId: "the_accumulation",
    },
  ],
  exits: [
    {
      id: "to_mirror_hall",
      col: 6,
      row: 0,
      targetMapId: "mirrorHall",
      targetSpawn: { col: 8, row: 12 },
    },
  ],
  ambientNote: "There isn't an ambient note for this room yet. That feels correct, somehow, rather than unfinished.",
};
