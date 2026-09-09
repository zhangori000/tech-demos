# Cloudflare deploys

All demos ship from **one** Cloudflare project: the existing `tech-demos` Worker
(static assets, Direct Upload) at
https://tech-demos.zhangorienspam.workers.dev. Each app is served under its own
path: `https://tech-demos.zhangorienspam.workers.dev/<slug>/`. Do not create a
second Cloudflare project or a per-app project.

## How it works

`.github/workflows/deploy-cloudflare.yml` runs on every pull request and on
every push to `main`:

1. It scans `apps/*/` for folders whose `package.json` has a `build` script.
2. For each such app it runs `bun install`, then builds with the Vite base path
   set to `/<slug>/` (it sets `VITE_BASE=/<slug>/` **and** appends
   `--base /<slug>/` to the build command, so stock Vite configs work as-is).
3. It assembles a `site/` directory: a generated `site/index.html` linking to
   every built app, plus `site/<slug>/` containing each app's `dist/` output.
4. It deploys `site/` with Wrangler to the existing `tech-demos` Worker using
   the root `wrangler.toml`:
   - **Pull requests** run `wrangler versions upload`, which publishes a
     preview version on a hashed `*.workers.dev` URL without touching
     production. The workflow comments the preview URL on the PR.
   - **Pushes to `main`** run `wrangler deploy`, which updates production.

## Required GitHub Actions secrets

Both already exist on this repo:

- `CLOUDFLARE_API_TOKEN` — API token with Workers edit permission
- `CLOUDFLARE_ACCOUNT_ID` — the Cloudflare account id

## Rules for every new app

- Land under `apps/<slug>/` and be self-contained: `bun install && bun run
  build` must work from inside that folder (and `bun run dev` for local work).
- Build correctly with `base: '/<slug>/'`. The stock Vite config already works
  because CI appends `--base /<slug>/`, but if you customize `base`, read it
  from the environment so local dev keeps serving from `/`:

  ```ts
  // vite.config.ts
  export default defineConfig({
    base: process.env.VITE_BASE ?? '/',
    // ...
  })
  ```

- Use root-relative asset references only through Vite (imports or `public/`
  files referenced as relative paths). Hardcoded absolute URLs like
  `/favicon.svg` in `index.html` will break under the `/<slug>/` subpath;
  Vite rewrites them only when they go through its HTML/asset pipeline.
