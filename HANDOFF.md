# HANDOFF.md — Start Here

If you are a fresh Claude Code session picking up this repo cold, this is
the file to read first (after `CLAUDE.md`).

## What this project is, in one paragraph

HEART//BREAK ACADEMY is an original anime-psychological RPG: top-down
exploration + Undertale-style bullet-dodging combat with an ACT/SPARE
emotional-state system, wrapped in a visual-novel dialogue layer. Fully
client-side (Vite + React + Phaser + Zustand, no backend, saves in
`localStorage`), live at https://heartbreak-academy.vercel.app. As of
2026-08-07 it has 15 built regions, 10 bosses, 10 endings, 8 named
characters, and 22 achievements — all verified against actual registry
files in `src/data/` and `src/game/maps/`, not just restated from the
design doc. See `FEATURES.md` for the full verified-vs-claimed breakdown.

## Reading order for a new session

1. `CLAUDE.md` — operating rules, critical do's/don'ts
2. This file
3. `PROJECT_STATE.md` — exact current stopping point, including an
   important note about concurrent editing (read it before touching git)
4. `TASKS.md` — what's queued
5. `FEATURES.md` — what's actually built vs. specced
6. Whatever else is relevant to your specific task
   (`ARCHITECTURE.md`/`FILE_MAP.md` for code structure,
   `DATABASE.md`/`SECURITY.md`/`DEPLOYMENT.md`/`TESTING.md` for those
   specific concerns, `DECISIONS.md` for why things are built the way
   they are, `ROADMAP.md` for what's next, `UI_SYSTEM.md` for design
   conventions)

## Important: this repo may be actively edited by another session right now

During the documentation pass that created this file (2026-08-07), the
working tree was observed changing **live**, across consecutive
`git status` calls seconds apart, with no action from this session. By
the end of the pass, `CHANGELOG.md` plus 8 `src/` files were modified and
2 new files were untracked — coherent, in-progress feature work (a How to
Play screen + onboarding primer, tracked as "0.23.0" in the in-flight
`CHANGELOG.md` edit itself). This documentation pass deliberately did not
touch any of it. **Run `git status` immediately when you start** and treat
any uncommitted changes you don't recognize as possibly belonging to a
concurrent session, not as something to casually discard or absorb into
an unrelated commit.

## What this documentation pass did and didn't do

Did: created 15 missing canonical doc files (this repo had only
`README.md` and `CHANGELOG.md` before), verified region/boss/ending/
character/achievement counts against real code, verified the live deploy
responds, scanned for secrets (none found), and staged/committed only
those 15 new files in one scoped commit.

Didn't: touch any `src/` file, touch `README.md` or `CHANGELOG.md`
(both already existed and were mid-edit by another process), run the dev
server or play the game, run `npm run validate:maps` or `npm run build`,
or resolve the in-progress uncommitted work described above.

## Known real gaps (not invented, all traceable to a specific finding)

- No test framework/Playwright setup exists despite historical claims of
  Playwright-based QA — see `TESTING.md`.
- README's achievement count ("~35") doesn't match the real count (22) —
  see `FEATURES.md`.
- `package.json` version (`0.0.0`) is stale vs. `CHANGELOG.md` (`0.22.0`,
  soon `0.23.0` per the in-progress edit observed above).
- No `vercel.json` — deploy config isn't reviewable from the repo, only
  inferred from `package.json`/README — see `DEPLOYMENT.md`.

None of these are secrets or security issues (see `SECURITY.md` — none
found).

---

## Prompt for the next Claude Code account

Copy-paste this to start your next session on this repo:

```
Project: ~/Projects/heartbreak-academy (HEART//BREAK ACADEMY).

Before doing anything else:
1. Read CLAUDE.md, then HANDOFF.md (this file), then PROJECT_STATE.md —
   PROJECT_STATE.md has an important note about the working tree possibly
   being mid-edit by a concurrent session as of 2026-08-07.
2. Run `git status` and `git log --oneline -5` yourself and reconcile
   what you see against PROJECT_STATE.md's description — if it's stale
   (new commits landed, or the in-flight How-to-Play/onboarding work from
   2026-08-07 got finished/committed/abandoned), don't trust the doc
   blindly, verify against the real repo state first.
3. Read TASKS.md for the current queue and FEATURES.md for what's
   actually verified-built vs. only specced — don't restate
   DEVELOPMENT_PLAN.md's claims as fact without checking the relevant
   registry file in src/data/ or src/game/maps/ yourself, the same way
   the 2026-08-07 documentation pass did.
4. Before ending YOUR session, you must update PROJECT_STATE.md (new
   stopping point), TASKS.md (what you completed/queued), and
   SESSION_LOG.md (a dated entry — see its template section at the
   bottom) so the next account can pick this up cold, exactly like you're
   doing now. Do not skip this even if your change felt small.
5. Never write real secret values into any of the 17 canonical docs —
   placeholders only. If you find a real secret already committed
   anywhere in the repo, flag it to the user rather than fixing it
   silently.
```
