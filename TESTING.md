# TESTING.md

## Current state: no test framework installed

Verified: `package.json` has no `test` script, no `@playwright/test`, no
`vitest`, `jest`, or any other test runner in `dependencies`/
`devDependencies`. `package-lock.json` was grepped for `playwright` and
returned no matches. No `*.spec.*` or `*.test.*` files exist anywhere in
the repo outside `node_modules`. No Playwright config file
(`playwright.config.*`) exists.

**This directly contradicts the testing methodology repeatedly described
in `DEVELOPMENT_PLAN.md` and `CHANGELOG.md`** — e.g. "Verified with
Playwright plus a from-scratch map-connectivity validator, not just
typechecked," and the detailed 0.5.0 changelog entry describing real bugs
"found via an actual Playwright pass against the running app." Two
possible explanations, both plausible, neither confirmable from the repo
alone:
1. Playwright was run ad hoc (`npx playwright ...`) during development
   without ever being added as a committed dependency/config.
2. A test setup existed at some point and was removed before the initial
   commit (`95b621c` already had no Playwright — there's only one commit
   before this documentation pass' target state, so this can't be checked
   via git history either).

**Treat the historical Playwright claims as Unknown/unverifiable, not as
false.** The bugs described (map transition teleport bug, `this.npcs`
accumulation bug, `JustDown()` post-restart failure, accessory bonuses
never applied) read as specific and plausible, consistent with real
debugging rather than invented flavor text — but this pass has no way to
re-run or confirm them.

## What IS available and verified working

- **`npm run validate:maps`** (`scripts/validate-maps.mjs`) — a real,
  substantial Node script that loads every `data/maps/*.ts` file and
  checks row-length consistency, exit reachability, and exit target
  validity. This is genuine automated verification, distinct from
  Playwright, and is present and runnable right now. Re-run this after any
  map data change.
- **`npm run build`** (`tsc -b && vite build`) — TypeScript typechecking
  gate. Real, runnable, but per the project's own documented history
  (multiple CHANGELOG entries), typecheck+build passing has repeatedly NOT
  caught real interaction/rendering bugs in this codebase — don't treat a
  clean build as sufficient evidence a feature works.
- **`npm run lint`** (`oxlint` via `.oxlintrc.json`) — configured with
  `react/rules-of-hooks: error` and `react/only-export-components: warn`.
  Real and runnable.

## How to actually test a change (recommended, given the tooling gap)

1. `npm run build` and `npm run lint` — baseline gates, cheap, catch
   obvious breaks.
2. `npm run validate:maps` if any `data/maps/*.ts` file changed.
3. `npm run dev` and manually drive the affected flow in a browser — this
   project's own history shows this is where real bugs are actually
   caught. If reintroducing Playwright, `npx playwright test` ad hoc
   (or install it properly as a devDependency + add a config so the next
   session can reproduce it) is a reasonable way to script that manual
   pass instead of inventing a new methodology.

## Recommendation for a future session

If reliable, reproducible QA matters going forward (the project's own
docs suggest the team values it — multiple real bugs were caught this
way), consider formally adding Playwright as a `devDependency` with a
committed config and at least a smoke-test spec, so "verified with
Playwright" becomes a checkable claim again rather than an oral-history
one. Not done in this pass — this pass is documentation-only, no
`package.json` changes were made.
