# ARCHITECTURE.md

System design for HEART//BREAK ACADEMY. This restates and organizes what
`DEVELOPMENT_PLAN.md`'s "Architecture" section already documents in more
detail (read that too) — this file is the canonical-name entry point.

## Stack

- **Vite + React 19 + TypeScript** — app shell and all DOM-layer UI
  (dialogue box, menus, phone, title screen, HUD overlays).
- **Phaser 3** (`^3.90.0`) — overworld movement/collision/camera and the
  battle arena (bullet patterns, HEART control).
- **Zustand** (`^5.0.14`) — single source of truth game state, shared
  between Phaser scenes and React components directly (no prop drilling,
  no duplicated state).
- **Howler** (`^2.2.4`, declared dependency) + a hand-written WebAudio
  layer (`game/audio/AudioManager.ts`, `game/audio/MusicManager.ts`) —
  procedural SFX and a 4-track step-sequencer; no recorded audio files are
  loaded via Howler currently (see `FEATURES.md` for the placeholder-audio
  status).
- **localStorage** — the entire persistence layer; no backend, no network
  calls except loading the static build itself. See `DATABASE.md`.
- Deploy target: static build (`vite build` → `dist/`) → Vercel. See
  `DEPLOYMENT.md`.

## Why this split (as documented in DEVELOPMENT_PLAN.md)

Phaser owns pixel-perfect movement, collision, and the twitchy combat loop
because that needs a real render loop + fixed timestep. React owns
everything that is "UI on top of the game" (dialogue, menus, phone)
because DOM text rendering, accessibility, and layout are easier there
than in a canvas. Zustand is the bridge: Phaser scenes read/write the
store directly (no React reconciliation in the hot path); React components
subscribe to the same store for overlays. Neither layer owns state the
other needs to guess at.

## Directory map (see FILE_MAP.md for file-level annotation)

```
src/
  game/
    engine/       Player controller, DOM-driven InputManager, camera,
                  collision, tilemap + region theming, placeholder sprite
                  generator (PlaceholderSprites.ts)
    scenes/       OverworldScene, BattleScene (Phaser Scene subclasses)
    maps/         Map runtime types + registry (loads data/maps/* into
                  Phaser tilemaps)
    characters/   Runtime NPC actor class (NpcActor)
    dialogue/     DialogueEngine (branching, conditions, variables) —
                  DialogueBox in ui/ owns its own input, no relay
    combat/       Battle types, HeartController
    bullets/      Bullet-pattern engine (BulletField, Pattern) + pattern
                  library (patterns.ts)
    audio/        AudioManager (SFX), MusicManager (procedural music)
    save/         Save schema, saveManager (versioning/migration/slots/
                  autosave), memoryStar logic
    state/        Zustand stores: store.ts (persisted game state),
                  battleStore.ts (ephemeral battle state), ephemeral.ts
                  (cross-scene runtime), settingsStore.ts (persisted
                  settings), derived.ts (computed values — effective max
                  HP, effective FIGHT timing window, accounting for
                  equipment)
    debug/        Dev-only debug API (window.__HBA_DEBUG__, debugApi.ts)
  ui/
    components/   Phaser mount (PhaserGameContainer), overworld HUD, Toast
    screens/      Title, CharacterCreate, OpeningCutscene, Extras,
                  HowToPlay (uncommitted as of 2026-08-07, see
                  PROJECT_STATE.md), GameOver, Ending
    battle/       BattleHud, ActMenu/ItemMenu submenus, FightBar (timing
                  bar), useKeyboardMenuNav hook
    dialogue/     DialogueBox (own DOM input island), Portrait (SVG
                  placeholder portraits)
    menu/         PauseMenu hub, InventoryScreen, SaveScreen,
                  SettingsScreen, useMenuEscape hook
    phone/        PhoneScreen (contacts/messages/quests/profiles)
    puzzle/       LockerPuzzle (keypad), PoetryPuzzle (word choice)
    debug/        DebugPanel (F1)
  data/           Pure data modules: characters, enemies (incl. bosses),
                  items, quests, dialogue trees, maps (region layouts +
                  theming), achievements, phone messages, cutscenes
  assets/         Sprites/portraits/tilesets (currently minimal — most
                  visuals are procedurally drawn, not asset files)
scripts/
  validate-maps.mjs   Standalone Node script (npm run validate:maps).
                      Loads every map data file and checks row-length
                      consistency, exit reachability, and exit target
                      validity. Run after touching any data/maps/*.ts file
                      — this has caught real bugs that typecheck/build
                      missed (see CHANGELOG.md 0.6.0).
```

## State flow

`game/state/store.ts` is the canonical, persisted game-state store. Phaser
scenes mutate it via actions; React components read it via hooks. Save/load
serializes/deserializes this store's relevant slice plus a separate
`TimelineState` meta-save store (see `DATABASE.md`).

## Input handling (load-bearing design decision — see CLAUDE.md rule 4)

`InputManager` tracks keys via raw `window` keydown/keyup listeners, not
Phaser's `Key`/`JustDown` polling system. This was a deliberate fix, not
the original design: Phaser's key-state system was found to silently break
after every `scene.restart()` (i.e. after every map transition), root-
caused via Playwright diagnostics per `CHANGELOG.md`'s [0.5.0] entry. Every
input-handling UI island in this codebase (`DialogueBox`, `FightBar`,
`LockerPuzzle`/`PoetryPuzzle`, menu-escape handling, `useKeyboardMenuNav`)
owns its own keydown listener rather than relying on a Phaser scene to
relay key state — keep new input UI consistent with that pattern.

## Region theming

`game/engine/palette.ts` defines `MAP_THEMES`, a lookup of per-region color
palettes (28 theme entries as of this pass, more than the 15 shipped
regions — some are unused/reserved or shared). Each `MapDefinition` in
`data/maps/*.ts` selects a theme by key; `TileRenderer.ts` consumes it to
draw region-appropriate floor/wall/decor colors and texture rather than one
hardcoded look for the whole game.

## Extension points (from DEVELOPMENT_PLAN.md, verified structurally)

- New region = new `data/maps/*.ts` file + a `MAP_THEMES` entry if it needs
  its own palette, then `npm run validate:maps`.
- New character = new data file + portrait (Portrait.tsx expression logic)
  + dialogue tree registered in `data/dialogue/registry.ts`.
- New boss = new bullet pattern(s) in `game/bullets/patterns.ts` + phase
  data in an `EnemyDef` + a `store.recordBossOutcome(id, outcome)` call in
  its `onResolved` handler.
- New ending = a new `EndingDef` in `src/data/endings/registry.ts` with a
  `matches(store)` predicate, placed before the catch-all fallback
  (`somewhere_in_between`) in priority order — order matters, first match
  wins.
