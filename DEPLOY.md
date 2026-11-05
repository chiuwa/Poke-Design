# Deploy Guide

## What deploys

`dist/` is a fully static site: HTML, CSS, JS, 1,071 sprite PNGs and
1,351 palette JSON files. No server runtime, no database, no secrets.

The page registers WebMCP tools on `document.modelContext` at runtime and
loads the `@mcp-b/webmcp-local-relay@6` embed. Desktop agents connect through
a local relay process; the public deployment itself needs no backend.

## Vercel

```bash
npx vercel login
npx vercel --prod
```

`vercel.json` is already configured with the Vite build command, `dist`
output, immutable cache headers for sprites/data/assets and SPA rewrites.

Or push to GitHub and import at https://vercel.com/new.

## Netlify

```bash
npm run build
npx netlify deploy --prod --dir=dist
```

Or drag `dist/` to https://app.netlify.com/drop.

## Cloudflare Pages

```bash
npm run build
npx wrangler pages deploy dist --project-name=palette-studio
```

## GitHub Pages

Push the repo, enable Pages → GitHub Actions, and use the standard Vite
workflow. If deploying under `/repo-name/`, set `base: "/repo-name/"` in
`vite.config.ts` before building.

## Post-deploy checklist

1. Open the deployed HTTPS URL in Chrome.
2. Run `document.modelContext.getTools()` in DevTools — you should see
   `list_pokemon`, `pokemon_palette`, `design_skill`, `design_brief`.
3. Add the local relay to Codex / Claude Code / Claude Desktop / Cursor.
4. Keep the deployed tab open and ask your agent to call `pokemon_palette`.

## Security note

The relay binds to loopback and accepts browser pages by default. On shared
machines, restrict it with:

```bash
npx @mcp-b/webmcp-local-relay --widget-origin https://your-deployment.example
```
