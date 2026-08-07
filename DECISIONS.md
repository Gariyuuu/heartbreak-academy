# DECISIONS.md

Dated architecture decision records. Entries marked **(inferred)** are
reconstructed from code/CHANGELOG evidence rather than an explicit
first-person design note — flagged as such rather than presented as if
directly stated by whoever made the call.

## 2026-08-07 (inferred, dated to CHANGELOG [0.5.0]) — DOM keydown listeners instead of Phaser's Key/JustDown system

**Decision**: `InputManager` tracks all keyboard input via raw `window`
keydown/keyup listeners, not Phaser's built-in `Key`/`JustDown` polling.
Every input-handling UI island (DialogueBox, FightBar, LockerPuzzle,
PoetryPuzzle, menu-escape, useKeyboardMenuNav) owns its own listener.

**Why**: Phaser's `JustDown()` state tracking was found to break silently
and permanently after any `scene.restart()` — which happens on every map
transition in this game. Root-caused via direct-state diagnostics
(calling `dialogueEngine.advance()` directly always worked; the same key
press routed through Phaser's system did not, and never recovered without
a full page reload). Documented in detail in `CHANGELOG.md`'s [0.5.0]
entry.

**Status**: Active, load-bearing. Restated as a hard rule in `CLAUDE.md`
rule 4 — do not reintroduce Phaser-polled input for new UI.

## 2026-08-07 (inferred, dated to CHANGELOG [0.5.0]) — `state/derived.ts` as the single source for equipment-affected values

**Decision**: Effective max HP and effective FIGHT timing window are
computed once in `game/state/derived.ts` (`getEffectiveMaxHp`,
`getEffectiveTimingWindowMs`) and every consumer (HP displays, heal
clamps, FightBar) reads from there instead of raw base fields.

**Why**: A real bug where equipped accessory bonuses (`maxHpBonus`,
`timingWindowBonusMs`) were declared on item data and shown in item
descriptions but never actually applied anywhere — equipping an item
changed `accessoryId` and nothing else.

**Status**: Active. Restated in `CLAUDE.md` rule 5.

## 2026-08-07 (inferred, dated to CHANGELOG [0.5.0] "Placeholder Art Policy") — Procedural/DOM placeholder art instead of blank boxes

**Decision**: No image-generation tool is available in the build
environment, so portraits are DOM/SVG (swappable per-`characterId` +
expression), overworld sprites/tiles are Phaser-drawn geometry
(`PlaceholderSprites.ts`, `TileRenderer.ts`), and audio is procedural
WebAudio (`AudioManager.ts`, `MusicManager.ts`) rather than recorded.

**Why**: Explicitly stated in `DEVELOPMENT_PLAN.md`: "Rather than ship
blank boxes... This is a legitimate placeholder pipeline, not a cop-out —
it's swappable 1:1 for real art later."

**Status**: Active, explicitly tracked as debt in `CHANGELOG.md`'s
Unreleased "Known debt" section. Real art/audio swap-in should never
require touching game logic per the stated design intent — not
independently verified by this pass beyond reading the intent.

## 2026-08-07 (inferred, dated to CHANGELOG [0.6.0]) — Map-connectivity validator as a lightweight substitute for full E2E testing of map data

**Decision**: `scripts/validate-maps.mjs`, a standalone Node script (no
browser, no Playwright) that checks row-length consistency, exit
reachability, and exit target validity across all `data/maps/*.ts` files.

**Why**: Region/door connectivity bugs ("door character placed on the
wrong row") are a real bug class in this codebase that's cheap to catch
statically without needing a full browser test pass.

**Status**: Active. Restated in `CLAUDE.md` rule 3 as a required
pre-trust step for map data changes.

## 2026-08-07 (inferred) — Non-character bosses built by "upgrading" existing regular enemies rather than inventing new named characters

**Decision**: 6 of the 10 bosses (Reflection, Flicker, Runaway Metaphor,
Stray Thought, Glitch Sprite, Stray Equation) are boss versions of
existing regular enemies, unlocked by a shared `*_faced` flag set when the
player encounters the regular version anywhere it appears, rather than
being tied to a new named character's dialogue arc.

**Why**: Per `DEVELOPMENT_PLAN.md` Phase 20: "closes out the
'upgrade an existing regular enemy' approach... The named cast from the
design doc's suggested roster... is now fully used" — i.e., this was the
chosen way to hit the design doc's 8-12 boss target after exhausting the
suggested named-character roster, reusing existing flavor text/hooks
rather than adding disconnected new content.

**Status**: Final for this pass — `DEVELOPMENT_PLAN.md`'s "What's Next"
section explicitly notes further characters would need to be invented,
not drawn from the original brief.

## 2026-08-07 — This documentation pass: `DEVELOPMENT_PLAN.md` kept in place, not folded into and deleted

**Decision**: `DEVELOPMENT_PLAN.md` is not one of the 17 canonical file
names, but its content (phase-by-phase build log, architecture rationale,
tech stack reasoning) is genuinely useful and not fully redundant with any
single canonical file — it's split across `ARCHITECTURE.md` (tech
stack/structure), `CHANGELOG.md` (version history it already
cross-references), `FEATURES.md` (build status), and `ROADMAP.md`
(what's next). Rather than delete it and lose that narrative, it's kept in
place and linked from `CLAUDE.md`/`ARCHITECTURE.md` as a supplementary
source.

**Why**: The task instruction was to "fold anything useful into the
correct canonical files, then leave it in place unless fully redundant."
It is not fully redundant — no single canonical file reproduces its
phase-by-phase narrative structure, and duplicating all of it verbatim
into multiple files would create a maintenance burden (two places to
update per future phase).

**Status**: Active decision for this pass. A future session could
reasonably choose to retire it once its content is fully absorbed and its
phase log is no longer actively maintained — that's a call for whoever is
doing the next major feature pass, not this documentation pass.
