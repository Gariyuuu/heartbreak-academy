import type { MapDefinition } from "../../game/maps/types";

// A short antechamber between Literature Wing and the real Infinite
// Library, same pattern as the old Literature Wing stub: this one used to
// diegetically dead-end here too, before the Library beyond it existed.
const BORDER = "#".repeat(12);
const PLAIN = "#" + ".".repeat(10) + "#";
const DOOR_ROW = "D" + ".".repeat(10) + "D";

const grid: string[] = [BORDER, PLAIN, PLAIN, PLAIN, DOOR_ROW, PLAIN, PLAIN, BORDER];

export const infiniteLibraryStub: MapDefinition = {
  id: "infiniteLibraryStub",
  name: "The Threshold",
  tileSize: 32,
  theme: "library",
  grid,
  spawn: { col: 1, row: 4 },
  npcs: [],
  interactables: [
    {
      id: "infinite_shelves_sign",
      kind: "sign",
      col: 9,
      row: 3,
      label: "The Shelves Beyond",
      dialogueId: "infinite_library_sign",
    },
  ],
  exits: [
    {
      id: "back_to_literature_wing",
      col: 0,
      row: 4,
      targetMapId: "literatureWing",
      targetSpawn: { col: 26, row: 14 },
    },
    {
      id: "onward_to_infinite_library",
      col: 11,
      row: 4,
      targetMapId: "infiniteLibrary",
      targetSpawn: { col: 1, row: 6 },
    },
  ],
  ambientNote: "The shelves past this point finally decided on a shape. It just isn't a very reassuring one.",
};
