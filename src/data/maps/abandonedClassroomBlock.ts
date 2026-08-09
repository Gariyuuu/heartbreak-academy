import type { MapDefinition } from "../../game/maps/types";

// 20 wide x 14 tall, 32px tiles. Rows of desks (L), most abandoned. North
// door back to Underground Maintenance, south door onward to Mirror Hall.
const W = 20;
const PLAIN = "#" + ".".repeat(W - 2) + "#";
const NORTH_DOOR_ROW = "#".repeat(9) + "D" + "#".repeat(W - 10);
const SOUTH_DOOR_ROW = "#".repeat(9) + "D" + "#".repeat(W - 10);
const DESK_ROW = "#" + "..LL.LL.LL.LL.LL.." + "#";

const grid: string[] = [
  NORTH_DOOR_ROW,
  PLAIN,
  PLAIN,
  DESK_ROW,
  DESK_ROW,
  PLAIN,
  PLAIN,
  DESK_ROW,
  DESK_ROW,
  PLAIN,
  PLAIN,
  PLAIN,
  PLAIN,
  SOUTH_DOOR_ROW,
];

export const abandonedClassroomBlock: MapDefinition = {
  id: "abandonedClassroomBlock",
  name: "Abandoned Classroom Block",
  tileSize: 32,
  theme: "maintenance",
  grid,
  spawn: { col: 10, row: 1 },
  npcs: [
    {
      id: "flicker_classroom",
      characterId: "flicker",
      col: 8,
      row: 10,
      facing: "down",
      dialogueId: "",
      patrol: [
        { col: 8, row: 10 },
        { col: 13, row: 10 },
        { col: 13, row: 11 },
        { col: 8, row: 11 },
      ],
      encounterId: "flicker",
    },
    {
      id: "towa_classroom",
      characterId: "sleepy_upperclassman",
      col: 6,
      row: 5,
      facing: "up",
      dialogueId: "towa_classroom",
    },
  ],
  interactables: [
    {
      id: "nameplate",
      kind: "sign",
      col: 5,
      row: 4,
      label: "A Desk Nameplate",
      dialogueId: "nameplate_flavor",
    },
    {
      id: "memory_star_classroom",
      kind: "savePoint",
      col: 16,
      row: 11,
      label: "Memory Star",
    },
  ],
  exits: [
    {
      id: "to_underground_maintenance",
      col: 9,
      row: 0,
      targetMapId: "undergroundMaintenance",
      targetSpawn: { col: 4, row: 12 },
    },
    {
      id: "to_mirror_hall",
      col: 9,
      row: 13,
      targetMapId: "mirrorHall",
      targetSpawn: { col: 9, row: 1 },
    },
  ],
  ambientNote:
    "The attendance charts are still up. Some of the names are names you recognize, filled in for days that haven't happened yet.",
};
