import type { DialogueTreeDef } from "../../game/dialogue/types";
import { akariIntro } from "./akariIntro";
import { mikaIntro } from "./mikaIntro";
import { yunaIntro } from "./yunaIntro";
import {
  clubScheduleFlavor,
  infiniteLibrarySign,
  noticeboardFlavor,
  resolvedWingSign,
  sleepyUpperclassmanIntro,
  towaLibrary,
} from "./misc";
import { courtyardPondFlavor, towaCourtyard } from "./courtyard";
import { soraIntro, gadgetShelfFlavor } from "./scienceBuilding";
import { nanaIntro, dormHallSignFlavor } from "./dormitory";
import { mikaClubroom, highScoreBoardFlavor } from "./gamingClub";
import { reinaIntro, programNoteFlavor } from "./theaterWing";
import { kaedeGlimpse, rooftopViewFlavor } from "./rooftopGardens";
import { akariTower, councilRulesFlavor } from "./studentCouncilTower";
import { breakerPanelFlavor } from "./undergroundMaintenance";
import { nameplateFlavor } from "./abandonedClassroomBlock";
import { mirrorHallSignFlavor } from "./mirrorHall";
import { kaedeNullWing, nullWingEdgeFlavor } from "./nullWing";
import { mikaFestival, soraFestival, festivalBoothFlavor } from "./festivalGrounds";
import { endlessShelfFlavor } from "./infiniteLibrary";
import { theWayOut } from "./theWayOut";

export const DIALOGUE_REGISTRY: Record<string, DialogueTreeDef> = {
  akari_intro: akariIntro,
  mika_intro: mikaIntro,
  yuna_intro: yunaIntro,
  sleepy_upperclassman_intro: sleepyUpperclassmanIntro,
  towa_library: towaLibrary,
  towa_courtyard: towaCourtyard,
  noticeboard_flavor: noticeboardFlavor,
  club_schedule_flavor: clubScheduleFlavor,
  resolved_wing_sign: resolvedWingSign,
  infinite_library_sign: infiniteLibrarySign,
  courtyard_pond_flavor: courtyardPondFlavor,
  sora_intro: soraIntro,
  gadget_shelf_flavor: gadgetShelfFlavor,
  nana_intro: nanaIntro,
  dorm_hall_sign_flavor: dormHallSignFlavor,
  mika_clubroom: mikaClubroom,
  high_score_board_flavor: highScoreBoardFlavor,
  reina_intro: reinaIntro,
  program_note_flavor: programNoteFlavor,
  kaede_glimpse: kaedeGlimpse,
  rooftop_view_flavor: rooftopViewFlavor,
  akari_tower: akariTower,
  council_rules_flavor: councilRulesFlavor,
  breaker_panel_flavor: breakerPanelFlavor,
  nameplate_flavor: nameplateFlavor,
  mirror_hall_sign_flavor: mirrorHallSignFlavor,
  kaede_null_wing: kaedeNullWing,
  null_wing_edge_flavor: nullWingEdgeFlavor,
  mika_festival: mikaFestival,
  sora_festival: soraFestival,
  festival_booth_flavor: festivalBoothFlavor,
  endless_shelf_flavor: endlessShelfFlavor,
  the_way_out: theWayOut,
};

export function getDialogueTree(id: string): DialogueTreeDef {
  const tree = DIALOGUE_REGISTRY[id];
  if (!tree) throw new Error(`Unknown dialogue tree: ${id}`);
  return tree;
}
