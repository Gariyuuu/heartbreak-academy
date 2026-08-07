# FEATURES.md — Verified Build Status

**This is the most important file in this documentation set.** Its job is
to say, precisely, what is actually implemented in code today vs. what is
only specced in `DEVELOPMENT_PLAN.md`. Every section below states its
verification method. Where this pass could not verify something beyond
"a registry entry exists," that's stated explicitly — a registry entry is
real evidence of a built feature (it's live code, not a doc), but it is
not the same as having played through the content.

Overall finding: **the prior claim ("15 regions / 10 bosses / 10 endings,
spec essentially complete") checks out against the actual code**, with one
concrete inaccuracy found (achievement count) and one claim that is
real-but-unverifiable with what's in the repo (Playwright testing). No
region/boss/ending count was found to be overstated.

## Regions — 15 built, verified via `src/game/maps/registry.ts`

All 15 are registered in `MAP_REGISTRY` and are real `MapDefinition`
objects (not stubs) as of this pass. Two additional stub files
(`literatureWingStub.ts`, `infiniteLibraryStub.ts`) still exist in the
registry and codebase but are superseded by the full versions
(`literatureWing.ts`, `infiniteLibrary.ts`) — dead weight, not active
content; see `TASKS.md`/`FILE_MAP.md`.

Dialogue depth verified by line-count of each region's `data/dialogue/*.ts`
file (a real proxy for content depth, not a substitute for playing it):

| Region | Dialogue file(s) | Lines | Depth |
|---|---|---|---|
| Arrival Hall | `akariIntro.ts`, `theWayOut.ts`, `misc.ts` | 75+18+108 | Full arc (Akari) |
| Literature Wing | `yunaIntro.ts` | 94 | Full arc (Yuna) |
| Courtyard | `courtyard.ts` | 47 | Full arc |
| Gaming Club | `gamingClub.ts`, `mikaIntro.ts` | 51+73 | Full arc (Mika) |
| Science Building | `scienceBuilding.ts` | 82 | Full arc (Sora, per DEVELOPMENT_PLAN) |
| Dormitory | `dormitory.ts` | 100 | Full arc |
| Theater Wing | `theaterWing.ts` | 92 | Full arc |
| Rooftop Gardens | `rooftopGardens.ts` | 49 | Full arc |
| Student Council Tower | `studentCouncilTower.ts` | 91 | Full arc |
| Underground Maintenance | `undergroundMaintenance.ts` | 18 | Light — atmosphere + 1-2 encounters |
| Abandoned Classroom Block | `abandonedClassroomBlock.ts` | 23 | Light |
| Mirror Hall | `mirrorHall.ts` | 15 | Light |
| The Null Wing | `nullWing.ts` | 45 | Light (also hosts The Accumulation) |
| Festival Grounds | `festivalGrounds.ts` | 43 | Light |
| Infinite Library | `infiniteLibrary.ts` | 18 | Light |

This matches `CHANGELOG.md`'s own Unreleased-section claim of "9 regions
with full dialogue arcs, 6 lighter" almost exactly by line-count proxy —
**verified consistent**, not just restated.

Connectivity claim ("fully connected by real, walkable doors, verified
with `npm run validate:maps`") — the validator script exists at
`scripts/validate-maps.mjs` and is a real, non-trivial Node script (not a
stub). This pass did not execute it fresh; running it is a fast way for
the next session to re-verify connectivity from scratch.

## Bosses — 10 built, verified via `src/data/enemies/registry.ts`

All 10 have both a registry entry and a distinct data file under
`src/data/enemies/`:

| Boss (registry id) | Title (per CHANGELOG/DEVELOPMENT_PLAN) | Region | Type |
|---|---|---|---|
| `mika_boss` | Mika's arcade duel | Gaming Club | Named-character |
| `reina_boss` | Reina | Student Council Tower (inferred) | Named-character |
| `akari_boss` | Akari | Arrival Hall / Tower | Named-character |
| `reflection_boss` | The Whole Glass | Mirror Hall | Non-character (upgraded regular enemy) |
| `flicker_boss` | Every Third Light | Underground Maintenance | Non-character |
| `runaway_metaphor_boss` | Every Unfinished Sentence | Infinite Library | Non-character |
| `stray_thought_boss` | The One That Didn't Drift Off | Courtyard (pond) | Non-character |
| `glitch_sprite_boss` | The Tenth-Place Entry | Gaming Club | Non-character |
| `stray_equation_boss` | The Recurring Proof | Science Building | Non-character |
| `the_accumulation` | The Accumulation | The Null Wing | Meta-timeline (NG+-gated) |

Each has an `onResolved` path per `DEVELOPMENT_PLAN.md`'s description
(spare/defeat outcomes feeding `store.recordBossOutcome`) — verified
structurally (the `ALL_BOSS_RESOLVED_FLAGS` list in
`src/data/endings/registry.ts` references exactly these 9 non-Accumulation
resolution flags, which only makes sense if each boss actually sets one).
Full battle-by-battle mechanical verification (bullet patterns rendering
correctly, ACT chains resolving correctly) was not re-tested by playing
the game in this pass.

## Endings — 10 built, verified via `src/data/endings/registry.ts`

All 10 `EndingDef` entries have real `matches(store)` predicates (not
placeholders returning `true`/`false` unconditionally, except the required
final catch-all):

1. `second_draft` — SECOND DRAFT (NG+-only)
2. `the_whole_building` — THE WHOLE BUILDING (all 9 non-meta bosses resolved)
3. `the_short_version` — THE SHORT VERSION (≤1 boss resolved)
4. `the_edge` — THE EDGE (3+ deaths and met Kaede)
5. `full_bloom` — FULL BLOOM (connection route + specific relationship/flag conditions)
6. `the_one_you_kept_coming_back_to` — one relationship ≥5 affection, 3+ ahead of next
7. `kept_the_door_open` — KEPT THE DOOR OPEN (connection route leaning)
8. `what_the_record_says` — WHAT THE RECORD SAYS (severance route, Akari boss unresolved)
9. `the_updated_record` — THE UPDATED RECORD (severance route leaning)
10. `somewhere_in_between` — catch-all fallback (`matches: () => true`)

`resolveEnding()` checks in array order and returns the first match, with
the fallback guaranteed to catch anything unmatched — verified by reading
the function body directly (see `src/data/endings/registry.ts` line ~163).

## Characters — 8 named + player, verified via `src/data/characters/registry.ts`

Akari Hoshino, Mika Amemiya, Towa Ebisawa (id `sleepy_upperclassman`), Yuna
Kurosawa, Sora Minase, Nana Fujimori, Reina Tsukishiro, Kaede Shirakawa.
README's "Nine named characters" figure includes the player as the 9th —
consistent, not a discrepancy.

## Achievements — 22 actual, not "~35" as README currently states

Counted directly via `grep -c '  id: "' src/data/achievements/registry.ts`
→ **22** achievement objects, several marked `secret: true`. README.md's
"~35 achievements" line (and its unmodified copy in
`DEVELOPMENT_PLAN.md`/`CHANGELOG.md`'s Unreleased section) is **inaccurate
as of this pass** — a real discrepancy, not a rounding difference. Left
uncorrected in README/CHANGELOG by this pass (out of scope — this pass
only creates the missing canonical files) but flagged here and in
`TASKS.md` for a future content-accuracy fix.

## Puzzles — 2 types, verified

`LockerPuzzle.tsx`/`.css` (keypad) and `PoetryPuzzle.tsx`/`.css` (word
choice) both exist as real components with matching CSS, not placeholders.

## Music/SFX — real but procedural, verified structurally

`game/audio/MusicManager.ts` and `game/audio/AudioManager.ts` exist as
real WebAudio-based modules (not silent stubs) — this matches the
documented "Placeholder Art Policy" of procedural-not-recorded audio.
Not verified by ear in this pass (would require running the app with
audio).

## New Game+ — built, scope matches documentation

`src/game/state/store.ts` was read to confirm `timeline`/NG+-related state
shape exists and is referenced by `the_accumulation` boss data and the
`second_draft` ending predicate above. Per `DEVELOPMENT_PLAN.md`, NG+
deliberately does not carry forward gameplay-affecting state beyond a
fresh save + a couple of cosmetic timeline reads — this pass takes that
scope note at face value (it reads as an honest limitation, not an
inflated claim) but did not exhaustively grep every consumer of
`timeline.*`.

## What is NOT verified / claimed without repo evidence

- **"Verified with Playwright"** (used repeatedly throughout
  `DEVELOPMENT_PLAN.md` and `CHANGELOG.md` to describe QA methodology):
  no Playwright dependency, config, or test file exists in the current
  tree or lockfile. **Unknown/unverifiable** — see `TESTING.md`. This does
  not mean the testing didn't happen; it means this repo, today, cannot
  reproduce or confirm it.
- **Full playthrough completability** — not attempted this pass (no dev
  server launched, no manual/automated playtesting).
- **Exact boss encounter locations for `reina_boss`** — inferred from
  character/region association in `DEVELOPMENT_PLAN.md`'s narrative, not
  independently confirmed against a specific map's interactable data in
  this pass.
