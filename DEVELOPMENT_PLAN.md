# HEART//BREAK ACADEMY — Development Plan

An original anime-psychological RPG. Top-down exploration + Undertale-style
bullet-dodging encounters with an ACT/SPARE emotional-state combat system,
wrapped in a visual-novel dialogue layer, set in an impossible school called
THE AFTERCLASS.

This is not a clone of any existing game's characters, maps, dialogue, or
assets — original IP only.

## Tech Stack

- **Vite + React 19 + TypeScript** — app shell, all DOM-layer UI (dialogue
  box, menus, phone, title screen, HUD overlays)
- **Phaser 3** — overworld movement/collision/camera and the battle arena
  (bullet patterns, HEART control)
- **Zustand** — single source of truth game state, shared between Phaser
  scenes and React components (no prop drilling, no duplicated state)
- **Howler / WebAudio** — audio engine; procedural WebAudio SFX are live
  today, music tracks still to be dropped into `assets/audio`
- **localStorage** — versioned JSON save schema, multiple slots + autosave
- Deploy target: static build → Vercel

## Why this stack

Phaser owns pixel-perfect movement, collision and the twitchy combat loop
(needs a real render loop + fixed timestep). React owns everything that is
"UI on top of the game" — dialogue, menus, phone — because DOM text
rendering, accessibility, and layout are all easier there than in a canvas.
Zustand is the bridge: Phaser scenes read/write the store directly (no
React reconciliation in the hot path), React components subscribe to the
same store for overlays. Neither layer owns state the other needs to guess
at.

## Placeholder Art Policy

No image-generation tool is available in this environment. Rather than ship
blank boxes:

- **Portraits** are built in the DOM (SVG + CSS) — distinct silhouette,
  palette, and simple facial geometry per character, with an expression
  system (swap eyes/mouth paths per emotion). This is a legitimate
  placeholder pipeline, not a cop-out — it's swappable 1:1 for real art
  later (`ui/dialogue/Portrait.tsx` takes a `characterId` + `expression`).
- **Overworld sprites** are Phaser-drawn geometry via
  `game/engine/PlaceholderSprites.ts`. As of the presentation pass
  (Phase 28) every human character — player included — is a real
  head+torso humanoid with a hairstyle and uniform-trim variant, not a
  single flat primitive; the player's hairstyle/uniform choices from
  character creation actually render now, which they never did before.
  Monsters/anomalies still use the abstract `TokenShape` system (correct
  for what they thematically are), just with more detail per shape than
  before. Map tiles (`game/engine/TileRenderer.ts`) got the same
  treatment: real floor grain instead of a flat 2-tone checkerboard,
  paneled walls, beveled decor, a real two-leaf door.
- **Audio** is fully real, procedurally: `game/audio/AudioManager.ts`
  plays WebAudio SFX (damage, heal, save, spare, etc.) and
  `game/audio/MusicManager.ts` runs a small WebAudio step-sequencer for 4
  looping background tracks (title/overworld/battle/boss), both gated by
  the volume sliders. Recorded audio (real instruments/mixed tracks)
  isn't in yet — either manager is where it would be wired in, without
  needing to touch the phase/battle logic that picks tracks.

This is tracked as explicit debt in `CHANGELOG.md` — swapping in real
portraits/sprites/audio should never require touching game logic.

## Architecture

```
src/
  game/
    engine/       Player controller, input (DOM-driven, see note below),
                  camera, collision, tilemap + region theming, placeholder
                  sprite generator
    scenes/       Overworld, Battle
    maps/         Map runtime (loads data/maps/* into Phaser tilemaps)
    characters/   Runtime character/actor classes (NPCs, party)
    dialogue/     Dialogue engine (branching, conditions, variables) —
                  DialogueBox in ui/ owns its own input, no relay needed
    combat/       Battle types, HEART controller
    bullets/      Bullet-pattern engine + pattern library
    items/        (data-driven, see data/items)
    audio/        Procedural SFX manager
    save/         Save schema, versioning, migration, slots, autosave,
                  Memory Star logic
    state/        Zustand stores: game (persisted), battle (ephemeral),
                  ephemeral (cross-scene), settings (persisted), plus
                  derived.ts for values computed from equipped items
                  (effective max HP, effective FIGHT timing window) —
                  read these, never the raw base fields, or equipment
                  bonuses silently stop applying
    debug/        Dev-only debug API (window.__HBA_DEBUG__)
  ui/
    components/   Phaser mount, overworld HUD, toast
    screens/      Title, CharacterCreate, Cutscene, Extras, GameOver
    battle/       Battle HUD, ACT/ITEM submenus, FIGHT timing bar
    dialogue/     DialogueBox (its own DOM input island), Portrait
    phone/        Phone shell (contacts/messages/quests/profiles)
    menu/         Pause hub, inventory, save/load, settings
    puzzle/       Locker keypad puzzle, poetry word-choice puzzle
    debug/        F1 debug panel
  data/           Pure data: characters, enemies, items, quests, dialogue
                  trees, maps, achievements, phone messages, cutscenes
  assets/         sprites, portraits, tilesets, audio, effects (placeholders)
scripts/
  validate-maps.mjs   Standalone Node script (npm run validate:maps) that
                      loads every map data file and checks row-length
                      consistency, exit reachability, and exit target
                      validity — catches the "door character placed on the
                      wrong row" bug class before it ever needs Playwright.
                      Run this after touching any data/maps/*.ts file.
```

State flow: **Zustand store (`game/state/store.ts`) is canonical.** Phaser
scenes mutate it via actions; React reads via hooks. Save/load
serializes/deserializes this store plus the separate timeline (meta-save)
store.

**Input is DOM-driven, not Phaser-polled.** `InputManager` tracks keys via
raw `window` keydown/keyup listeners rather than Phaser's `Key`/`JustDown`
system — that system proved unreliable specifically after
`scene.restart()` (i.e. after every map transition), silently dropping all
"just pressed" edges. See `CHANGELOG.md`'s 0.5.0 entry for the full
diagnosis. Every input island in this codebase (DialogueBox, FightBar,
LockerPuzzle/PoetryPuzzle, menu-escape handling) owns its own `keydown`
listener rather than relying on a Phaser scene to relay key state to it —
keep new input-handling UI consistent with that pattern.

## Phase Plan

Building vertically per the brief — each phase should leave the game in a
playable state, not a broken intermediate one.

- [x] **Phase 1** — Core engine: movement, collision, camera, interaction,
      dialogue engine + box, pause menu, save/load, one basic map
- [x] **Phase 2** — Arrival Hall complete: NPCs, save point, first puzzle,
      exploration loop
- [x] **Phase 3** — Battle engine: arena, HEART, bullet-pattern system
- [x] **Phase 4** — FIGHT / ACT / ITEM / GUARD / SPARE + emotional enemy
      state model
- [x] **Phase 5** — First mini-boss (Mika, gaming-club arcade duel)
- [x] **Phase 6** — Inventory / equipment / items
- [x] **Phase 7** — Relationships + Phone
- [x] **Phase 8** — Route/consequence tracking, death/retry, autosave
- [x] **Phase 9** — Title screen, character creation, opening cutscene,
      transition stub into Literature Wing
- [x] **Phase 10** — Literature Wing built out as a full second region
      (region theming system, Yuna fully realized, a second enemy, a
      second puzzle type); QA pass with real bugs found and fixed (see
      CHANGELOG 0.5.0) rather than just typechecked
- [x] **Phase 11** — All remaining 13 regions from the design doc built
      and connected by real, walkable doors (no dead links): Courtyard,
      Science Building, Dormitory, Gaming Club, Theater Wing, Rooftop
      Gardens, Student Council Tower, Underground Maintenance Level,
      Abandoned Classroom Block, Mirror Hall, The Null Wing, Festival
      Grounds, and a real Infinite Library (upgraded from its former
      dead-end stub). Four new named characters (Sora, Nana, Reina,
      Kaede), two new bosses (Reina, Akari — three total with Mika), four
      new regular enemies. See CHANGELOG
      0.6.0 for the full list and the bugs a new map-connectivity
      validator (`scripts/validate-maps.mjs`) caught along the way.
- [x] **Phase 12** — Endings system: a real end-of-run trigger (Arrival
      Hall, gated behind finding the Student Council Tower), 6 data-defined
      endings picked by route leaning / boss outcomes / affection / death
      count, a dedicated `EndingScreen`, and meta-save wiring so
      `bossesDefeatedEver`/`bossesSparedEver`/`endingsReached` — declared in
      the schema since the vertical slice but never actually written —
      finally get populated. See CHANGELOG 0.7.0.
- [x] **Phase 13** — New Game+: `startNewGamePlus` (fresh save, timeline
      `newGamePlusCount`/`resets` bumped and persisted first), reachable
      from the new `EndingScreen`'s NEW GAME+ button. The world reacts to
      it in two real spots that read the timeline directly — an extra
      opening-cutscene line and a "cycle N" label on the title screen — not
      a hidden counter. See CHANGELOG 0.8.0.
- [x] **Phase 14** — A 4th boss: Reflection ("The Whole Glass"), Mirror
      Hall. Unlocked by facing the existing regular Reflection enemy first
      (spared or defeated — either sets `reflection_faced`), rather than
      by a named-character dialogue arc — the game's first boss that isn't
      one of the design doc's suggested cast. 2 phases (`mirror_split` →
      the new `mirror_shatter` pattern), its own 4-step ACT chain, and the
      same `onResolved` → `recordBossOutcome` wiring as the other three.
      See CHANGELOG 0.9.0.
- [x] **Phase 15** — Endings gallery: a third Extras tab alongside Bestiary
      and Achievements, reading `timeline.endingsReached` (populated since
      Phase 12 but never displayed until now) to show which of the 6
      endings you've reached, "???" for the rest — same convention the
      Bestiary already used. See CHANGELOG 0.10.0.
- [x] **Phase 16** — A 5th boss: Flicker ("Every Third Light"), Underground
      Maintenance. Second non-character boss (after Reflection); unlocked
      by facing the recurring regular Flicker enemy anywhere it appears
      (3 regions share one `flicker_faced` flag). Reuses the region's
      existing "unlabeled switch" flavor text as the actual trigger rather
      than adding disconnected new content — the breaker-panel sign's text
      changes once the flag is set. New `flicker_cascade` phase-2 pattern.
      See CHANGELOG 0.11.0.
- [x] **Phase 17** — A 6th boss: Runaway Metaphor ("Every Unfinished
      Sentence"), Infinite Library. Third non-character boss; same
      shared-flag pattern as Reflection and Flicker (`metaphor_faced`, set
      from either region the regular enemy appears in). New `ink_flood`
      phase-2 pattern. See CHANGELOG 0.12.0.
- [x] **Phase 18** — A 7th boss: Stray Thought ("The One That Didn't Drift
      Off"), Courtyard pond. Fourth non-character boss, unlocked from the
      game's very first regular enemy (`stray_thought_faced`, shared
      across Arrival Hall and Courtyard). New `stray_thought_flood`
      phase-2 pattern. See CHANGELOG 0.13.0.
- [x] **Phase 19** — An 8th boss: Glitch Sprite ("The Tenth-Place Entry"),
      Gaming Club. Fifth non-character boss (`glitch_sprite_faced`). New
      `arcade_swarm` phase-2 pattern. Meets the low end of the design
      doc's 8-12 boss range. See CHANGELOG 0.14.0.
- [x] **Phase 20** — A 9th boss: Stray Equation ("The Recurring Proof"),
      Science Building. Sixth and last non-character boss
      (`stray_equation_faced`); closes out the "upgrade an existing
      regular enemy" approach — all 6 regular enemies now have a boss
      counterpart. Framed through Sora's characterization rather than a
      pre-existing flavor-text hook, since Science Building didn't have
      one. New `geometric_lasers_crossed` phase-2 pattern. See CHANGELOG
      0.15.0.
- [x] **Phase 21** — Two more endings: THE WHOLE BUILDING (all 9 bosses
      resolved — a real completionist ending) and THE SHORT VERSION (1 or
      fewer bosses resolved — catches minimal-engagement runs, including
      the literal freshest save, that were previously mislabeled by
      whichever route-leaning ending happened to match zero/zero route
      counters). Both checked before the route-based endings so they
      actually intercept. 8 of 10+ endings now exist. See CHANGELOG
      0.16.0.
- [x] **Phase 22** — Two final endings: SECOND DRAFT (`newGamePlusCount
      >= 1` — the first ending only reachable via New Game+, closing the
      loop between the two systems) and THE ONE YOU KEPT COMING BACK TO
      (one relationship's affection ≥5 and 3+ ahead of the next-highest —
      the first ending built from `relationships` data rather than
      route/flags). 10 of the design doc's 10+ endings now exist. Added
      `debugApi.setAffection` as a permanent testing tool along the way,
      after chaining real boss battles for verification proved fragile.
      See CHANGELOG 0.17.0.
- [x] **Phase 23** — The meta-timeline boss: The Accumulation, Null Wing.
      Built entirely on `store.timeline` rather than per-save state —
      gated behind a new `requiresTimelineFlag` interactable field
      (`newGamePlusCount`), and its intro lines are the first use of the
      newly-added dynamic `EnemyDef.introLines` (a function of `GameStore`
      instead of a static array), reading real reset/death/boss-resolved
      counts. Placed on a Null Wing south-wall door tile that's existed
      since 0.6.0 with no matching exit. New `echo_cascade`/`echo_flood`
      patterns, a new `"ring"` sprite shape (all 12 prior `TokenShape`
      variants were claimed), and a fix for Flicker/Reflection/Kaede
      silently rendering as generic circles (had palette colors, no
      shape). 10 of the design doc's 8-12 bosses now exist. See CHANGELOG
      0.18.0.
- [x] **Phase 24** — Real music: a WebAudio step-sequencer
      (`game/audio/MusicManager.ts`, no external library) with 4 tracks
      (title/overworld/battle/boss), picked centrally in `App.tsx` off
      `phase` + the current enemy's `isBoss`. Finally gives the
      `musicVolume` slider (present since the vertical slice) something to
      control, and closes out the Extras menu's last unbuilt piece with a
      Music tab (preview any track; the contextual track resumes when you
      leave). Verified by instrumenting `AudioContext.createOscillator`
      and asserting on real scheduled waveforms per phase/track. See
      CHANGELOG 0.19.0.
- [x] **Phase 25** — Accessibility audit: checked every setting in
      `settingsStore.ts` for an actual consumer, not just a UI toggle.
      Found and fixed two real gaps — `flashEffects` had no flash effect
      anywhere to gate (added one: a brief camera flash on taking a hit in
      battle, alongside the existing `screenShake`), and pausing during
      battle was completely impossible (`BattleScene.ts` never checked
      `cancelPressed` at all). Fixing the pause gap surfaced and fixed a
      real bug in the fix itself — resuming immediately re-paused, from
      `InputManager` and the pause overlay's own keydown listener both
      reacting to the same physical keypress — caught by Playwright, not
      manual testing. See CHANGELOG 0.20.0.
- [x] **Phase 26** — Keyboard-only battle menus: new
      `ui/battle/useKeyboardMenuNav.ts` hook (W/S or arrows cycle, Z/Enter
      confirms, optional `columns` for 2D grid nav), wired into the
      top-level battle menu grid and both ACT/ITEM submenus — previously
      mouse-only `<button onClick>`s, now matching `DialogueBox`'s
      established input-island convention. Verified with Playwright using
      zero mouse clicks end to end.
- [x] **Phase 27** — Layered boss music: `MusicManager.ts`'s `Track` type
      now supports multiple simultaneous `layers`; the `boss` track gained
      a driving square-wave bass pulse under its existing sawtooth melody.
      Verified both waveforms fire together and the other 3 tracks are
      unaffected. See CHANGELOG 0.21.0.
- [x] **Phase 28** — Presentation pass, direct from user feedback: dialogue
      reveal speed cut ~2.5-3x (it was tuned for much shorter lines than
      this game actually has); switched the canvas from a fixed 896x576
      (`Scale.FIT`) to `Scale.RESIZE` matching the real window, with
      `BattleScene`'s arena and `OverworldScene`'s camera zoom both made
      dynamic so nothing letterboxes or leaves dead space; real
      head+torso humanoid sprites for the player and every named NPC,
      with hairstyle/uniform choices from character creation actually
      rendering for the first time; real map tile texture (grain, panel
      seams, beveled decor, an actual two-leaf door) replacing the flat
      2-tone checkerboard. See CHANGELOG 0.22.0 for the full breakdown,
      including a real `fillGradientStyle` rendering bug caught by
      actually looking at a screenshot rather than trusting build/lint.
- [x] **Phase 29** — Onboarding + balance pass, direct from user feedback
      (stuck with no guidance, first monster too hard, wanted more
      detail): a new How to Play screen (title + pause menu), a one-time
      first-battle tutorial primer reusing 0.18.0's dynamic-`introLines`
      capability, Stray Thought's `attackDamage` softened 2→1, directional
      wall-adjacency shadows in `TileRenderer.ts`, and a uniform glossy
      highlight on every monster shape. Also fixed a real pre-existing
      bug this surfaced: `BattleScene`'s mid-battle pause freeze
      (0.20.0) only matched `menuOpen === "pause"`, so opening Inventory/
      Phone/Save/Settings mid-fight (all reachable from the pause hub)
      silently let the dodge phase keep running behind them since 0.20.0
      shipped. See CHANGELOG 0.23.0.
- [x] **Phase 30** — More character customization (2 more hairstyles —
      `ponytail`, `bangs` — 1 more uniform variant — `open-collar` — and 3
      more colorways — gold/rose/slate, chosen to stay visually distinct
      from the existing four), and side story part four: a fourth Towa
      nap spot in the Abandoned Classroom Block, placed next to the
      room's existing nameplate mystery, with a new secret achievement
      for finding all four. See CHANGELOG 0.24.0.
- [ ] **Phase 31+** — A broader accessibility pass beyond what's fixed so
      far (keyboard remapping — keys are fixed, not rebindable —
      screen-reader semantics for the DOM UI layer, contrast auditing) —
      not started (see "What's Next" below)

## What Ships in This Pass

Full 15-region world, fully connected and walkable. Title screen →
name/appearance → opening cutscene → any of the 15 regions, reachable from
Arrival Hall via Courtyard as the central hub. Nine named characters
(Akari, Mika, Yuna, Towa, Sora, Nana, Reina, Kaede) with dialogue that
varies by route/flags/repeat visits. Ten full bosses (Mika, Reina, Akari,
Reflection, Flicker, Runaway Metaphor, Stray Thought, Glitch Sprite,
Stray Equation, The Accumulation), six regular enemies, two puzzle types,
a save/autosave system, inventory/equipment with real stat effects, a
phone with route-reactive messages, an endings system (10 endings, with a
gallery tab in Extras), real procedural music (4 tracks, with a preview
tab in Extras), a mid-battle pause that correctly freezes for every menu
reachable from it, New Game+, a genuinely fullscreen presentation with
real humanoid sprites and textured/shadowed maps, a How to Play screen
and first-battle tutorial primer, and a route/consequence tracker that
quietly feeds dialogue throughout. Verified end-to-end with Playwright
plus a from-scratch map-connectivity validator, not just typechecked.

## What's Next (honest scope note)

The full design doc's remaining checklist is short now. 8-12 bosses: 10
exist (past the low end, all 6 regular enemies upgraded plus the
meta-timeline boss the doc calls for by name — see Phase 20/23). 10+
endings: met (10 exist — see `src/data/endings/registry.ts`). Music
Player: built (Phase 24), procedural rather than recorded — see
"Placeholder Art Policy" — the boss track picked up a second bass layer
in Phase 27. Accessibility: audited every setting for a real consumer and
fixed the two that had none, plus made all three battle menus fully
keyboard-navigable (Phases 25-26) — a broader pass (keyboard remapping,
screen-reader semantics, contrast auditing) is still open. New Game+ is
built (Phase 13) but stays
deliberately light: a fresh save plus a few places that read the timeline
back (the opening cutscene, the title screen, and now The Accumulation's
intro dialogue). It does not yet carry forward any gameplay-affecting
state (stat bonuses, unlocked dialogue branches
tied to `bossesDefeatedEver`/`bossesSparedEver`) — that's the natural next
increment on top of the same timeline data, once it's clear what
"remembering" should actually change about a fresh run rather than just
acknowledge it happened. Minigames beyond the two existing puzzle types
are also still unbuilt. The named cast from the design doc's suggested
roster (Akari, Mika, Yuna, Reina, Sora, Nana, Kaede) is now fully used;
further characters would need to be invented rather than drawn from the
brief. The engine/data architecture is designed so all of the above is a
**data addition**, not an engine rewrite: new region = new map data file +
a `MAP_THEMES` entry if it needs its own palette (then run
`npm run validate:maps` before testing it); new character = new data file
+ portraits + dialogue tree; new boss = new bullet patterns + phase data +
a `store.recordBossOutcome(id, outcome)` call in its `onResolved`; new
ending = a new `EndingDef` in `src/data/endings/registry.ts` with a
`matches(store)` predicate, placed before the catch-all fallback in
priority order. Keep the same discipline used for every region so far:
typecheck/build/lint passing is necessary but not sufficient — several
real interaction and connectivity bugs in this project have only ever
surfaced by actually driving the running app or running the map
validator, never by typechecking alone.
