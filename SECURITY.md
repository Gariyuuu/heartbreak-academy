# SECURITY.md

## Posture summary

Very low attack surface: static client-side game, no backend, no auth, no
user accounts, no PII collection, no third-party API calls at runtime
(verified — see below). Security concerns for this project are almost
entirely about not regressing that simplicity, plus standard static-site
hygiene on the hosting side.

## Verified findings (this pass, 2026-08-07)

- **No `.env` files** anywhere in the repo (`find . -iname ".env*"`
  returned nothing, excluding `node_modules`).
- **No secrets found** in a repo-wide case-insensitive grep for
  `api[_-]?key|secret|password|token|-----BEGIN` across `.ts`/`.tsx`/
  `.json`/`.env*` files (excluding `node_modules`/`dist`/`.git`). The only
  hits were unrelated identifiers (e.g. `secretsFound` in the save schema,
  a `secret?: boolean` field on achievement data marking spoiler-hidden
  achievements, and `hba:timeline`/`hba:save:*` localStorage key names) —
  none are credentials.
- **No auth system** — no login, no session, no user accounts. Not
  applicable to this project.
- **No dependencies that call out to third-party APIs at runtime** —
  `package.json` dependencies are `howler`, `phaser`, `react`,
  `react-dom`, `zustand`; none are network/API clients.
- **`.vercel/` is gitignored** — confirmed in `.gitignore`. The
  `.vercel/project.json` file present locally contains only
  `projectId`/`orgId`/`projectName` (not secret — these identify the
  Vercel project, not credentials — but correctly excluded from git
  regardless per Vercel's own convention).

## Save-data posture

All persisted state lives in the player's own browser `localStorage`
(see `DATABASE.md`) — never transmitted anywhere. No encryption is applied
or needed: the data is gameplay state and a player-chosen display name,
not sensitive personal information. A malicious actor with local machine
access reading `localStorage` learns nothing more sensitive than "this
person played a video game and made these dialogue choices."

## If this project ever adds a backend/auth/API keys

Rules for that future work (aspirational — nothing here currently applies,
but stated for whoever adds the first one):
- Never commit real secret values to any of the 17 canonical docs or to
  source — placeholders only (e.g. `<STRIPE_SECRET_KEY>`).
- Add `.env.local` (or equivalent) to `.gitignore` before creating it.
- Update this file with the real posture at that time — don't leave this
  "no backend" summary stale.

## Recommendation for the user

None required at this time — no secrets or credentials exist in this
repo to rotate or protect. Nothing found here needs the user's direct
decision.
