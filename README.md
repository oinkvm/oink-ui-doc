# Oink UI docs

The docs site for [Oink UI](https://github.com/oinkvm/oink-ui): guides, component docs with live demos, and four example apps (task tracker, analytics dashboard, mail, shop). Live at https://oink-ui.hachiwii.com.

## Development

```bash
npm install
npm run dev        # Vite dev server, uses the oink-ui package from node_modules
npm run dev:src    # uses the library source in ../oink-ui/src instead (set OINK_UI_SRC to point elsewhere)
npm run typecheck
npm run build      # client bundle + SSR bundle + prerender every page into dist/
npm run preview    # serve dist/ locally with Cloudflare Pages' routing rules (wrangler)
```

`dev:src` is for working on the library and the docs together: clone both repos side by side and component changes show up without publishing.

## Deploying

Deployed to Cloudflare Pages (project `oink-ui`). Pushing to `main` deploys via `.github/workflows/deploy.yml`, which needs two repository secrets: `CLOUDFLARE_API_TOKEN` (with the "Cloudflare Pages: Edit" permission) and `CLOUDFLARE_ACCOUNT_ID`.

To deploy from your machine instead (after `npx wrangler login`):

```bash
npm run deploy
```

Before uploading, `scripts/keep-assets.mjs` copies hashed assets from builds in the last 30 days into `dist/assets` (archived in `.asset-archive`, not committed), so tabs opened before a deploy can still load their code chunks. If a chunk still fails to load, the page reloads once instead of showing "not found".

## License

[MIT](./LICENSE) © Hachiwii
