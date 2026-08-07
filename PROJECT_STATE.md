# PROJECT_STATE.md

Last updated: 2026-08-07, by a documentation/transfer-checkpoint pass (this
session did not write game code — see "Note on concurrent activity" below).

## Snapshot

- **Repo**: `~/Projects/heartbreak-academy`, git remote
  `https://github.com/Gariyuuu/heartbreak-academy.git` (origin), branch
  `main`, up to date with `origin/main` as of this pass.
- **Commits**: 2 total on `main` — `95b621c` (Initial commit: v0.21.0) and
  `8154d9f` (Presentation pass: v0.22.0). See `SESSION_LOG.md` for detail.
- **Live deploy**: https://heartbreak-academy.vercel.app — verified
  returning HTTP 200 via `curl` on 2026-08-07. See `DEPLOYMENT.md` for what
  is and isn't verifiable about the deploy pipeline itself.
- **Package version**: `package.json` still reads `"version": "0.0.0"`
  (never bumped) even though `CHANGELOG.md` is at `[0.22.0]` / Unreleased.
  This is a real, pre-existing inconsistency — not fixed by this pass,
  since it's a code file, not documentation. Flagged in `DECISIONS.md`.

## What's actually built (verified in code, 2026-08-07)

- **15 regions** — confirmed via `src/game/maps/registry.ts`: 15 real
  region maps (`arrivalHall`, `literatureWing`, `infiniteLibrary`,
  `courtyard`, `scienceBuilding`, `dormitory`, `gamingClub`, `theaterWing`,
  `rooftopGardens`, `studentCouncilTower`, `undergroundMaintenance`,
  `abandonedClassroomBlock`, `mirrorHall`, `nullWing`, `festivalGrounds`)
  plus 2 superseded stub files (`literatureWingStub`,
  `infiniteLibraryStub`) still present but no longer the live entry point.
- **10 bosses** — confirmed via `src/data/enemies/registry.ts`: `mika_boss`,
  `reina_boss`, `akari_boss`, `reflection_boss`, `flicker_boss`,
  `runaway_metaphor_boss`, `stray_thought_boss`, `glitch_sprite_boss`,
  `stray_equation_boss`, `the_accumulation`.
- **10 endings** — confirmed via `src/data/endings/registry.ts` (10
  `EndingDef` entries with real `matches()` predicates).
- **8 named characters + player** — confirmed via
  `src/data/characters/registry.ts`: Akari, Mika, Towa (id
  `sleepy_upperclassman`), Yuna, Sora, Nana, Reina, Kaede.
- **22 achievements** — confirmed by direct count in
  `src/data/achievements/registry.ts`. README's "~35" figure is
  **inaccurate**; see `FEATURES.md` for the discrepancy note.
- No backend, no auth, no `.env` files, no secrets found in a repo-wide
  grep (see `SECURITY.md`).

## What's claimed but NOT independently verified this pass

- "Verified with Playwright" (stated repeatedly in `DEVELOPMENT_PLAN.md`
  and `CHANGELOG.md`): no `@playwright/test` dependency, config, or test
  file exists anywhere in the current working tree or `package-lock.json`.
  Either Playwright was run ad hoc via `npx` and never committed, or the
  claim describes work from a since-removed setup. Treated as **Unknown /
  unverifiable** rather than false — see `TESTING.md`.
- Whether the actual gameplay is fun/functional end-to-end (i.e., can a
  player complete a full run) — this pass did not launch the dev server or
  play the game, only read source and data files.

## Note on concurrent activity (important for the next session)

While this documentation pass was running, `git status` showed the working
tree changing **live**, in real time, across multiple `git status` calls a
few seconds apart — new modifications appeared in
`src/game/engine/TileRenderer.ts` between two consecutive status checks
with no action taken by this session. As of this pass ending, the
following are modified/untracked and **uncommitted**:

```
 M src/App.tsx
 M src/data/enemies/strayThought.ts
 M src/game/engine/TileRenderer.ts
 M src/game/scenes/BattleScene.ts
 M src/game/state/store.ts
 M src/ui/menu/PauseMenu.tsx
 M src/ui/screens/TitleScreen.tsx
?? src/ui/screens/HowToPlayScreen.css
?? src/ui/screens/HowToPlayScreen.tsx
```

This looks like an in-progress feature (a new "How to Play" help screen,
plus related tweaks) being built by another active process/session — **not**
something this documentation pass authored or should claim credit for.
This session deliberately did not touch, stage, or commit any of these
`src/` changes. The next session should run `git status` immediately and
decide (with the user if unclear) whether that work is still in progress,
abandoned, or ready to finish and commit — do not assume it's safe to
discard.

**Update, later in this same pass**: `git status` was re-checked again
before the final commit and had grown further — `CHANGELOG.md` itself is
now also modified (in-progress, uncommitted), and its diff explicitly
labels the in-flight work as **"0.23.0"**, describing a How to Play screen
(title screen + pause menu) and a one-time battle-intro primer as "the
first onboarding this project has ever had," plus additional presentation
polish (monster highlight, wall-adjacency shadows in `TileRenderer.ts`,
`PlaceholderSprites.ts`). This confirms the concurrent session is doing
real, coherent, in-progress feature work — not stray edits. This
documentation pass still did not touch, stage, or commit any of it,
including the in-progress `CHANGELOG.md` edit, to avoid colliding with
that session's own commit when it's ready. The documentation commit from
this pass only includes the 15 new canonical doc files.

## Immediate next steps

See `TASKS.md` for the full queue. Highest-priority items:
1. Resolve/finish the in-progress `HowToPlayScreen` + related uncommitted
   changes (see above) — talk to the user if authorship/intent is unclear.
2. Decide whether to bump `package.json`'s version field to match
   `CHANGELOG.md`.
3. Consider adding a real test setup if the "Verified with Playwright"
   claims are meant to be reproducible by future sessions (currently they
   are not, per `TESTING.md`).
