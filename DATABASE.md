# DATABASE.md

## There is no database

HEART//BREAK ACADEMY is a fully client-side static site. There is no
backend, no API server, no SQL/NoSQL database, and no network persistence
of any kind — verified by the absence of any server code, ORM, DB client
library, or `DATABASE_URL`-style env var anywhere in `package.json`,
`package-lock.json`, or the source tree. All state persists in the
player's browser via `localStorage` only.

## Data model — persistence layer

Defined in `src/game/save/schema.ts`. Two independent structures:

### `GameSaveState` (per-slot save)

- `version`, `savedAt`, `playtimeSeconds`, `slot`
- `player`: name, pronouns, appearance (hairstyle/uniformVariant/colorway),
  hp/maxHp/level/exp, current `mapId` + x/y/facing
- `inventory`: `items` (id → count map), `weaponId`, `accessoryId`
- `relationships`: per-character `{ affection, trust, flags }` — default
  save seeds 6 relationship entries (akari, mika, yuna, sora, nana, reina)
- `quests`: id → `QuestStatus` ("not_started" | "active" | "completed" |
  "failed")
- `flags`: free-form `Record<string, boolean | number | string>` — the
  general-purpose world-state bag (boss-resolved flags, met-NPC flags,
  puzzle-solved flags, etc.)
- `visitedRooms`: string array
- `route`: `RouteSaveState` — sparedCount/defeatedCount/fledCount/deaths/
  liesTold/promisesKept/promisesBroken/itemsStolen — feeds
  `routeLeaning()` (connection/mixed/severance) which several endings key
  off of

### `TimelineState` (meta-save, survives resets/new games)

- `resets`, `newGamePlusCount`, `endingsReached[]`,
  `bossesDefeatedEver[]`, `bossesSparedEver[]`, `secretsFound[]`,
  `totalDeaths`, `firstPlayedAt`
- This is the mechanism behind "the world remembers things across
  resets" — e.g. The Accumulation boss reads real numbers from this
  object rather than static flavor text (verified in
  `src/data/enemies/theAccumulationBoss.ts` referencing timeline fields,
  per `FEATURES.md`).

## Storage keys (`src/game/save/saveManager.ts`)

- `hba:save:0`, `hba:save:1`, `hba:save:2` — 3 manual save slots
  (`SAVE_SLOT_COUNT = 3`)
- `hba:save:auto` — autosave slot
- `hba:timeline` — the meta-save described above

All reads go through `safeParse()`, which catches JSON parse errors and
logs+ignores a corrupted slot rather than throwing — verified by reading
`saveManager.ts` directly.

## Versioning / migration

`SAVE_VERSION = 1` (current). `saveManager.ts`'s `migrate()` function is
the designated place to add version-branch upgrade logic — currently a
no-op comment ("No migrations needed yet") since the schema has never
changed version. **Rule for future sessions** (also in `CLAUDE.md`): any
change to `GameSaveState`'s shape must bump `SAVE_VERSION` and add a real
migration branch here, never silently drop or break an existing save.

## No PII, no secrets in save data

Save data is a player-chosen display name, pronouns, and gameplay state —
no email, no auth token, no real-world identity data. Nothing here needs
encryption or server-side handling. See `SECURITY.md`.
