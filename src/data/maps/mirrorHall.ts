import type { MapDefinition } from "../../game/maps/types";

// 18 wide x 14 tall, 32px tiles. A deliberately symmetric room lined with
// mirrors (L) on both walls. North door back to the Abandoned Classroom
// Block, south door onward to the Null Wing.
const W = 18;
const PLAIN = "#" + ".".repeat(W - 2) + "#";
const NORTH_DOOR_ROW = "#".repeat(8) + "D" + "#".repeat(W - 9);
const SOUTH_DOOR_ROW = NORTH_DOOR_ROW;
const MIRROR_ROW = "#" + "L" + ".".repeat(W - 4) + "L" + "#";

const grid: string[] = [
  NORTH_DOOR_ROW,
  PLAIN,
  MIRROR_ROW,
  MIRROR_ROW,
  PLAIN,
  PLAIN,
  MIRROR_ROW,
  MIRROR_ROW,
  PLAIN,
  PLAIN,
  MIRROR_ROW,
  MIRROR_ROW,
  PLAIN,
  SOUTH_DOOR_ROW,
];

export const mirrorHall: MapDefinition = {
  id: "mirrorHall",
  name: "Mirror Hall",
  tileSize: 32,
  theme: "maintenance",
  grid,
  spawn: { col: 9, row: 1 },
  npcs: [
    {
      id: "reflection_patrol",
      characterId: "reflection",
      col: 9,
      row: 7,
      facing: "down",
      dialogueId: "",
      patrol: [
        { col: 9, row: 5 },
        { col: 9, row: 9 },
      ],
      encounterId: "reflection",
    },
  ],
  interactables: [
    {
      id: "mirror_hall_sign",
      kind: "sign",
      col: 3,
      row: 12,
      label: "A Mirror",
      dialogueId: "mirror_hall_sign_flavor",
    },
    {
      id: "memory_star_mirror",
      kind: "savePoint",
      col: 14,
      row: 12,
      label: "Memory Star",
    },
    {
      id: "the_whole_glass",
      kind: "bossStage",
      col: 13,
      row: 9,
      label: "The Far Mirror",
      requiresFlag: "reflection_faced",
      encounterId: "reflection_boss",
    },
  ],
  exits: [
    {
      id: "to_abandoned_classroom_block",
      col: 8,
      row: 0,
      targetMapId: "abandonedClassroomBlock",
      targetSpawn: { col: 9, row: 12 },
    },
    {
      id: "to_null_wing",
      col: 8,
      row: 13,
      targetMapId: "nullWing",
      targetSpawn: { col: 6, row: 8 },
    },
  ],
  ambientNote:
    "Every mirror in here shows the room a half-step out of sync with the room itself, like the reflection is still catching up to something that already happened.",
};
