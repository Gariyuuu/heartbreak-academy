import type { MapDefinition } from "../../game/maps/types";

// 22 wide x 14 tall, 32px tiles. Warm, lantern-lit festival stalls (L).
// A deliberate tonal breather — no combat here. West door back to the
// Dormitory.
const W = 22;
const BORDER = "#".repeat(W);
const PLAIN = "#" + ".".repeat(W - 2) + "#";
const WEST_DOOR_ROW = "D" + ".".repeat(W - 2) + "#";
const BOOTH_ROW = "#" + "..LL".repeat(5) + "#";

const grid: string[] = [
  BORDER,
  PLAIN,
  BOOTH_ROW,
  PLAIN,
  PLAIN,
  BOOTH_ROW,
  PLAIN,
  WEST_DOOR_ROW,
  PLAIN,
  BOOTH_ROW,
  PLAIN,
  PLAIN,
  PLAIN,
  BORDER,
];

export const festivalGrounds: MapDefinition = {
  id: "festivalGrounds",
  name: "Festival Grounds",
  tileSize: 32,
  theme: "festival",
  grid,
  spawn: { col: 1, row: 8 },
  npcs: [
    {
      id: "mika_festival",
      characterId: "mika",
      col: 8,
      row: 3,
      facing: "down",
      dialogueId: "mika_festival",
    },
    {
      id: "sora_festival",
      characterId: "sora",
      col: 15,
      row: 8,
      facing: "down",
      dialogueId: "sora_festival",
    },
  ],
  interactables: [
    {
      id: "festival_booth_sign",
      kind: "sign",
      col: 8,
      row: 6,
      label: "Booth Game",
      dialogueId: "festival_booth_flavor",
    },
    {
      id: "memory_star_festival",
      kind: "savePoint",
      col: 18,
      row: 11,
      label: "Memory Star",
    },
  ],
  exits: [
    {
      id: "to_dormitory",
      col: 0,
      row: 7,
      targetMapId: "dormitory",
      targetSpawn: { col: 16, row: 8 },
    },
  ],
  ambientNote:
    "Nobody remembers scheduling a festival this week. Everyone showed up anyway, which everyone seems to find less strange than you do.",
};
