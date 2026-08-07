import type { MapDefinition } from "../../game/maps/types";

// 26 wide x 18 tall, 32px tiles. Border wall, symmetric pillar clusters,
// a locker bay (left, col1), an arcade corner (right, col24), a door out
// to the Literature Wing stub punched through the east wall at row 9.
// north wall with a door at col 20 (northeast, to the Student Council Tower)
const NORTH_DOOR_ROW = "#".repeat(20) + "D" + "#".repeat(5);
const PLAIN = "#" + ".".repeat(24) + "#";
const PILLARS = "#" + "....##..........##......" + "#";
const LOCKER_ROW = "#" + "L" + ".".repeat(23) + "#";
const LOCKER_DOOR_ROW = "#" + "L" + ".".repeat(23) + "D";
const ARCADE_ROW = "#" + ".".repeat(23) + "A" + "#";
// south wall with a door punched through at col 12 (outside, to Courtyard)
const SOUTH_DOOR_ROW = "#".repeat(12) + "D" + "#".repeat(13);

const grid: string[] = [
  NORTH_DOOR_ROW,
  PLAIN,
  PLAIN,
  PLAIN,
  PILLARS,
  PILLARS,
  PLAIN,
  LOCKER_ROW,
  LOCKER_ROW,
  LOCKER_DOOR_ROW,
  PLAIN,
  PLAIN,
  PILLARS,
  PILLARS,
  ARCADE_ROW,
  ARCADE_ROW,
  PLAIN,
  SOUTH_DOOR_ROW,
];

export const arrivalHall: MapDefinition = {
  id: "arrivalHall",
  name: "Arrival Hall",
  tileSize: 32,
  grid,
  spawn: { col: 12, row: 16 },
  npcs: [
    {
      id: "akari",
      characterId: "akari",
      col: 18,
      row: 3,
      facing: "down",
      dialogueId: "akari_intro",
    },
    {
      id: "mika",
      characterId: "mika",
      col: 21,
      row: 12,
      facing: "left",
      dialogueId: "mika_intro",
    },
    {
      id: "sleepy_upperclassman",
      characterId: "sleepy_upperclassman",
      col: 6,
      row: 14,
      facing: "down",
      dialogueId: "sleepy_upperclassman_intro",
    },
    {
      id: "stray_thought",
      characterId: "stray_thought",
      col: 16,
      row: 10,
      facing: "down",
      dialogueId: "",
      patrol: [
        { col: 16, row: 10 },
        { col: 19, row: 10 },
        { col: 19, row: 11 },
        { col: 16, row: 11 },
      ],
      encounterId: "stray_thought",
    },
  ],
  interactables: [
    {
      id: "noticeboard",
      kind: "noticeboard",
      col: 12,
      row: 1,
      label: "Notice Board",
      dialogueId: "noticeboard_flavor",
    },
    {
      id: "locker_puzzle",
      kind: "puzzle",
      col: 2,
      row: 8,
      label: "Locker 108",
      puzzleId: "locker_108",
    },
    {
      id: "memory_star_arrival",
      kind: "savePoint",
      col: 12,
      row: 10,
      label: "Memory Star",
    },
    {
      id: "arcade_cabinet",
      kind: "bossStage",
      col: 22,
      row: 14,
      label: "GALAXY RIVAL Cabinet",
      requiresFlag: "mika_challenge_unlocked",
      encounterId: "mika_boss",
    },
    {
      id: "the_way_out",
      kind: "sign",
      col: 6,
      row: 2,
      label: "??? Door",
      dialogueId: "the_way_out",
      requiresFlag: "akari_confrontation_unlocked",
    },
  ],
  exits: [
    {
      id: "to_literature_wing",
      col: 25,
      row: 9,
      targetMapId: "literatureWingStub",
      targetSpawn: { col: 1, row: 4 },
    },
    {
      id: "to_courtyard",
      col: 12,
      row: 17,
      targetMapId: "courtyard",
      targetSpawn: { col: 12, row: 1 },
    },
    {
      id: "to_student_council_tower",
      col: 20,
      row: 0,
      targetMapId: "studentCouncilTower",
      targetSpawn: { col: 6, row: 12 },
    },
  ],
  ambientNote:
    "The Arrival Hall smells like fresh chalk and, faintly, like a room that has been aired out for a hundred years.",
};
