import type { MapDefinition } from "../../game/maps/types";

// A short connecting corridor between Arrival Hall and the Literature Wing
// proper. Originally shipped as a diegetic dead end ("hasn't finished
// remembering itself yet") while only the Wing's antechamber existed —
// now that the real Wing is built, the corridor's sign gets to pay that
// joke off instead of just being deleted.
const BORDER = "#".repeat(12);
const PLAIN = "#" + ".".repeat(10) + "#";
const DOOR_ROW = "D" + ".".repeat(10) + "D";

const grid: string[] = [BORDER, PLAIN, PLAIN, PLAIN, DOOR_ROW, PLAIN, PLAIN, BORDER];

export const literatureWingStub: MapDefinition = {
  id: "literatureWingStub",
  name: "The Corridor",
  tileSize: 32,
  grid,
  spawn: { col: 1, row: 4 },
  npcs: [],
  interactables: [
    {
      id: "resolved_hallway",
      kind: "sign",
      col: 9,
      row: 3,
      label: "The Hallway Beyond",
      dialogueId: "resolved_wing_sign",
    },
  ],
  exits: [
    {
      id: "back_to_arrival",
      col: 0,
      row: 4,
      targetMapId: "arrivalHall",
      targetSpawn: { col: 24, row: 9 },
    },
    {
      id: "onward_to_literature_wing",
      col: 11,
      row: 4,
      targetMapId: "literatureWing",
      targetSpawn: { col: 2, row: 15 },
    },
  ],
  ambientNote: "The corridor knows where it's going now.",
};
