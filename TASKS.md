# TASKS.md

Tracking for HEART//BREAK ACADEMY. Update this file (and `PROJECT_STATE.md`
and `SESSION_LOG.md`) before ending any session that changes code or docs.

## In progress (uncommitted in working tree as of 2026-08-07)

- [ ] **How-to-Play screen** — `src/ui/screens/HowToPlayScreen.tsx` +
      `.css` (untracked), wired into `App.tsx`. Appears functionally
      complete (covers movement, Memory Stars, the Phone/Quests tab) but
      is uncommitted and was still being actively edited by another
      process during this documentation pass. Verify it's finished, then
      commit, or check with the user if intent is unclear.
- [ ] Related uncommitted tweaks: `src/data/enemies/strayThought.ts`,
      `src/game/scenes/BattleScene.ts`, `src/game/state/store.ts`,
      `src/ui/menu/PauseMenu.tsx`, `src/ui/screens/TitleScreen.tsx`,
      `src/game/engine/TileRenderer.ts`. Not diffed/analyzed line-by-line
      by this pass — review before committing.

## Queued (from DEVELOPMENT_PLAN.md's "What's Next", not yet started)

- [ ] Broader accessibility pass: keyboard remapping (keys are currently
      fixed, not rebindable), screen-reader semantics for the DOM UI
      layer, contrast auditing.
- [ ] New Game+ carrying forward gameplay-affecting state (stat bonuses,
      dialogue branches gated on `bossesDefeatedEver`/`bossesSparedEver`)
      — currently NG+ only resets the save and lets a couple of UI spots
      read the timeline back cosmetically.
- [ ] Additional minigames beyond the two existing puzzle types (locker
      keypad, poetry word-choice).
- [ ] Real recorded audio (music/SFX are currently 100% procedural
      WebAudio synthesis — a deliberate, documented placeholder policy,
      not a bug).
- [ ] Real art assets (portraits are DOM/SVG, sprites/tiles are
      Phaser-drawn geometry — also a deliberate documented policy).
- [ ] Code-splitting — bundle is a single ~1.54MB chunk per
      `CHANGELOG.md`'s Unreleased notes, Phaser is most of it.

## Housekeeping (found during this documentation pass, not yet actioned)

- [ ] `package.json` version is still `0.0.0`; `CHANGELOG.md` is at
      `[0.22.0]`. Decide whether to sync it.
- [ ] README.md's achievement count ("~35") does not match the actual
      count in `src/data/achievements/registry.ts` (22). Corrected in
      `FEATURES.md`; consider fixing the README figure directly in a
      future content-accuracy pass.
- [ ] No test framework/config exists despite multiple "Verified with
      Playwright" claims in `DEVELOPMENT_PLAN.md`/`CHANGELOG.md`. Either
      add a real Playwright setup so the claim is reproducible, or soften
      the historical claims to note ad hoc/uncommitted verification. See
      `TESTING.md`.

## Completed (this documentation pass, 2026-08-07)

- [x] Audited actual file count vs the 17-file canonical doc standard (was
      2/17: `README.md`, `CHANGELOG.md`).
- [x] Read `DEVELOPMENT_PLAN.md` and cross-checked its region/boss/ending
      counts against real registry files in `src/data/` and
      `src/game/maps/`.
- [x] Verified live deploy responds (HTTP 200).
- [x] Scanned for committed secrets (none found).
- [x] Created the 15 missing canonical files (this list).

## Completed (per CHANGELOG.md / DEVELOPMENT_PLAN.md — game-development
history, not verified line-by-line by this pass beyond the spot-checks
in PROJECT_STATE.md)

See `CHANGELOG.md` for the full [0.1.0] through [0.22.0] history — 28
phases per `DEVELOPMENT_PLAN.md`, from core engine through the presentation
pass. Not re-listed here to avoid drift between two files; treat
`CHANGELOG.md` as canonical for shipped-feature history.
