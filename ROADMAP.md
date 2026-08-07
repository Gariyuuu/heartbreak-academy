# ROADMAP.md

Forward-looking only. For what's already shipped, see `CHANGELOG.md` and
`FEATURES.md`. For the historical phase-by-phase plan (mostly complete),
see `DEVELOPMENT_PLAN.md`.

## Near-term (in progress right now, uncommitted)

- Finish/verify/commit the How-to-Play screen and related in-flight
  changes found uncommitted in the working tree during this documentation
  pass (see `PROJECT_STATE.md` and `TASKS.md`).

## Design-doc scope remaining (per DEVELOPMENT_PLAN.md's own honest "What's Next")

1. **Broader accessibility pass** — keyboard remapping (currently fixed
   keybindings, not rebindable), screen-reader semantics for the DOM UI
   layer, contrast auditing. Explicitly the one item from the original
   design doc's scope with no dedicated work yet.
2. **New Game+ depth** — currently a fresh save plus a few cosmetic
   timeline reads (opening cutscene line, title screen "cycle N" label,
   The Accumulation's intro dialogue). Does not yet carry forward any
   gameplay-affecting state (stat bonuses, dialogue branches gated on
   `bossesDefeatedEver`/`bossesSparedEver`). Natural next increment once
   it's clear what "remembering" should change about a fresh run.
3. **More minigames** — only 2 puzzle types exist (locker keypad, poetry
   word-choice). Not required by any stated target, just a possible
   expansion.
4. **Real art/audio** — swap procedural placeholders for real
   portraits/sprites/tiles/recorded music, per the documented Placeholder
   Art Policy. Architecturally designed to be a drop-in swap (see
   `ARCHITECTURE.md`) — not started.

## Explicitly NOT planned scope (per design doc, already met)

- More regions beyond 15 — not needed, target met.
- More bosses beyond 10 — the doc's 8-12 target is met; all 6 regular
  enemies already have boss counterparts and the named cast is fully
  used. Further bosses would need wholly new named characters (an
  invention, not a doc-driven addition).
- More endings beyond 10 — the doc's 10+ target is met.

## Housekeeping / accuracy debt (found by this documentation pass, not the design doc)

- `package.json` version field (`0.0.0`) never synced with
  `CHANGELOG.md` (`[0.22.0]`).
- README's achievement count ("~35") should be corrected to the actual
  count (22) — see `FEATURES.md`.
- Consider adding a real, committed Playwright setup so the project's own
  historical QA claims become reproducible again — see `TESTING.md`.
- `data/maps/literatureWingStub.ts` and `infiniteLibraryStub.ts` are dead
  code (superseded by the full versions) — candidates for deletion in a
  future cleanup pass, not touched by this documentation pass.
- Bundle is a single ~1.54MB chunk (Phaser dominates); code-splitting
  would help load time but wasn't prioritized (per `CHANGELOG.md`'s
  Unreleased notes).

## Not this project's job

Backend/multiplayer/accounts are explicitly out of scope — this is, and
is designed to remain, a fully client-side single-player static site (see
`ARCHITECTURE.md`, `DATABASE.md`).
