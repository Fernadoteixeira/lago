# Lago 360 Docs deployment

The integrated documentation is built and deployed by `.github/workflows/lago-360-docs.yml`.

## Local commands

```bash
pnpm install --frozen-lockfile
pnpm test
pnpm check
pnpm build
pnpm dev
```

The production client bundle is emitted to `dist/public`. The workflow also builds `dist/index.js` for the Node server, but GitHub Pages publishes the static client directory.

## GitHub Pages

The workflow runs `pnpm test`, `pnpm check`, `pnpm build`, and a static smoke test on pull requests. Pushes to `main` repeat the same gates before deployment. It uses the repository's GitHub Pages environment with the official Pages artifact and deployment actions.

The Vite base path is derived from `github.event.repository.name`, so the fork is published under:

```text
https://<owner>.github.io/<repository>/
```

If the repository uses a custom domain, replace the `VITE_BASE_PATH` value in the workflow with `/` or the required path.

## Optional analytics

The build accepts these optional repository variables:

- `VITE_ANALYTICS_ENDPOINT`
- `VITE_ANALYTICS_WEBSITE_ID`

They are read from GitHub Actions `vars`, not `secrets`, because they are public browser configuration. The client injects the analytics script only when both values are present; an unset configuration produces no invalid analytics request. Do not place API keys, private tokens, or server credentials in `VITE_*` variables; Vite embeds them into the client bundle.

## Required repository settings

Enable **Settings → Pages → Source: GitHub Actions** once for the fork. The workflow grants `pages: write` and `id-token: write` only to the deployment job's workflow permissions. No external deployment token is required for GitHub Pages.

## Smoke test

Before uploading the artifact, CI runs `pnpm smoke-test`, which verifies the Lago marker, `lang="pt-BR"`, unresolved Vite placeholders, and bundle budgets of 450 KB for JavaScript and 180 KB for CSS. CI then starts `vite preview`, requests `/`, and verifies that the response contains `Lago 360`. These checks catch broken or regressed builds while keeping the deploy deterministic and independent of the API submodule.

## Rollback

Rollback is performed by redeploying the last successful workflow artifact or by reverting the deployment commit and pushing to `main`. Because GitHub Pages publishes the static `dist/public` artifact, the rollback does not require database migration or API rollback. Record the reverted commit, workflow run, and public URL in the release evidence.
