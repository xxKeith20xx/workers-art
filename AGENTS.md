# AGENTS.md

An interactive p5.js artwork served by a single JavaScript Worker (`src/index.js`). This repository is public: never commit account-specific secrets, tokens, or `.dev.vars`. The Worker has no bindings, so there is no `worker-configuration.d.ts`.

## Checks and release

- Node 24 (`.nvmrc`); in agent shells run `source ~/.nvm/nvm.sh && nvm use` first. Use `WRANGLER_LOG_PATH=/tmp/wrangler-logs` for Wrangler.
- `npm run check` runs `wrangler deploy --dry-run`. There are no tests or type checks.
- GitHub Actions `Check` runs `npm ci && npm run check` with Node from `.nvmrc`. Dependabot waits 7 days after a release (`cooldown`), and qualified patch updates auto-merge after the check passes.
- `allowScripts` in `package.json` approves Wrangler's `esbuild` and `workerd` install scripts for npm 12.
- Workers Builds deploys pushes to `master`: build command `npm run check`, deploy command `npx wrangler deploy --tag "$WORKERS_CI_COMMIT_SHA" --message "commit $WORKERS_CI_COMMIT_SHA"`. After a push, confirm the exact commit's build and the live version (`npx wrangler deployments status`).
- The deployed Worker is named `workers-art`; keep `name` in `wrangler.jsonc` as is.
