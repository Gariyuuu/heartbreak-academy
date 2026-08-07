# HEART//BREAK ACADEMY

An original anime-psychological RPG: top-down exploration in an impossible
school called **THE AFTERCLASS**, with Undertale-style bullet-dodging
encounters built around an ACT/SPARE emotional-state combat system, wrapped
in a visual-novel dialogue layer. Colorful and funny on the surface;
gradually, deliberately unsettling underneath.

This is an original IP — no characters, dialogue, sprites, maps, or music
are copied from any existing game.

Current state: all **15 regions** from the design doc are built and
connected by real, walkable doors, the run now actually **ends** — 10
data-defined endings, picked up from a real in-world trigger — and
**New Game+** loops back from there — including its own ending, and its
own boss: a meta-timeline confrontation whose dialogue reads real numbers
out of your save history. Bosses sit at 10 of the spec's 8-12; endings
meet the 10+ target; real (procedurally synthesized) background music
with a layered bass under the boss track; battle menus are fully
keyboard-navigable; two real accessibility fixes (a dead flash-effects
setting, and no way to pause mid-battle); and a full presentation pass —
genuinely fullscreen (no letterboxing or dead space on any map/window
size), real head+torso humanoid sprites with hairstyle/uniform
customization that actually renders, textured map tiles instead of a flat
checkerboard, and faster dialogue. A broader accessibility pass (keyboard
remapping, screen-reader semantics, contrast auditing) is the one item
from the design doc's scope with no dedicated work yet (see
`DEVELOPMENT_PLAN.md` for full scope and what's still ahead, and
`CHANGELOG.md` for what's shipped so far, most recently `[0.22.0]`).

## Features

- All 15 regions from the design doc — Arrival Hall, Courtyard, Literature
  Wing, Science Building, Dormitory, Gaming Club, Theater Wing, Rooftop
  Gardens, Student Council Tower, Underground Maintenance Level, Abandoned
  Classroom Block, Mirror Hall, The Null Wing, Festival Grounds, and the
  Infinite Library — each with collision, camera-follow, and its own
  visual theme (12 distinct region palettes), fully connected by real,
  walkable doors (verified with `npm run validate:maps`, not just
  typechecked)
- Nine named characters (Akari, Mika, Yuna, Towa, Sora, Nana, Reina,
  Kaede, plus the player) with branching dialogue — portraits,
  expressions, and choices that vary on repeat visits and based on your
  play history, including lines that read back specific things you did
  earlier in the run
- Two environmental puzzle types (a locker keypad, a poetry word-choice
  puzzle)
- Memory Star save points across the world (heal, save, show a
  route-aware line)
- A full FIGHT / ACT / ITEM / GUARD / SPARE / FLEE battle system with a
  bullet-dodging HEART arena
- An emotional-state model (anger/trust/fear/embarrassment/confidence/
  curiosity) that gates SPARE per-enemy, not a universal button
- Ten bosses (Mika's arcade duel, Reina, Akari, Reflection, Flicker,
  Runaway Metaphor, Stray Thought, Glitch Sprite, Stray Equation, and The
  Accumulation), each multi-phase with a nonviolent resolution path
  distinct from — and equally valid to — winning outright. Six of them
  aren't named characters and are unlocked by facing their regular-enemy
  counterpart first (all six regular enemies have a boss version); The
  Accumulation is the design doc's "meta-timeline boss that recognizes
  repeated attempts," only reachable after a New Game+ cycle, with intro
  dialogue that reads real numbers out of your meta-save (total resets,
  deaths, bosses ever resolved) rather than static flavor text
- Six regular enemies (Stray Thought, Runaway Metaphor, Stray Equation,
  Glitch Sprite, Flicker, Reflection), each with a full ACT chain and
  spare condition, not just a health bar
- Inventory/equipment with real effects (weapons change FIGHT timing,
  accessories add HP or widen the timing window)
- A phone with contact-gated, flag-conditional messages, quests, and
  character profiles
- Route tracking (Connection / Mixed / Severance) that quietly feeds NPC
  dialogue and the death screen
- 10 endings, reached by finding a late-game trigger in the Arrival Hall
  (gated behind discovering the Student Council Tower) and resolved from
  route leaning, boss outcomes, engagement depth (a completionist ending
  for resolving all 9 bosses, another for barely engaging with any),
  relationship affection (an ending for one relationship pulling clearly
  ahead of the rest), death count, and New Game+ cycle count (an ending
  only reachable on a repeat playthrough) — see
  `src/data/endings/registry.ts`. A meta-save (`hba:timeline`, survives
  resets) records which endings and boss outcomes you've ever reached.
- New Game+ from the ending screen: a fresh save, with the meta-save
  quietly acknowledging you've been through it before (an extra opening-
  cutscene line, a "cycle N" label on the title screen)
- An Extras menu with a Bestiary, Achievements (~35), an Endings gallery,
  and a Music tab (preview any of the 4 background tracks) — each unmet
  enemy/unearned achievement/unreached ending shows as "???" until you
  actually get there
- Character creation (name, pronouns, hairstyle, uniform, colorway) that
  actually renders — a real head+torso sprite with your chosen hairstyle
  and uniform trim, not just a colorway tint on a plain circle
- Real background music (4 tracks — title, overworld, battle, boss — a
  WebAudio step-sequencer, not silence) and settings with real effects:
  volume sliders drive both music and procedural WebAudio SFX, plus text
  speed, screen shake, flashing-effects (a real camera flash on taking a
  hit, not a dead toggle), larger-heart, and bullet-speed-assist
  accessibility options
- X/Escape opens the pause menu during battle too, not just the
  overworld — freezes the dodge phase and bullets while paused
- Every battle menu (FIGHT/ACT/ITEM/GUARD/SPARE/FLEE, and both the ACT
  and ITEM submenus) is fully navigable by keyboard alone — W/S or arrow
  keys cycle, Z/Enter confirms, matching the same input-island convention
  dialogue already used
- A dev-only debug menu (`F1`) for teleporting, healing, giving items,
  setting flags, and forcing encounters

## Controls

| Action | Key |
|---|---|
| Move | WASD or Arrow Keys |
| Run | Shift (hold) |
| Interact / Confirm / Advance dialogue | Z or Enter |
| Cancel / Menu | X or Escape |
| Dialogue choice navigation | Up/Down (or click) |
| FIGHT timing swing | Space, Z, or Enter |
| Debug menu (dev builds only) | F1 |

Gamepad axes/buttons are read by `InputManager` but not yet fully mapped —
see the architecture note below.

## Tech Stack

- **Vite + React 19 + TypeScript** — app shell and all DOM-layer UI
  (dialogue, menus, phone, title screen, HUD)
- **Phaser 3** — overworld movement/collision/camera and the battle arena
  (bullet patterns, HEART control)
- **Zustand** — single source of truth game state, read/written directly by
  both Phaser scenes and React components
- **WebAudio** — audio; drives real procedural SFX and a 4-track music
  step-sequencer, both built directly on the Web Audio API (Howler is an
  installed dependency but unused — recorded tracks would be the natural
  place to introduce it, since none exist yet)
- **localStorage** — versioned JSON save schema, 3 manual slots + autosave

## Installation

```bash
npm install
```

## Development

```bash
npm run dev       # start the Vite dev server (http://localhost:5173)
npm run lint       # oxlint
npx tsc -b          # typecheck (also runs as part of `npm run build`)
npm run validate:maps  # check all map data files for connectivity bugs
```

## Production Build

```bash
npm run build      # tsc -b && vite build -> dist/
npm run preview     # serve the production build locally
```

## Deployment

The build output (`dist/`) is a static site — deploy it to Vercel,
Netlify, GitHub Pages, or any static host. No backend is required; saves
live entirely in the player's browser (`localStorage`). For Vercel:

```bash
vercel --prod
```

(Framework preset: Vite. No environment variables required.)

## Project Architecture

```
src/
  game/
    engine/       Player controller, input, camera/collision helpers,
                   tilemap rendering, placeholder sprite generation
    scenes/       OverworldScene, BattleScene (Phaser)
    maps/         Map runtime types + registry (loads data/maps/*)
    characters/   Runtime NPC actor (patrol/wander behavior)
    dialogue/     Dialogue engine (branching, conditions), DOM bridge
    combat/       Battle types, HEART controller
    bullets/      Bullet-pattern engine + pattern library
    audio/        Procedural SFX manager
    save/         Save schema, save manager, Memory Star logic
    state/        Zustand stores: game (persisted), battle (ephemeral),
                   ephemeral (cross-scene runtime), settings (persisted)
    debug/        Dev-only debug API (window.__HBA_DEBUG__)
  ui/
    components/   Phaser mount, overworld HUD, toast
    screens/      Title, character creation, cutscene, extras, game over
    battle/       Battle HUD, ACT/ITEM submenus, FIGHT timing bar
    dialogue/     DialogueBox, Portrait (SVG placeholder portraits)
    phone/        Phone shell (contacts/messages/quests/profiles)
    menu/         Pause hub, inventory, save/load, settings
    puzzle/       Locker combination puzzle
    debug/        F1 debug panel
  data/           Pure data: characters, enemies, items, quests, dialogue
                   trees, maps, achievements, phone messages, cutscenes
  assets/         sprites, portraits, tilesets, audio, effects (currently
                   placeholder — see "Placeholder Art Policy" below)
scripts/
  validate-maps.mjs  Standalone Node script (npm run validate:maps) that
                   loads every map data file and checks row-length
                   consistency, exit reachability, and exit target
                   validity — run this after touching any data/maps/*.ts
                   file
```

**State flow**: `game/state/store.ts` (`useGameStore`) is canonical for
anything that gets saved. Phaser scenes mutate it via its actions; React
reads it via hooks. Battle-specific state lives in a separate ephemeral
store (`battleStore.ts`) since it's never persisted. Phaser scenes and
React overlays coordinate scene transitions (e.g. entering/leaving battle)
through a small set of `window` `CustomEvent`s — see
`OverworldScene`/`BattleScene` for the pattern, and the "Fixed during QA"
section of `CHANGELOG.md` for why every one of those listeners is cleaned
up on both the Phaser `SHUTDOWN` and `DESTROY` events.

## Placeholder Art Policy

No image-generation tool was available while building this slice. Rather
than ship blank boxes:

- **Portraits** are SVG + CSS, built in the DOM (`ui/dialogue/Portrait.tsx`)
  — distinct palette and expression system per character, swappable 1:1
  for real art later.
- **Overworld/battle sprites** are Phaser-drawn geometry
  (`game/engine/PlaceholderSprites.ts`). The player and every named human
  NPC are a real head+torso humanoid with a hairstyle and uniform-trim
  variant, not a single flat shape; monsters/anomalies use a distinct
  abstract shape per character, which is correct for what they
  thematically are. **Map tiles** (`game/engine/TileRenderer.ts`) have
  real texture — grain, panel seams, beveled decor, an actual two-leaf
  door — instead of a flat 2-tone checkerboard.
- **Audio** is fully wired and genuinely real, not just architected: SFX
  are procedural WebAudio tones per event trigger, and background music is
  a small WebAudio step-sequencer (`game/audio/MusicManager.ts`, 4 tracks)
  — both gated by the volume sliders. Recorded instruments/tracks would
  slot into either manager later without changing anything that calls
  them.

## Content Creation

Everything gameplay-relevant is data, not hardcoded logic:

- **New map**: add a `MapDefinition` under `data/maps/`, register it in
  `game/maps/registry.ts`. Collision is an ASCII grid (`#`/`L`/`A` block,
  `.`/`D` walkable); NPCs, interactables, and exits are plain arrays of
  tile-coordinate placements. Run `npm run validate:maps` afterward — it
  catches door/exit placement bugs (an off-by-one row, a missing `D`
  character) that typecheck/build/lint won't.
- **New character**: add an entry to `data/characters/registry.ts`
  (name/bio/colorway) and a `DialogueTreeDef` under `data/dialogue/`.
- **New enemy/boss**: add an `EnemyDef` under `data/enemies/` — ACT list,
  emotional-effect functions, spare condition, and one or more phases each
  pointing at a bullet pattern id. New bullet patterns go in
  `game/bullets/patterns.ts` implementing the `BulletPattern` interface.
- **New item**: add an `ItemDef` to `data/items/registry.ts`.
- **New ending**: add an `EndingDef` to `data/endings/registry.ts` with a
  `matches(store)` predicate; place it before the catch-all fallback in
  priority order since the first match wins.

## Save Architecture

- `game/save/schema.ts` defines `GameSaveState` with a `SAVE_VERSION`. Bump
  the version and add a branch in `saveManager.ts`'s `migrate()` whenever
  the shape changes — never silently drop an old save.
- `saveManager.ts` handles 3 manual slots (`hba:save:0..2`) plus one
  autosave slot (`hba:save:auto`) in `localStorage`, all JSON, all
  independently corruption-checked (a bad JSON blob is logged and ignored,
  not thrown).
- A separate `TimelineState` (`hba:timeline`) persists across resets/new
  games — total deaths, endings reached, secrets found — the mechanism the
  design doc's "meta-save" concept uses to let the world quietly remember
  things a normal save wouldn't.
