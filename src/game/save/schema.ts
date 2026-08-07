// Versioned save schema. Bump SAVE_VERSION and add a migration in
// saveManager.ts whenever this shape changes — never silently break old saves.

export const SAVE_VERSION = 1;

export type Pronouns = "she/her" | "he/him" | "they/them";
export type Facing = "up" | "down" | "left" | "right";

export interface PlayerAppearance {
  hairstyle: string;
  uniformVariant: string;
  colorway: string;
}

export interface PlayerSaveState {
  name: string;
  pronouns: Pronouns;
  appearance: PlayerAppearance;
  hp: number;
  maxHp: number;
  level: number;
  exp: number;
  mapId: string;
  x: number;
  y: number;
  facing: Facing;
}

export interface InventorySaveState {
  items: Record<string, number>;
  weaponId: string | null;
  accessoryId: string | null;
}

export interface RelationshipSaveState {
  affection: number;
  trust: number;
  flags: Record<string, boolean>;
}

export type QuestStatus = "not_started" | "active" | "completed" | "failed";

export type RouteLeaning = "connection" | "mixed" | "severance";

export interface RouteSaveState {
  sparedCount: number;
  defeatedCount: number;
  fledCount: number;
  deaths: number;
  liesTold: number;
  promisesKept: number;
  promisesBroken: number;
  itemsStolen: number;
}

export interface GameSaveState {
  version: number;
  savedAt: number;
  playtimeSeconds: number;
  slot: number;
  player: PlayerSaveState;
  inventory: InventorySaveState;
  relationships: Record<string, RelationshipSaveState>;
  quests: Record<string, QuestStatus>;
  flags: Record<string, boolean | number | string>;
  visitedRooms: string[];
  route: RouteSaveState;
}

export function createDefaultSave(slot: number): GameSaveState {
  return {
    version: SAVE_VERSION,
    savedAt: Date.now(),
    playtimeSeconds: 0,
    slot,
    player: {
      name: "Student",
      pronouns: "they/them",
      appearance: {
        hairstyle: "short",
        uniformVariant: "standard",
        colorway: "crimson",
      },
      hp: 20,
      maxHp: 20,
      level: 1,
      exp: 0,
      mapId: "arrivalHall",
      x: 400,
      y: 528,
      facing: "down",
    },
    inventory: {
      items: { "cafeteria-bun": 2 },
      weaponId: "mechanical-pencil",
      accessoryId: null,
    },
    relationships: {
      akari: { affection: 0, trust: 0, flags: {} },
      mika: { affection: 0, trust: 0, flags: {} },
      yuna: { affection: 0, trust: 0, flags: {} },
      sora: { affection: 0, trust: 0, flags: {} },
      nana: { affection: 0, trust: 0, flags: {} },
      reina: { affection: 0, trust: 0, flags: {} },
    },
    quests: {},
    flags: {},
    visitedRooms: [],
    route: {
      sparedCount: 0,
      defeatedCount: 0,
      fledCount: 0,
      deaths: 0,
      liesTold: 0,
      promisesKept: 0,
      promisesBroken: 0,
      itemsStolen: 0,
    },
  };
}

// Meta-save: survives independently of any single save slot. This is how
// the world "remembers" things across resets/new games, simulated safely
// inside normal browser storage (never touches files outside the game).
export interface TimelineState {
  resets: number;
  newGamePlusCount: number;
  endingsReached: string[];
  bossesDefeatedEver: string[];
  bossesSparedEver: string[];
  secretsFound: string[];
  totalDeaths: number;
  firstPlayedAt: number;
}

export function createDefaultTimeline(): TimelineState {
  return {
    resets: 0,
    newGamePlusCount: 0,
    endingsReached: [],
    bossesDefeatedEver: [],
    bossesSparedEver: [],
    secretsFound: [],
    totalDeaths: 0,
    firstPlayedAt: Date.now(),
  };
}
