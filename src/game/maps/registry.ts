import { arrivalHall } from "../../data/maps/arrivalHall";
import { literatureWingStub } from "../../data/maps/literatureWingStub";
import { literatureWing } from "../../data/maps/literatureWing";
import { infiniteLibraryStub } from "../../data/maps/infiniteLibraryStub";
import { courtyard } from "../../data/maps/courtyard";
import { scienceBuilding } from "../../data/maps/scienceBuilding";
import { dormitory } from "../../data/maps/dormitory";
import { gamingClub } from "../../data/maps/gamingClub";
import { theaterWing } from "../../data/maps/theaterWing";
import { rooftopGardens } from "../../data/maps/rooftopGardens";
import { studentCouncilTower } from "../../data/maps/studentCouncilTower";
import { undergroundMaintenance } from "../../data/maps/undergroundMaintenance";
import { abandonedClassroomBlock } from "../../data/maps/abandonedClassroomBlock";
import { mirrorHall } from "../../data/maps/mirrorHall";
import { nullWing } from "../../data/maps/nullWing";
import { festivalGrounds } from "../../data/maps/festivalGrounds";
import { infiniteLibrary } from "../../data/maps/infiniteLibrary";
import type { MapDefinition } from "./types";

export const MAP_REGISTRY: Record<string, MapDefinition> = {
  arrivalHall,
  literatureWingStub,
  literatureWing,
  infiniteLibraryStub,
  infiniteLibrary,
  courtyard,
  scienceBuilding,
  dormitory,
  gamingClub,
  theaterWing,
  rooftopGardens,
  studentCouncilTower,
  undergroundMaintenance,
  abandonedClassroomBlock,
  mirrorHall,
  nullWing,
  festivalGrounds,
};

export function getMap(id: string): MapDefinition {
  const map = MAP_REGISTRY[id];
  if (!map) throw new Error(`Unknown map id: ${id}`);
  return map;
}
