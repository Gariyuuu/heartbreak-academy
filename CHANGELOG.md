# Changelog

All notable changes to HEART//BREAK ACADEMY are logged here.
Format loosely follows [Keep a Changelog](https://keepachangelog.com/) and
semantic versioning for a pre-1.0 project.

## [Unreleased]

### Known debt
- All visual assets are placeholder (DOM/SVG portraits, geometric Phaser
  sprites). Audio is fully real but procedurally synthesized end to end
  (SFX and 4 music tracks, 0.19.0) — no recorded instruments or mixed
  tracks exist.
- Accessibility settings are now all genuinely wired (`flashEffects` was
  the last dead one, fixed in 0.20.0, which also added the ability to
  pause mid-battle). Battle menus are now fully keyboard-navigable
  (0.21.0), matching the convention `DialogueBox` already used. Still
  open: keyboard remapping (keys are fixed, not rebindable), screen-reader
  semantics for the DOM UI layer, and contrast auditing.
- All 15 regions from the design doc now exist and are explorable, but
  content depth varies: the 9 regions built around named characters
  (Arrival Hall, Literature Wing, Courtyard, Gaming Club, Science Building,
  Dormitory, Theater Wing, Rooftop Gardens, Student Council Tower) have full
  dialogue arcs; the later 6 (Underground Maintenance, Abandoned Classroom
  Block, Mirror Hall, The Null Wing, Festival Grounds, The Infinite Library)
  are intentionally lighter — atmosphere and 1-2 encounters each rather than
  full character arcs, since the named cast from the design doc's example
  roster is now fully used.
- No new characters remain from the design doc's suggested cast to
  introduce; further named characters would need to be invented.
- 10 of the design doc's 8-12 bosses exist (0.18.0), including the "meta-
  timeline boss that recognizes repeated attempts" the design doc calls
  for by name. Any further bosses would need to be wholly new content —
  all 6 regular enemies already have a boss counterpart. The design doc's
  10+ endings target is met (10 exist, 0.17.0), visible in an Extras
  gallery tab (0.10.0), and New Game+ is wired (0.8.0). Real background
  music now exists (0.19.0, procedurally synthesized, same honesty policy
  as the SFX) with its own Extras gallery tab, closing out the last
  Extras-menu gap. Bestiary, Achievements, Endings, and Music are all
  functional with real content (~35 achievements, 10 endings, 4 tracks).
- Bundle is a single ~1.54MB chunk (Phaser is the bulk of it); code-splitting
  would help but wasn't a priority for this pass.

## [0.21.0] — Keyboard-Only Battle Menus, Layered Boss Music
Two more passes, one accessibility and one music.

**Keyboard navigation for battle menus.** The top-level FIGHT/ACT/ITEM/
GUARD/SPARE/FLEE grid and the ACT/ITEM submenu lists were plain
`<button>`s with `onClick` and nothing else — native Tab-focus technically
reached them, but none of the three matched the arrow-key + Z/Enter
convention `DialogueBox` already established elsewhere in the game (and
that the codebase's own architecture notes call out as the pattern to
follow: every input island owns its own keydown listener). New shared
`ui/battle/useKeyboardMenuNav.ts` hook — W/S or arrow keys cycle, Z/Enter
confirms, with an optional `columns` parameter for real 2D grid nav (the
top-level menu is 2 columns; A/D move across a row, W/S jump a full row).
Wired into `BattleHud.tsx`, `ActMenu.tsx`, and `ItemMenu.tsx`; each
submenu's "Back" option is just the last navigable index. Verified with
Playwright end to end with zero mouse clicks: Down/Up/Right through the
top grid lands on ACT, confirming opens the submenu, Down selects the
second ACT option, confirming plays it — the battle log shows the correct
response text.

**Layered boss music.** `game/audio/MusicManager.ts`'s `Track` type now
supports multiple simultaneous `layers` (each with its own waveform and
step pattern) instead of exactly one — every existing track still has
just one layer, but the `boss` track gets a second: a driving square-wave
bass pulse (straight quarter notes, A2/G2, an octave-plus below the
melody's root notes) underneath the existing sawtooth melody. This is the
difference between "a faster battle theme" and something that actually
reads as a boss fight. Verified by instrumenting `AudioContext.
createOscillator` again: a fresh boss encounter now produces both
`sawtooth` and `square` simultaneously (19 scheduled notes vs. the
previous single-layer track's 11 in the same window), and the Music tab
preview and all three other tracks are confirmed unaffected by the
refactor.

## [0.20.0] — Accessibility Fixes: Pause-During-Battle, Flash Effects
Two real gaps found by auditing every accessibility setting for an actual
consumer, not just a UI toggle and a stored value (the same "declared but
unused" pattern that's turned up all session — boss flags, timeline
fields, `musicVolume` — this time in the accessibility settings
themselves):

- **`flashEffects`** had a working checkbox in Settings and a default
  (`true`) since the vertical slice, but nothing in the codebase ever
  read it — there was no flash effect to gate in the first place.
  `BattleScene.ts` now triggers a brief camera flash (120ms, HEART-red)
  on taking a hit, alongside the existing `screenShake` trigger on the
  same event, gated by the setting. Turning it off now does something:
  disables the flash for photosensitivity, same as the setting's name
  always implied it should.
- **Pausing mid-battle was completely impossible.** `BattleScene.ts` read
  input every frame but never checked `cancelPressed` (X/Escape) at all —
  the key did nothing during a fight, bullets and the dodge-phase timer
  kept running no matter what. X/Escape now opens the pause menu during
  battle too (same as it already did in the overworld), and the whole
  update loop — bullet field, dodge timer, hit detection — freezes while
  paused.

Fixing the second one surfaced a real bug in the fix itself, caught by
Playwright rather than manual testing: resuming from pause immediately
re-paused every time. Cause: `PauseMenu`'s own `window` keydown listener
and `InputManager`'s separate keydown listener both react to the *same*
physical X keypress — the overlay closes synchronously, but
`InputManager`'s "just pressed" flag for that same key survives into the
next Phaser frame, which then saw `cancelPressed` still true and
immediately reopened the menu. Fixed with a one-frame
`wasPausedLastFrame` flag that consumes that stale flag instead of acting
on it. Verified with Playwright: pausing mid-dodge freezes player HP and
turn state exactly (confirmed unchanged across a 2.5s wait), resuming
correctly clears `menuOpen`, and the dodge phase completes normally
afterward rather than getting stuck.

Did not touch: whether Inventory/Save-Load/Return-to-Title make sense to
use mid-battle via the pause menu (they were already reachable that way
before this change, just via a menu you previously couldn't open during
battle) — that's a separate question from "can you pause," out of scope
for this pass.

## [0.19.0] — Real Music
`musicVolume` has had a working slider in Settings since the vertical
slice, controlling nothing — nothing ever read it. This closes that gap
the same way `AudioManager`'s SFX closed the silence gap: a real,
synthesized system rather than recorded tracks (still none available —
see "Placeholder Art Policy"), but genuinely audible, genuinely looping
music, not architecture standing in for silence.

New `game/audio/MusicManager.ts`: a small step-sequencer built directly on
WebAudio (no library) — a lookahead scheduler queues oscillator notes
~100ms at a time, each track defined as a short loop of
`{freq, beats}` steps at its own BPM/waveform. Four tracks: `title`
(sine, wistful, 68bpm), `overworld` (triangle, wandering, 98bpm),
`battle` (square, upbeat, 132bpm), `boss` (sawtooth, low and driving,
142bpm). All four route through one persistent master gain node whose
value is re-read from `masterVolume`/`musicVolume` on every scheduler
tick, so moving either slider changes the volume within ~100ms, not just
on the next track change. Handles the browser's autoplay-suspend policy
with a one-time click/keydown listener that resumes the AudioContext.

`App.tsx` picks the track centrally, off `phase` and (during battle) the
current enemy's `isBoss`, rather than scattering `play()` calls across
screen components — title/characterCreate/cutscene/ending all share the
title theme, overworld gets its own, and battle picks `battle` or `boss`
per encounter.

Also added the Extras menu's missing Music tab (the last unbuilt piece of
that menu) — a simple jukebox: click any of the 4 tracks to preview it,
and the previously-playing contextual track resumes automatically when
you leave the tab or close the menu, via `musicManager.getCurrentTrackId()`
captured on entry.

Verified with Playwright by instrumenting `AudioContext.prototype.
createOscillator` before the app loads and asserting on actual waveform
types scheduled (not just "no errors thrown"): title screen produces
`sine`, overworld `triangle`, a regular battle `square`, a fresh boss
battle `sawtooth`, previewing "Boss Battle" from the Music tab produces
`sawtooth` while overriding the title theme, and closing the tab reverts
to `sine`. One real bug caught mid-verification: triggering a second
battle encounter while the first was still unresolved left the boss
track never switching (stale `battleEnemyId`) — traced to the test script
chaining encounters incorrectly, not a game bug, but worth noting since
it's the same "verify the right thing is actually happening" class of
mistake as 0.12.0's near-miss.

## [0.18.0] — The Accumulation (the meta-timeline boss)
A 10th boss, and the first one built entirely on the meta-save rather
than anything scoped to a single playthrough — the design doc's "a
meta-timeline boss that recognizes repeated attempts" line, taken
literally. Reachable through a new "Go Through" interactable in the Null
Wing, gated behind `requiresTimelineFlag: "newGamePlusCount"` — a new
interactable-gating mechanism (`InteractablePlacement.requiresTimelineFlag`,
checked in `OverworldScene.ts` alongside the existing `requiresFlag`)
since this needed to read `store.timeline`, not per-save flags. It's
placed on a south-wall door tile the Null Wing's grid has had since the
region was first built (0.6.0) but never had a matching exit for — reused
rather than adding a new tile, same as the last several boss unlocks. The
edge sign's flavor text also changes once unlocked.

`EnemyDef.introLines` can now be a function of `GameStore`, not just a
static array (`battleStore.ts`'s `init` resolves it once per battle
start) — needed because this boss's opening lines read real numbers
straight out of `store.timeline`: how many times you've reset, how many
total deaths across every attempt, how many bosses you've ever resolved
cumulatively. Nothing about the specific numbers is scripted; they're
whatever your actual meta-save says.

`the_accumulation`: 50 HP, 2 phases (`echo_cascade`, then `echo_flood` —
each shot fires an identical delayed "echo" from a slightly offset
origin, escalating from one echo per burst to two), its own 4-step ACT
chain, `onResolved` → `recordBossOutcome`. Also the first boss to need a
genuinely new placeholder sprite shape (`"ring"`, concentric circles) since
all 12 existing `TokenShape` variants were already claimed — and while
touching that file, noticed and fixed a separate, previously-undiscovered
gap: Flicker, Reflection, and Kaede had color palette entries but no
`SHAPE_BY_CHARACTER` entry, so they'd been silently rendering as a generic
circle (not the "gray blob" `ENEMY_TOKEN_CHARACTER` bug from earlier
passes, which is a different lookup — this one still had the right color,
just the wrong shape) since each was added. Gave them real shapes now
(`star`/`diamond`/`leaf`, reused from other characters). New accessory
drop, `worn-coin` (+4 Max HP, +15ms FIGHT timing).

Verified end-to-end with Playwright: seeded a full meta-save
(`resets: 2`, `totalDeaths: 5`, 3 lifetime boss resolutions) before the
store booted, confirmed the intro log lines read those exact numbers back
correctly ("3 times now", "5 of those attempts", "resolved 3 of the
things"), then completed the real ACT chain and SPARE.

## [0.17.0] — Two Final Endings (10 total, meets the design doc's 10+)
Two more entries in `src/data/endings/registry.ts`, both placed at the
top of the priority list (checked first) since they're the rarest/most
specific conditions in the whole set:

- **SECOND DRAFT** — `timeline.newGamePlusCount >= 1`. The first ending
  that's only reachable via the New Game+ system (0.8.0) rather than
  anything trackable within a single save — closes the loop between the
  two systems: reaching an ending can lead to NG+, and NG+ has its own
  ending waiting on the other side.
- **THE ONE YOU KEPT COMING BACK TO** — one character's affection is
  ≥5 and at least 3 ahead of the next-highest. The first ending built from
  `relationships` data directly rather than route/flag state; deliberately
  doesn't name which character in its text (paragraphs are static strings,
  not per-character), so it stays true for whichever relationship the
  player actually invested in.

Also added `debugApi.setAffection(characterId, value)` (mirrors the
existing `setHp` delta-computation pattern) — added specifically because
verifying THE ONE YOU KEPT COMING BACK TO by chaining three real boss
battles through Playwright proved fragile (one ACT-chain step failed
silently partway through, leaving the battle scene stuck and the test
unable to find the ending trigger's dialogue afterward). Real content
should still get real end-to-end battle verification where that's the
thing being tested; for an ending condition that only cares about the
*resulting* relationship state, a direct debug setter is more reliable
than replaying full combat and is now a permanent, reusable tool for
future test scripts too.

10 of the design doc's 10+ endings now exist. Verified with Playwright:
a seeded `newGamePlusCount: 1` timeline (written before the store boots,
same trick 0.8.0's NG+ testing needed) resolves to SECOND DRAFT; seeded
affection (`akari: 7, mika: 2`) plus 2 boss-resolved flags (to clear THE
SHORT VERSION's low bar) resolves to THE ONE YOU KEPT COMING BACK TO.

## [0.16.0] — Two More Endings
Now that every boss counts toward something, engagement depth itself
becomes a real signal to end on — not just route leaning. Two new
entries in `src/data/endings/registry.ts`, both checked before the
route-based endings so they can actually intercept a matching save
(a 0-boss connection-route save would otherwise silently fall into
`kept_the_door_open`, which said nothing about how little combat content
the player actually saw):

- **THE WHOLE BUILDING** — every one of the 9 bosses resolved (spared or
  defeated, either counts), checked via a new
  `ALL_BOSS_RESOLVED_FLAGS` list of the 9 `*_resolved`/`*_challenge_resolved`
  flags each boss's `onResolved` already sets. A genuine completionist
  ending, placed first in priority since it's the rarest/most deliberate
  condition to satisfy.
- **THE SHORT VERSION** — 1 or fewer of the 9 bosses resolved. Catches
  minimal-engagement runs (including the literal freshest possible save)
  that were previously mislabeled by whichever route-leaning ending
  happened to match zero/zero route counters.

8 of the design doc's 10+ endings now exist. Verified with Playwright: a
fresh save resolves to THE SHORT VERSION (not KEPT THE DOOR OPEN, the old
default for an all-zero save); setting all 9 boss-resolved flags resolves
to THE WHOLE BUILDING. Also caught and fixed a real syntax bug during this
same pass — an unescaped double quote inside one of THE WHOLE BUILDING's
paragraph strings broke the build; `npm run build` caught it immediately,
which is exactly why every addition in this project runs through it
before being called done.

## [0.15.0] — Stray Equation Boss ("The Recurring Proof")
A 9th boss — one past the low end of the design doc's 8-12 range. Sixth
and last non-character boss, closing out the "upgrade an existing regular
enemy into a boss" approach that's carried the last five additions
(0.9.0-0.15.0): all six regular enemies now have a boss counterpart
(Reflection, Flicker, Runaway Metaphor, Stray Thought, Glitch Sprite,
Stray Equation, alongside Mika/Reina/Akari as the original three
character bosses).

Unlike the previous five, Science Building didn't have an existing piece
of throwaway flavor text to pay off, so this one is framed through Sora's
established characterization instead (she catalogues anomalies, per her
intro dialogue) — a new "Containment Board" interactable at her
workbench, gated behind `stray_equation_faced`, rather than a pre-existing
sign getting new meaning. `stray_equation_boss`: 40 HP, 2 phases
(`geometric_lasers`, reused, then a new `geometric_lasers_crossed`
pattern — a vertical and horizontal laser wall sweep simultaneously, each
with its own gap), its own 4-step ACT chain, `onResolved` →
`recordBossOutcome`, `ENEMY_TOKEN_CHARACTER` entry included from the
start. New accessory drop, `unproven-lemma` (+3 Max HP).

Verified end-to-end with Playwright, same discipline as the previous
five.

## [0.14.0] — Glitch Sprite Boss ("The Tenth-Place Entry")
An 8th boss — the low end of the design doc's 8-12 range is now met. Fifth
non-character boss, same shared-flag pattern: the regular Glitch Sprite
(Gaming Club) now sets `glitch_sprite_faced` on `onResolved`. Unlocked at
the Gaming Club's high score board via a new "Check the Tenth-Place Entry"
interactable, paying off the board's tenth-place note that's existed since
the region was built ("this one doesn't count, I was testing something").
The board's own text updates once the flag is set, same approach as the
last three boss unlocks.

`glitch_sprite_boss`: 40 HP, 2 phases (`arcade_chase`, reused, then a new
`arcade_swarm` pattern — two heart-seeking shots per interval instead of
one, fired faster), its own 4-step ACT chain, `onResolved` →
`recordBossOutcome`, `ENEMY_TOKEN_CHARACTER` entry included from the
start. New accessory drop, `tenth-place-token` (+20ms FIGHT timing, +2 Max
HP).

This was the fifth of six regular-enemy-to-boss upgrades in a row
(0.9.0-0.14.0) — Stray Equation was the one still missing at this point;
see 0.15.0 for the sixth and last one. Verified end-to-end with
Playwright, same discipline as the previous three.

## [0.13.0] — Stray Thought Boss ("The One That Didn't Drift Off")
A 7th boss, and the fourth non-character one — same shared-flag pattern as
the last three: the regular Stray Thought (Arrival Hall, Courtyard, and
the game's very first encounter) now sets `stray_thought_faced` on
`onResolved`. Unlocked at the Courtyard pond via a new "Reach Into the
Pond" interactable, which finally pays off flavor text that's existed
since the region was built: "something moves under the surface, unbothered
by you noticing." The pond sign's own text changes once the flag is set,
same approach as the last two boss unlocks.

`stray_thought_boss`: 38 HP, 2 phases (`stray_thought_wave`, reused, then
a new `stray_thought_flood` pattern — faster interval, ~40% of spawns now
drop in pairs), its own 4-step ACT chain that deliberately echoes the
regular enemy's "listen / reassure / let it approach" arc at a deeper
register, `onResolved` → `recordBossOutcome`, `ENEMY_TOKEN_CHARACTER`
entry included from the start. New accessory drop, `quiet-static` (+5 Max
HP).

Verified end-to-end with Playwright — teleported directly onto the new
interactable's tile this time rather than stepping in from an adjacent
one, after 0.12.0's near-miss with a same-shaped bug.

## [0.12.0] — Runaway Metaphor Boss ("Every Unfinished Sentence")
A 6th boss, and the third non-character one, following the same
shared-flag pattern as Reflection and Flicker: the regular Runaway
Metaphor enemy (Literature Wing, Infinite Library) now sets
`metaphor_faced` on `onResolved`, regardless of which region you meet it
in. That unlocks "Follow the Shelf Around the Corner" next to the Infinite
Library's existing "A Shelf Without an End" sign — content that's been
sitting there, unused, since the region was first built in 0.6.0 ("every
book on it is titled the same thing... isn't finished being written").
The sign's own flavor text now changes once the flag is set, same
approach as the breaker panel in 0.11.0.

`runaway_metaphor_boss`: 42 HP, 2 phases (`ink_scatter`, reused, then a
new `ink_flood` pattern — droplet bursts now fire from two origins across
the arena instead of one), its own 4-step ACT chain, `onResolved` →
`recordBossOutcome`, `ENEMY_TOKEN_CHARACTER` entry included from the
start. New accessory drop, `unfinished-bookmark` (+25ms FIGHT timing).

Verified end-to-end with Playwright — same discipline as the last two
boss additions, plus one real bug caught by the walk-in test itself: the
first test attempt teleported the player one tile short of the new
interactable, landing it closer to the pre-existing sign than the new
switch, so the "still locked" check silently passed against the wrong
interactable. Not a game bug — the map itself validated clean — but a
reminder that "the test passed" isn't the same as "the test exercised the
right target," which is exactly the class of mistake `validate-maps.mjs`
can't catch since it only checks structural reachability, not what a
player actually stands closest to.

## [0.11.0] — Flicker Boss ("Every Third Light")
A 5th boss, and the second (after Reflection) that isn't a named
character. Flicker is the recurring enemy that already appears in three
different regions (Underground Maintenance Level, Abandoned Classroom
Block, The Null Wing) — facing it anywhere, spared or defeated, now sets a
shared `flicker_faced` flag via its `onResolved`. That flag unlocks a new
interactable, "The Unlabeled Switch," next to the Underground Maintenance
breaker panel that's had "one unlabeled switch... worn smooth from a lot
of hands not quite deciding to flip it" as flavor text since the region
was first built — flipping it now actually does something. The existing
breaker-panel sign's own text also changes once the flag is set, rather
than staying static forever.

`flicker_boss`: 40 HP, 2 phases (`flicker_pulse`, reused, then a new
`flicker_cascade` pattern — the same irregular off-rhythm timing, but
roughly half the pulses now land in simultaneous pairs), its own 4-step
ACT chain, `onResolved` → `recordBossOutcome`, and an
`ENEMY_TOKEN_CHARACTER` entry added in the same commit as the enemy
itself. New accessory drop, `steady-bulb` (+4 Max HP).

Verified end-to-end with Playwright, same discipline as 0.9.0: the switch
refuses to trigger before `flicker_faced`, the full ACT chain enables
SPARE, and both the resolution flag and `timeline.bossesSparedEver` get
written correctly.

## [0.10.0] — Endings Gallery
The Extras menu (already had Bestiary and Achievements tabs) gets a third:
Endings. Lists all 6 entries from `src/data/endings/registry.ts`, reading
`timeline.endingsReached` — the same meta-save field 0.7.0 wired but never
displayed anywhere. Unreached endings show as "???" (same convention the
Bestiary already used for unmet enemies); reached ones show their title
and opening line. This is the CG/Ending-gallery half of the Extras menu's
remaining design-doc scope — the Music Player half is still unbuilt, since
there's no real music to browse yet (see "Placeholder Art Policy").

Verified with Playwright: shows 0/6, all "???", on a fresh save; shows
1/6 with the correct title revealed immediately after reaching an ending
and returning to the title screen.

## [0.9.0] — Reflection Boss ("The Whole Glass")
A 4th boss, in Mirror Hall — and the first one that isn't a named
character from the design doc's suggested cast. The regular Reflection
enemy already patrolling Mirror Hall now sets a `reflection_faced` flag on
`onResolved` (spared or defeated, either counts); a new "The Far Mirror"
`bossStage` interactable, gated behind that flag, opens a second, harder
confrontation: `reflection_boss`, 46 HP, 2 phases (`mirror_split`, reused
from the regular enemy, then a new `mirror_shatter` pattern — pairs firing
from all four sides at once, one side always left open so it stays
dodgeable), and its own 4-step ACT chain distinct from the regular
encounter's.

Same integration discipline as the other three bosses: `onResolved` calls
both `setFlag("reflection_boss_resolved", true)` and
`store.recordBossOutcome("reflection_boss", outcome)`, and
`BattleScene.ts`'s `ENEMY_TOKEN_CHARACTER` map got the
`reflection_boss: "reflection"` entry up front this time, rather than
being discovered missing after the fact (see the 0.6.0 "Fixed during QA"
entry for why that check is now a reflex). New accessory item,
`still-glass-shard` (+3 Max HP, +20ms FIGHT timing), as its unique drop.

Also corrects an arithmetic error from 0.6.0: that entry's "two new
bosses... four total" undercounted — the actual total at that point was
three (Mika, Reina, Akari). This is genuinely four.

Verified end-to-end with Playwright: the boss interactable refuses to
trigger before `reflection_faced` is set, the full ACT chain enables
SPARE correctly, and both the resolution flag and the timeline's
`bossesSparedEver` get written.

## [0.8.0] — New Game+
The `EndingScreen` now offers NEW GAME+ alongside RETURN TO TITLE. It calls
a new `startNewGamePlus` store action: a fresh save (same as New Game), but
`timeline.newGamePlusCount`/`resets` are bumped and persisted first, so the
meta-save that survives a normal reset now also tracks *purposeful* resets
distinctly.

The world visibly reacts to this, in two small, honest places rather than
a hidden counter nobody sees: the opening cutscene threads one extra line
("Except this time, some small, wordless part of you already knows which
hallway comes next.") right after the first line whenever
`newGamePlusCount > 0`, and the title screen shows "cycle N" under the
subtitle. Both read directly from the timeline, not from the fresh save,
which is the whole point of a meta-save existing separately from a normal
one. Verified end-to-end with Playwright: ending → NEW GAME+ → character
creation → the extra cutscene line appears → title screen shows "cycle 2"
after a full reload.

## [0.7.0] — Endings System
The run now actually ends. A new interactable ("??? Door", Arrival Hall,
gated behind `akari_confrontation_unlocked` — i.e. you have to have found
the Student Council Tower first) opens a short "are you ready to leave"
dialogue; confirming resolves one of 6 data-defined endings based on route
leaning, boss outcomes, relationship affection, and death count, then shows
a dedicated `EndingScreen` (title, mood-tinted color, closing paragraphs,
a spared/defeated/deaths summary) before returning to the title screen.

**New endings** (`src/data/endings/registry.ts`, checked most-specific
first): `full_bloom` (connection route + Akari resolved peacefully + high
affection + met the full new cast), `kept_the_door_open` (connection route,
general), `the_updated_record` / `what_the_record_says` (severance route,
split on whether you ever went through with Akari's challenge),
`the_edge` (secret — 3+ deaths and having met Kaede), and
`somewhere_in_between` as the always-matching fallback for a mixed route.
6 of the design doc's 10+ endings; the remaining slots are a data addition
away, not an engine change.

**Meta-save wiring**: `bossesDefeatedEver`/`bossesSparedEver`/
`endingsReached` in the timeline (`hba:timeline`, survives resets) were
declared in the save schema back in the original vertical slice but never
actually written to. New `recordBossOutcome`/`recordEnding` store actions
fix that — every boss's `onResolved` callback and the new ending flow now
populate them for real, which is what New Game+ will read from once it's
built.

Verified end-to-end with Playwright: gate correctly refuses interaction
before the unlock flag is set ("It's locked..."), the real flow opens the
door dialogue, resolves an ending, persists it to `localStorage`, and
returns cleanly to the title screen.

## [0.6.0] — All 15 Regions
The full region map from the design doc now exists and is fully connected
— every region reachable by walking through real doors, no dead links. Four
new named characters, two new bosses (three total with Mika), four new regular
enemies, and a second full puzzle type. Verified with an automated map
connectivity validator (below) in addition to the usual Playwright pass.

**New regions** (10, on top of the 5 that already existed): Courtyard (hub,
outdoor, a pond per the design doc's "fishing in the strange courtyard
pond" nod), Science Building (Sora Minase), Dormitory (Nana Fujimori),
Gaming Club (Mika's actual home turf), Theater Wing (Reina Tsukishiro +
boss), Rooftop Gardens (Kaede Shirakawa's first appearance), Student
Council Tower (Akari's boss), Underground Maintenance Level, Abandoned
Classroom Block, Mirror Hall, The Null Wing, Festival Grounds, The Infinite
Library (upgraded from a dead-end stub to a real maze region). Region
theming (`MAP_THEMES`) now has 10 distinct palettes.

**New characters**: Sora Minase (Science Club, fascinated by Memory Stars
as a physical phenomenon per her design-doc bio), Nana Fujimori (Art
Student, whose "painting description" dynamically reflects the player's
route — spare-heavy runs get warmer paintings, fight-heavy runs get
starker ones), Reina Tsukishiro (Drama Club, performs until asked not to),
Kaede Shirakawa (Transfer Student, appears in two different regions with
route/death-aware dialogue foreshadowing the meta-timeline concept from the
design doc, without a title-breaking exposition dump).

**New bosses**: Reina (2 phases — falling stage props, then hunting
spotlights once her composure visibly cracks) and Akari (2 phases — precise
"the rules say this should land" lasers, then a genuine loss-of-composure
radial burst once you get past her guard). Both, like Mika's boss, have a
FIGHT path and a distinct ACT/SPARE path that are framed as equally valid
outcomes, not "the good ending vs. the bad one."

**New regular enemies**: Stray Equation (science-themed, anxious about
being *wrong* rather than *unfinished* — a deliberate contrast with
Runaway Metaphor), Glitch Sprite (wants to be played *with*, not against),
Flicker (the first enemy that isn't warm or funny about what it wants —
quieter unease, tied to the accessibility flashing-effects setting
thematically if not literally), Reflection (the only enemy whose ACT
response lines are generated from the player's actual route stats at
battle time rather than fixed personality text).

**New puzzle-adjacent content**: a second full battle/route consequence
line (Nana's dynamic paintings) and Kaede's cross-region callback dialogue,
both examples of the "small decisions return much later" directive applied
somewhere other than the two puzzles.

### Fixed during QA
This pass added `scripts` (a standalone Node validator, not shipped in the
app) that loads every map data file and checks: row-length consistency,
whether every exit's trigger tile is itself walkable, whether every exit
targets a registered map, and whether every exit's destination spawn point
is walkable in the target map. It found four real, pre-existing bugs that
Playwright's sampled testing hadn't happened to exercise:
- **Dormitory's north exit was structurally unreachable.** The door-shaped
  row was placed one row *inside* the border instead of replacing the
  border row itself, so the "door" opened onto a solid wall with no path
  to the room north of it. This is the same class of mistake as the
  0.5.0 map-transition bug, just caught in data instead of at runtime —
  rebuilt with the door on the actual boundary row, plus a new east exit
  to Festival Grounds.
- **Both antechamber stubs' return exits were unreachable**, predating
  this session — `literatureWingStub` and the old `infiniteLibraryStub`
  both had a west-exit `col`/`row` pointing at a plain border tile with no
  `D` character ever placed there. Existing playtests always *entered*
  these rooms and moved *forward*, never tested walking back out, so it
  went uncaught since the original vertical slice. Both fixed; both stubs
  now have real doors in both directions.
- **Two new interactables/exits in this batch had the same off-by-one
  pattern** (Festival Grounds' return exit one row off from its door;
  an NPC and a patrol path landing on `infiniteLibrary`'s checkerboard
  shelf tiles). Caught and fixed by the same validator pass before ever
  reaching Playwright.
- **Boss battle tokens for Reina and Akari rendered as a generic gray
  circle** instead of their actual portraits — `BattleScene`'s
  `ENEMY_TOKEN_CHARACTER` map only had an entry for `mika_boss`, so
  `reina_boss`/`akari_boss` fell through to a texture lookup that doesn't
  exist. Purely cosmetic, but wrong on every boss fight until entries were
  added for both.

## [0.5.0] — Literature Wing
Second full region, built to the same "polished before moving on" standard
as Arrival Hall, plus a pass of real bugs found by actually driving the
built game with Playwright rather than trusting typecheck/build alone.

- **Literature Wing**: a proper region (not a stub) with its own visual
  identity — region theming is now a real system (`MAP_THEMES` in
  `engine/palette.ts`, selected per-map via `MapDefinition.theme`) rather
  than one hardcoded palette. Bookshelf-stack maze aisles, a reading nook,
  a save point, and a forward stub toward the (unbuilt) Infinite Library.
- **Yuna Kurosawa**, fully realized: a branching dialogue tree whose "story
  fragment" choice reads back something the player specifically did earlier
  (locker solved, an enemy spared) — small decisions surfacing later, per
  the design doc's core directive. Plus a returning Towa cameo for
  continuity/humor.
- **Runaway Metaphor**: a new regular enemy with an ink/loose-letters bullet
  pattern and an ACT chain thematically mirrored to Yuna's whole arc — SPARE
  here is about giving it permission to stay *unfinished*, not resolving it.
- **Poetry puzzle**: a second, differently-shaped puzzle (word choice, not a
  keypad) rewarding a new accessory (Library Card).
- New achievements, phone contact/messages, and quest entries for all of
  the above.

### Fixed during QA (found via an actual Playwright pass against the running app)
- **Map transitions silently teleported the player to the wrong spot.**
  `handleExits()`/debug map-change both set the new map + spawn position via
  `setPlayerMap()`, then called `scene.restart()` — but `OverworldScene`'s
  own `SHUTDOWN` handler unconditionally re-saved `this.player.x/y` (the
  *old* scene's stale live position) on the way out, clobbering the fresh
  spawn point moments later. Player would land far outside the new map's
  bounds, effectively invisible. Fixed with a `mapTransitionInProgress` flag
  that suppresses position auto-commits (both the shutdown one and the
  periodic 800ms one) whenever a transition is already underway.
- **`this.npcs` accumulated across scene restarts.** Phaser's `scene.restart()`
  reuses the same Scene instance rather than constructing a fresh one, so a
  `private npcs: NpcActor[] = []` field initializer only ran once, ever —
  every map transition appended that map's NPCs to the *previous* map's list
  instead of replacing it. Fixed by explicitly resetting scoped state at the
  top of `create()` instead of relying on field initializers.
- **The big one: dialogue/interaction silently stopped working after any
  map transition.** Phaser's `JustDown()` key-state tracking turned out to
  be unreliable specifically after `scene.restart()` — proven by isolating
  the failure with direct-state Playwright diagnostics: calling
  `dialogueEngine.advance()` directly always worked; the same key press
  routed through Phaser's polled `Key`/`JustDown` system did not, and never
  recovered without a full page reload. Root-caused and fixed by rewriting
  `InputManager` to track keys via raw DOM keydown/keyup listeners instead
  of Phaser's Key system — the same event-driven pattern already proven
  reliable everywhere else in this codebase (`FightBar`, dialogue advance,
  menu escape handling). Dialogue-advance and choice navigation were also
  moved fully into `DialogueBox` as their own DOM input island (removing
  the now-unused `dialogueBoxBridge` relay module), consistent with how
  `FightBar`/`LockerPuzzle` already owned their own input.
- **Accessory stat bonuses were declared but never applied.** `maxHpBonus`
  and `timingWindowBonusMs` existed on item data and were shown in item
  descriptions, but nothing ever read them — equipping Lucky Hairclip or
  Student Badge changed `accessoryId` and nothing else. Added
  `game/state/derived.ts` (`getEffectiveMaxHp`, `getEffectiveTimingWindowMs`)
  as the single place these are computed, and pointed every HP display,
  heal clamp, and the FIGHT timing bar at it instead of the raw base values.

## [0.4.0] — Vertical Slice
Playable end-to-end: Title → character creation → opening cutscene →
Arrival Hall → NPC dialogue → environmental puzzle → save point → wandering
enemy encounter → full FIGHT/ACT/ITEM/GUARD/SPARE/FLEE battle loop with
bullet-dodging → Mika's arcade mini-boss (2 phases) → death/retry →
Literature Wing stub. Verified by driving the actual build with Playwright
(title through a spared battle, HP loss, autosave, and a clean return to
the overworld) — not just typechecked.

- ACT system with per-enemy action lists and an emotional-state model
  (anger/trust/fear/embarrassment/confidence/curiosity) driving SPARE
  eligibility. Stray Thought requires actually listening before it can
  approach; Mika's boss requires trust + confidence built through banter.
- Inventory + equipment (weapon/accessory slots with real stat effects:
  weapon swaps change the FIGHT timing window, accessories add max HP or
  widen that window).
- Relationship store (Akari, Mika) with hidden affection/trust values
  surfaced only through dialogue and unlocked phone messages, never a raw
  number in the UI.
- Phone UI: Messages (contact-gated, flag-conditional threads, including a
  secret "???" contact that only appears after a death), Quests, Profiles.
- Route/consequence tracker (Connection / Mixed / Severance leaning)
  recording spare/defeat/flee/death counts and feeding NPC dialogue and the
  death screen's message.
- Mika's arcade mini-boss: two bullet-pattern phases (descending grid,
  bouncing balls), ACT-driven peaceful resolution distinct from the FIGHT
  path, both framed as genuinely good outcomes.
- Death/retry sequence (HEART fracture) with route- and death-count-aware
  messaging; Continue reloads the last autosave.
- Title screen, character creation (name/pronouns/hairstyle/uniform/
  colorway — colorway visibly tints the overworld sprite), opening
  cutscene, autosave on every map transition and battle entry.
- Settings: master/music/sfx volume (drives real procedural WebAudio SFX),
  text speed, screen shake, flashing-effects flag, larger-heart and
  bullet-speed-assist accessibility options (both wired into actual combat
  behavior, not just stored).
- Dev-only debug menu (F1): teleport to any NPC/interactable, full heal,
  give item, set flags, force an encounter, reset save. Also exposed on
  `window.__HBA_DEBUG__` for scripted testing; stripped from production via
  `import.meta.env.DEV` guards.

### Fixed during QA (found via an actual Playwright pass against the running app)
- **Scene-lifecycle crash**: Phaser's `game.destroy()` — which fires during
  React StrictMode's dev-only double-mount — emits scene `DESTROY`, not
  `SHUTDOWN`. Window-level event listeners (debug teleport/encounter,
  post-defeat continue) were only cleaned up on `SHUTDOWN`, so a discarded
  first scene instance's listener could survive and later crash
  (`Cannot read properties of null (reading 'queueOp')`) when it tried to
  drive an already-torn-down `ScenePlugin`. Fixed by cleaning up on both
  events and guarding every handler with `this.sys.isActive()`.
- **Stale dialogue bled into battle**: if a battle started while a dialogue
  box was still open (only reachable via the debug panel, since normal
  movement is blocked during dialogue), the dialogue box rendered on top of
  the battle HUD indefinitely. `BattleScene.create()` and
  `OverworldScene.create()` now force-clear dialogue/puzzle/menu UI state
  on entry regardless of how the transition happened.
- **ACT prerequisites could never unlock**: `requiresPriorActs` checked an
  `actsUsed` list that was only populated for acts flagged `oncePerBattle`
  — so any ACT chain requiring a *repeatable* act (e.g. Stray Thought's
  "Reassure it" requiring "Listen") could never actually become available.
  Every performed act is now recorded, independent of whether it stays
  visible after use.

## [0.3.0] — Combat Expansion
- Battle engine: turn state machine, arena/HEART renderer, bullet-pattern
  engine (falling-wave, grid, and wall-bounce pattern primitives).
- HEART states: NORMAL implemented; GRAVITY/SHIELD/DASH/RHYTHM/TETHER/
  GLITCH left as a documented extension point in `HeartController` for
  future bosses.
- FIGHT timing-bar minigame with weapon-modified windows.

## [0.2.0] — Arrival Hall
- Arrival Hall map: fully collidable, explorable, with a door leading to a
  Literature Wing stub (framed diegetically — the Academy "hasn't finished
  remembering" that wing yet — rather than a dead link).
- Akari Hoshino and Mika Amemiya introduced with unique portraits
  (SVG-based placeholder, distinct palettes/silhouettes) and opening
  dialogue that varies on repeat visits.
- First environmental puzzle: a locker combination clued by a noticeboard
  flyer, rewarding an accessory.
- Memory Star save point: heals, saves, shows an original introspective
  line pulled from a rotating pool (route/death-aware).

## [0.1.0] — Foundation
- Project scaffolded: Vite + React 19 + TypeScript + Phaser 3 + Zustand +
  Howler.
- Modular architecture established under `src/game`, `src/ui`, `src/data`.
- Versioned save schema + localStorage save manager (slots + autosave).
- Core engine: tile-based collision, camera-follow, directional player
  controller (WASD/arrows, Shift to run, Z/Enter interact, X/Esc menu).
- Dialogue engine: branching nodes, conditions, variable checks, choices,
  typing animation, portrait + expression system.
