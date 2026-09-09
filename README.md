# tech-demos

Sticky monorepo for weekday tech demos. One approved bookmark becomes one folder under `apps/`.

Do not add a new GitHub repository per demo. Cloud agents only touch `apps/<slug>/` and open one pull request with at least one screenshot and one video of the running app.

## Deploys

Every app is published to the single existing `tech-demos` Cloudflare Worker under its own path, e.g. `https://tech-demos.zhangorienspam.workers.dev/pstack-playground/`.

- **Pull requests** build all apps and upload a preview version of the Worker; the workflow comments the hashed `*.workers.dev` preview URL on the PR.
- **Pushes to `main`** deploy production.

CI uses the repo secrets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` (already configured). Details and the rules each new app must follow are in [docs/cloudflare.md](docs/cloudflare.md).
