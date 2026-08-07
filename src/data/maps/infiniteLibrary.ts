import type { MapDefinition } from "../../game/maps/types";

// 24 wide x 16 tall, 32px tiles. A much larger, maze-like continuation of
// the stacks — checkerboarded shelf columns (L) rather than clean aisles,
// deliberately harder to read at a glance than Literature Wing's shelves.
// West door back to the antechamber stub.
const W = 24;
const BORDER = "#".repeat(W);
const PLAIN = "#" + ".".repeat(W - 2) + "#";
const WEST_DOOR_ROW = "D" + ".".repeat(W - 2) + "#";
const SHELF_ROW_A = "#" + "L.".repeat(11) + "#";
const SHELF_ROW_B = "#" + ".L".repeat(11) + "#";

const grid: string[] = [
  BORDER,
  PLAIN,
  SHELF_ROW_A,
  SHELF_ROW_B,
  SHELF_ROW_A,
  PLAIN,
  WEST_DOOR_ROW,
  PLAIN,
  SHELF_ROW_B,
  SHELF_ROW_A,
  SHELF_ROW_B,
  PLAIN,
  PLAIN,
  PLAIN,
  PLAIN,
  BORDER,
];

export const infiniteLibrary: MapDefinition = {
  id: "infiniteLibrary",
  name: "The Infinite Library",
  tileSize: 32,
  theme: "library",
  grid,
  spawn: { col: 1, row: 6 },
  npcs: [
    {
      id: "runaway_metaphor_infinite",
      characterId: "runaway_metaphor",
      col: 8,
      row: 7,
      facing: "down",
      dialogueId: "",
      patrol: [
        { col: 8, row: 7 },
        { col: 15, row: 7 },
        { col: 15, row: 11 },
        { col: 8, row: 11 },
      ],
      encounterId: "runaway_metaphor",
    },
  ],
  interactables: [
    {
      id: "endless_shelf_sign",
      kind: "sign",
      col: 20,
      row: 1,
      label: "A Shelf Without an End",
      dialogueId: "endless_shelf_flavor",
    },
    {
      id: "memory_star_infinite_library",
      kind: "savePoint",
      col: 12,
      row: 14,
      label: "Memory Star",
    },
    {
      id: "the_last_shelf",
      kind: "bossStage",
      col: 21,
      row: 1,
      label: "Follow the Shelf Around the Corner",
      requiresFlag: "metaphor_faced",
      encounterId: "runaway_metaphor_boss",
    },
  ],
  exits: [
    {
      id: "to_stub",
      col: 0,
      row: 6,
      targetMapId: "infiniteLibraryStub",
      targetSpawn: { col: 9, row: 4 },
    },
  ],
  ambientNote:
    "You've counted the shelves twice. You got a different number both times, and both numbers felt equally correct while you were counting them.",
};
