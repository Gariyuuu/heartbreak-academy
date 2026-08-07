import type { MapDefinition } from "../../game/maps/types";

// 28 wide x 20 tall, 32px tiles. Library theme: three rows of shelf-stack
// aisles (cols 1-26, rows 3-10) above an open reading-nook/club-room area
// (rows 12-18). West door connects back to the antechamber; east door is a
// forward stub toward the (unbuilt) Infinite Library region.
const BORDER = "#".repeat(28);
const PLAIN = "#" + ".".repeat(26) + "#";
const SHELF_ROW = "#" + "." + "LL..".repeat(6) + "." + "#";
const EAST_DOOR_ROW = "#" + ".".repeat(26) + "D";
const WEST_DOOR_ROW = "D" + ".".repeat(26) + "#";

const grid: string[] = [
  BORDER,
  PLAIN,
  PLAIN,
  SHELF_ROW,
  SHELF_ROW,
  PLAIN,
  SHELF_ROW,
  SHELF_ROW,
  PLAIN,
  SHELF_ROW,
  SHELF_ROW,
  PLAIN,
  PLAIN,
  PLAIN,
  EAST_DOOR_ROW,
  WEST_DOOR_ROW,
  PLAIN,
  PLAIN,
  PLAIN,
  BORDER,
];

export const literatureWing: MapDefinition = {
  id: "literatureWing",
  name: "Literature Wing",
  tileSize: 32,
  theme: "library",
  grid,
  spawn: { col: 2, row: 15 },
  npcs: [
    {
      id: "yuna",
      characterId: "yuna",
      col: 20,
      row: 15,
      facing: "left",
      dialogueId: "yuna_intro",
    },
    {
      id: "towa_library",
      characterId: "sleepy_upperclassman",
      col: 7,
      row: 17,
      facing: "up",
      dialogueId: "towa_library",
    },
    {
      id: "runaway_metaphor",
      characterId: "runaway_metaphor",
      col: 13,
      row: 5,
      facing: "down",
      dialogueId: "",
      patrol: [
        { col: 13, row: 5 },
        { col: 18, row: 5 },
        { col: 18, row: 8 },
        { col: 13, row: 8 },
      ],
      encounterId: "runaway_metaphor",
    },
  ],
  interactables: [
    {
      id: "club_schedule",
      kind: "noticeboard",
      col: 3,
      row: 13,
      label: "Club Schedule",
      dialogueId: "club_schedule_flavor",
    },
    {
      id: "poetry_book",
      kind: "puzzle",
      col: 13,
      row: 9,
      label: "An Open Book",
      puzzleId: "poetry_blank",
    },
    {
      id: "memory_star_library",
      kind: "savePoint",
      col: 6,
      row: 16,
      label: "Memory Star",
    },
  ],
  exits: [
    {
      id: "back_to_antechamber",
      col: 0,
      row: 15,
      targetMapId: "literatureWingStub",
      targetSpawn: { col: 9, row: 4 },
    },
    {
      id: "toward_infinite_library",
      col: 27,
      row: 14,
      targetMapId: "infiniteLibraryStub",
      targetSpawn: { col: 1, row: 4 },
    },
  ],
  ambientNote:
    "The air smells like old paper and, very faintly, like a story that hasn't decided how it ends.",
};
