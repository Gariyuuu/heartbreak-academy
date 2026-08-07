# DEPLOYMENT.md

## Live status — verified 2026-08-07

`curl -sI https://heartbreak-academy.vercel.app` returns:

```
HTTP/2 200
server: Vercel
last-modified: Fri, 07 Aug 2026 14:05:10 GMT
x-vercel-cache: HIT
```

**The site is live and serving.** The `last-modified` timestamp
(2026-08-07 14:05:10 UTC) lands almost exactly one minute after the local
timestamp of the latest commit, `8154d9f` (2026-08-07 07:04:03 -0700 =
14:04:03 UTC) — strong evidence the live deploy reflects the latest
commit on `main`, consistent with Vercel's git-integration auto-deploy
behavior. This pass did not have Vercel dashboard/API access to confirm
the deployment ID directly; the timestamp correlation is the verification
method used.

## How it's deployed

- **No `vercel.json`** exists in the repo — deploy config is whatever is
  set in the Vercel dashboard project settings, not version-controlled.
  This is a real gap if reproducibility matters (see "Gaps" below).
- **`.vercel/project.json`** (gitignored, present only in the local
  working copy) links this directory to Vercel project
  `heartbreak-academy` — contains only `projectId`/`orgId`/`projectName`,
  not secrets (see `SECURITY.md`).
- Per `README.md`: "Framework preset: Vite. No environment variables
  required." This matches `vite.config.ts` (a plain
  `defineConfig({ plugins: [react()] })`, no custom build output path,
  base path, or env wiring) — Vercel's Vite auto-detection should work
  with zero custom configuration.
- Build command (per `package.json`): `tsc -b && vite build` → static
  output in `dist/` (gitignored, present locally as a stale local build
  artifact from `2026-08-07 07:37`, not the deploy source of truth).
- Manual deploy path documented in README: `vercel --prod` from the repo
  root.
- The presence of `.vercel/` locally plus a live site that tracks the
  latest commit closely suggests this project is connected to Vercel's
  GitHub integration (auto-deploy on push to `main`), not solely manual
  `vercel --prod` runs — but this pass could not directly confirm a
  GitHub-Vercel webhook/integration is configured (would require Vercel
  dashboard access this session doesn't have).

## No environment variables / secrets in the deploy pipeline

Consistent with `SECURITY.md`'s findings: no `.env` files, no API keys, no
backend. Nothing to rotate or protect in the deploy config itself.

## Gaps / what the user may want to confirm directly

- **No `vercel.json` means the deploy config isn't reviewable from the
  repo.** If Vercel dashboard settings (build command overrides, ignored
  build step, etc.) ever diverge from the `package.json` defaults, this
  repo won't show it. Not urgent given the project's simplicity, but worth
  knowing.
- Whether auto-deploy-on-push is actually configured (see above) is the
  one deployment fact this pass could not verify directly — inferred only
  from timestamp correlation, not confirmed via Vercel's own tooling.

## How to redeploy manually

```bash
npm run build      # produces dist/
vercel --prod       # from repo root, requires Vercel CLI auth
```
