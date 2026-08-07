# CLAUDE.md — Operating Manual for HEART//BREAK ACADEMY

This file tells a Claude Code session how to work in this repo safely and
consistently. Read this first, then `HANDOFF.md`.

## What this project is

An original anime-psychological RPG (no relation to any existing IP):
top-down exploration + Undertale-style bullet-dodging battles with an
ACT/SPARE emotional-state combat system, wrapped in a visual-novel dialogue
layer. Client-only, no backend, saves live in browser `localStorage`. Live
at https://heartbreak-academy.vercel.app (verified returning HTTP 200 as of
2026-08-07 — see `DEPLOYMENT.md`).

Full build history and phase-by-phase scope lives in `DEVELOPMENT_PLAN.md`
(kept in place — it is a legitimate, detailed design/build log, not the
canonical name for any of the 17 standard docs, but still the single best
source for "why does this system work this way"). `CHANGELOG.md` has the
version-by-version detail. Don't duplicate either — link to them.

## Critical rules

1. **Never invent facts.** Every claim in these docs is either verified
   against real code/git, explicitly marked "Unknown," or explicitly marked
   "per DEVELOPMENT_PLAN.md / CHANGELOG.md (not independently re-verified
   in code)." Do not upgrade a spec claim to a "built" claim without
   checking the actual data files.
2. **No secrets in docs, ever.** This project currently has no API keys,
   no auth, no `.env` files (verified 2026-08-07 — see `SECURITY.md`). If
   that ever changes, use placeholders only (`<VERCEL_TOKEN>`, never a real
   value) in every one of these files.
3. **`data/maps/*.ts` changes require `npm run validate:maps` before you
   trust them.** This project has a real, project-specific history of
   connectivity/collision bugs that typecheck and build both miss silently
   (see `DEVELOPMENT_PLAN.md`'s Phase 11 note and `CHANGELOG.md` 0.6.0).
4. **Input handling is DOM-driven, not Phaser-polled — keep it that way.**
   `InputManager` uses raw `window` keydown/keyup listeners. Phaser's
   `Key`/`JustDown` system silently breaks after `scene.restart()` (root-
   caused in `CHANGELOG.md` 0.5.0). Every new input-handling UI component
   should own its own keydown listener like `DialogueBox`/`FightBar` do,
   not rely on a Phaser scene relaying key state.
5. **Read `state/derived.ts` for equipment-affected values, never the raw
   base fields.** `getEffectiveMaxHp`/`getEffectiveTimingWindowMs` exist
   specifically because raw `player.maxHp` and raw timing constants ignore
   equipped accessory/weapon bonuses (see `CHANGELOG.md` 0.5.0 "Accessory
   stat bonuses" bug).
6. **Bump `SAVE_VERSION` and add a `migrate()` branch in
   `saveManager.ts` for any change to `GameSaveState`'s shape.** Never
   silently drop or break an old save (see `DATABASE.md`).
7. **Working tree discipline:** this repo is picked up cold by different
   Claude Code accounts/sessions with no shared chat history — possibly
   concurrently. Before any destructive git operation, run `git status`
   first. If you see uncommitted changes you don't recognize authoring,
   assume another session may be actively editing and do not discard or
   silently absorb them into an unrelated commit — see `PROJECT_STATE.md`
   for the state as of the most recent documentation pass.
8. **Never commit `node_modules`, `dist`, or `.vercel`** — already
   gitignored, keep it that way.

## Commands

```bash
npm run dev            # Vite dev server
npm run build           # tsc -b && vite build
npm run lint             # oxlint
npm run preview          # preview a production build locally
npm run validate:maps    # standalone map-connectivity/collision validator
```

There is no `npm test` script and no test framework installed (see
`TESTING.md` — this is a real gap, not an oversight to paper over).

## Where things live

See `FILE_MAP.md` for the annotated guide and `ARCHITECTURE.md` for how the
React/Phaser/Zustand layers divide responsibility.

## Documentation set

This repo follows a 17-file canonical documentation standard so any fresh
Claude Code session can pick up the project cold from the repo alone:
CLAUDE.md (this file), PROJECT_STATE.md, TASKS.md, HANDOFF.md,
SESSION_LOG.md, CHANGELOG.md, ARCHITECTURE.md, FEATURES.md, DATABASE.md,
SECURITY.md, DEPLOYMENT.md, TESTING.md, DECISIONS.md, FILE_MAP.md,
ROADMAP.md, README.md, UI_SYSTEM.md. Keep them current — update
`PROJECT_STATE.md`, `TASKS.md`, and `SESSION_LOG.md` before ending any
session that changes code.
