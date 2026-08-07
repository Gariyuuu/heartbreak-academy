export type TileChar = "#" | "." | "D" | "L" | "A";

export const BLOCKING_TILES: ReadonlySet<TileChar> = new Set(["#", "L", "A"]);

export interface TileCoord {
  col: number;
  row: number;
}

export interface NpcPlacement extends TileCoord {
  id: string;
  characterId: string;
  facing: "up" | "down" | "left" | "right";
  dialogueId: string;
  /** optional patrol path (tile coords); if present the NPC wanders and
   * touching it starts an encounter instead of dialogue */
  patrol?: TileCoord[];
  encounterId?: string;
}

export type InteractableKind = "noticeboard" | "puzzle" | "savePoint" | "bossStage" | "sign" | "door";

export interface InteractablePlacement extends TileCoord {
  id: string;
  kind: InteractableKind;
  label: string;
  dialogueId?: string;
  puzzleId?: string;
  requiresFlag?: string;
  /** gates on a truthy value in the meta-save (survives resets/New Game)
   * instead of the per-save flags — for content that should only unlock
   * once the timeline itself has something to show, e.g. newGamePlusCount */
  requiresTimelineFlag?: "resets" | "newGamePlusCount" | "totalDeaths";
  /** kind: "bossStage" only — which enemy/boss this trigger starts */
  encounterId?: string;
}

export interface ExitPlacement extends TileCoord {
  id: string;
  targetMapId: string;
  targetSpawn: TileCoord;
  locked?: boolean;
  lockedMessage?: string;
}

export interface MapDefinition {
  id: string;
  name: string;
  tileSize: number;
  grid: string[]; // rows of TileChar strings, all equal length
  spawn: TileCoord;
  npcs: NpcPlacement[];
  interactables: InteractablePlacement[];
  exits: ExitPlacement[];
  ambientNote?: string;
  /** region tile theme id (see game/engine/palette.ts MAP_THEMES); defaults to "academy" */
  theme?: string;
}

export function mapPixelSize(map: MapDefinition) {
  return {
    width: map.grid[0].length * map.tileSize,
    height: map.grid.length * map.tileSize,
  };
}

export function tileToPixel(coord: TileCoord, tileSize: number) {
  return {
    x: coord.col * tileSize + tileSize / 2,
    y: coord.row * tileSize + tileSize / 2,
  };
}
