import type { MapDefinition } from "../../game/maps/types";

// 18 wide x 14 tall, 32px tiles. Quiet, contemplative — no combat here.
// South door back to the Theater Wing.
const W = 18;
const BORDER = "#".repeat(W);
const PLAIN = "#" + ".".repeat(W - 2) + "#";
const SOUTH_DOOR_ROW = "#".repeat(8) + "D" + "#".repeat(W - 9);
const PLANTER_ROW = "#" + "." + "AA.".repeat(5) + "#";

const grid: string[] = [
  BORDER,
  PLAIN,
  PLANTER_ROW,
  PLAIN,
  PLAIN,
  PLAIN,
  PLAIN,
  PLANTER_ROW,
  PLAIN,
  PLAIN,
  PLAIN,
  PLAIN,
  PLAIN,
  SOUTH_DOOR_ROW,
];

export const rooftopGardens: MapDefinition = {
  id: "rooftopGardens",
  name: "Rooftop Gardens",
  tileSize: 32,
  theme: "rooftop",
  grid,
  spawn: { col: 9, row: 11 },
  npcs: [
    {
      id: "kaede",
      characterId: "kaede",
      col: 9,
      row: 4,
      facing: "down",
      dialogueId: "kaede_glimpse",
    },
  ],
  interactables: [
    {
      id: "memory_star_rooftop",
      kind: "savePoint",
      col: 14,
      row: 10,
      label: "Memory Star",
    },
    {
      id: "rooftop_view",
      kind: "sign",
      col: 3,
      row: 10,
      label: "The View",
      dialogueId: "rooftop_view_flavor",
    },
  ],
  exits: [
    {
      id: "to_theater_wing",
      col: 8,
      row: 13,
      targetMapId: "theaterWing",
      targetSpawn: { col: 20, row: 1 },
    },
  ],
  ambientNote:
    "From up here you can see most of the Academy at once, and it's smaller than it has any right to be from the inside.",
};
