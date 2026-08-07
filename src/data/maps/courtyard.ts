import type { MapDefinition } from "../../game/maps/types";

// 22 wide x 16 tall, 32px tiles. Outdoor hub connecting Arrival Hall
// (north), the Science Building (east), and the Dormitory (south). A pond
// sits center — per the design doc's "fishing in the strange courtyard
// pond" — flanked by tree clusters and benches.
const W = 22;
const PLAIN = "#" + ".".repeat(W - 2) + "#";
// two doors on the north wall: col5 to Theater Wing, col12 to Arrival Hall
const NORTH_DOOR_ROW = "#".repeat(5) + "D" + "#".repeat(6) + "D" + "#".repeat(9);
const SOUTH_DOOR_ROW = "#".repeat(12) + "D" + "#".repeat(W - 13);
const EAST_DOOR_ROW = "#" + ".".repeat(W - 2) + "D";
const WEST_DOOR_ROW = "D" + ".".repeat(W - 2) + "#";
const TREE_ROW = "#" + "..LL" + ".".repeat(12) + "LL.." + "#";
const POND_ROW = "#" + ".".repeat(8) + "LLLL" + ".".repeat(8) + "#";
const BENCH_ROW = "#" + ".".repeat(6) + "A" + ".".repeat(6) + "A" + ".".repeat(6) + "#";

const grid: string[] = [
  NORTH_DOOR_ROW,
  PLAIN,
  TREE_ROW,
  PLAIN,
  PLAIN,
  POND_ROW,
  POND_ROW,
  WEST_DOOR_ROW,
  BENCH_ROW,
  PLAIN,
  TREE_ROW,
  PLAIN,
  PLAIN,
  EAST_DOOR_ROW,
  PLAIN,
  SOUTH_DOOR_ROW,
];

export const courtyard: MapDefinition = {
  id: "courtyard",
  name: "Courtyard",
  tileSize: 32,
  theme: "courtyard",
  grid,
  spawn: { col: 12, row: 1 },
  npcs: [
    {
      id: "towa_courtyard",
      characterId: "sleepy_upperclassman",
      col: 8,
      row: 9,
      facing: "up",
      dialogueId: "towa_courtyard",
    },
    {
      id: "stray_thought_courtyard",
      characterId: "stray_thought",
      col: 4,
      row: 4,
      facing: "down",
      dialogueId: "",
      patrol: [
        { col: 4, row: 4 },
        { col: 4, row: 11 },
        { col: 6, row: 11 },
        { col: 6, row: 4 },
      ],
      encounterId: "stray_thought",
    },
  ],
  interactables: [
    {
      id: "courtyard_pond",
      kind: "sign",
      col: 11,
      row: 6,
      label: "The Pond",
      dialogueId: "courtyard_pond_flavor",
    },
    {
      id: "memory_star_courtyard",
      kind: "savePoint",
      col: 16,
      row: 9,
      label: "Memory Star",
    },
    {
      id: "beneath_the_surface",
      kind: "bossStage",
      col: 13,
      row: 6,
      label: "Reach Into the Pond",
      requiresFlag: "stray_thought_faced",
      encounterId: "stray_thought_boss",
    },
  ],
  exits: [
    {
      id: "to_arrival_hall",
      col: 12,
      row: 0,
      targetMapId: "arrivalHall",
      targetSpawn: { col: 12, row: 16 },
    },
    {
      id: "to_science_building",
      col: 21,
      row: 13,
      targetMapId: "scienceBuilding",
      targetSpawn: { col: 1, row: 6 },
    },
    {
      id: "to_dormitory",
      col: 12,
      row: 15,
      targetMapId: "dormitory",
      targetSpawn: { col: 8, row: 1 },
    },
    {
      id: "to_gaming_club",
      col: 0,
      row: 7,
      targetMapId: "gamingClub",
      targetSpawn: { col: 18, row: 6 },
    },
    {
      id: "to_theater_wing",
      col: 5,
      row: 0,
      targetMapId: "theaterWing",
      targetSpawn: { col: 12, row: 12 },
    },
  ],
  ambientNote:
    "The sky above the courtyard is always exactly the same shade of late afternoon, no matter what time it actually is.",
};
