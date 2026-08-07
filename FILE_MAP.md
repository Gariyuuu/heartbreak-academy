# FILE_MAP.md

Annotated guide to key files. See `ARCHITECTURE.md` for the full directory
tree and system design; this file is for "which specific file do I open
for X."

## Root

| File | What it is |
|---|---|
| `CLAUDE.md` | Operating manual — read first |
| `HANDOFF.md` | Onboarding for a fresh session — read second |
| `PROJECT_STATE.md` | Exact current stopping point |
| `DEVELOPMENT_PLAN.md` | Non-canonical but kept: phase-by-phase build log + architecture rationale (see `DECISIONS.md` for why it's kept) |
| `CHANGELOG.md` | Version-by-version feature history, [0.1.0]-[0.22.0]+Unreleased |
| `README.md` | Public-facing project overview |
| `package.json` | Scripts + dependencies — no test script exists (see `TESTING.md`) |
| `vite.config.ts` | Minimal Vite config, just `@vitejs/plugin-react` |
| `.oxlintrc.json` | Lint config — `react/rules-of-hooks: error` |
| `scripts/validate-maps.mjs` | Map-connectivity validator — run after any `data/maps/*.ts` change |

## Game logic (`src/game/`)

| File | What it is |
|---|---|
| `state/store.ts` | **Canonical persisted game state** (Zustand) — read/write via this, not local copies |
| `state/battleStore.ts` | Ephemeral battle-only state |
| `state/derived.ts` | **Read this for equipment-affected values** (effective max HP, effective FIGHT timing window) — see `CLAUDE.md` rule 5 |
| `state/settingsStore.ts` | Persisted user settings (volume, text speed, accessibility toggles) |
| `state/ephemeral.ts` | Cross-scene runtime state that shouldn't persist |
| `save/schema.ts` | `GameSaveState` + `TimelineState` type definitions, `SAVE_VERSION` |
| `save/saveManager.ts` | Read/write/migrate localStorage save slots + autosave + timeline |
| `save/memoryStar.ts` | Save-point (heal/save) interaction logic |
| `engine/InputManager.ts` | **DOM-driven keyboard input** — see `CLAUDE.md` rule 4, `DECISIONS.md` |
| `engine/PlayerController.ts` | Player movement/collision |
| `engine/TileRenderer.ts` | Draws region-themed map tiles (currently has uncommitted changes — see `PROJECT_STATE.md`) |
| `engine/PlaceholderSprites.ts` | Procedural humanoid/token sprite generation (placeholder art pipeline) |
| `engine/palette.ts` | `MAP_THEMES` — per-region color palette lookup |
| `scenes/OverworldScene.ts` | Phaser scene for exploration |
| `scenes/BattleScene.ts` | Phaser scene for combat (currently has uncommitted changes) |
| `dialogue/DialogueEngine.ts` | Branching dialogue tree runtime |
| `combat/HeartController.ts` | Player HEART (dodge target) control in battle |
| `bullets/BulletField.ts`, `bullets/patterns.ts` | Bullet-pattern engine + the actual pattern library (one entry per boss phase) |
| `debug/debugApi.ts` | `window.__HBA_DEBUG__` — includes `setAffection` for testing endings without full playthroughs |

## Data (`src/data/`) — the actual game content

| Path | What it is |
|---|---|
| `maps/*.ts` | **One file per region** — 15 real regions + 2 superseded stubs (`literatureWingStub.ts`, `infiniteLibraryStub.ts`). See `FEATURES.md` for the full region list with verified dialogue depth. |
| `maps/registry.ts` | `MAP_REGISTRY` — the source of truth for which maps are live |
| `enemies/*.ts` | One file per enemy, including all 10 bosses (files ending `Boss.ts`) |
| `enemies/registry.ts` | `ENEMY_REGISTRY` — source of truth for which enemies/bosses exist |
| `endings/registry.ts` | **All 10 endings** with their `matches(store)` predicates, checked in priority order |
| `characters/registry.ts` | The 8 named characters (Akari, Mika, Towa, Yuna, Sora, Nana, Reina, Kaede) |
| `dialogue/*.ts` | One file per region/character dialogue tree — line counts are a real proxy for content depth, see `FEATURES.md` |
| `achievements/registry.ts` | 22 achievements (README's "~35" is inaccurate — see `FEATURES.md`) |
| `items/registry.ts` | 16 items (weapons/accessories/consumables) |
| `quests/registry.ts` | 4 quests |
| `phone/messages.ts` | Route/flag-conditional phone messages |
| `cutscenes/opening.ts` | Opening cutscene script |

## UI (`src/ui/`)

| Path | What it is |
|---|---|
| `theme.css` | CSS custom properties for the whole UI theme — see `UI_SYSTEM.md` |
| `screens/HowToPlayScreen.tsx` | **Uncommitted, newest addition** — help overlay, see `PROJECT_STATE.md` |
| `screens/TitleScreen.tsx` | Title screen (currently has uncommitted changes) |
| `battle/useKeyboardMenuNav.ts` | Shared keyboard-nav hook for battle menus |
| `menu/useMenuEscape.ts` | Shared escape-key-closes-menu hook |
| `dialogue/DialogueBox.tsx` | Owns its own input — the reference pattern for input islands |

## What NOT to confuse

- `data/maps/literatureWingStub.ts` / `infiniteLibraryStub.ts` are dead
  (superseded) — don't edit them expecting it to affect the live game;
  `MAP_REGISTRY` still references them but the real entry points are
  `literatureWing.ts`/`infiniteLibrary.ts`.
- `DEVELOPMENT_PLAN.md` is not `ROADMAP.md` — the former is a historical
  phase log (mostly done), the latter (this pass's new file) is
  specifically forward-looking.
