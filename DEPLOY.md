# Deploy Guide

## Option 1: Vercel (recommended)

```bash
# 1. Login to Vercel (one-time)
npx vercel login

# 2. Deploy from this folder
npx vercel --prod
```

Or: push this folder to GitHub, then import at https://vercel.com/new.
`vercel.json` is already configured with the right build command, output
directory, and cache headers for sprites/data.

## Option 2: Netlify

```bash
npm i -g netlify-cli
netlify deploy --prod --dir=dist
```

Or drag-and-drop the `dist/` folder to https://app.netlify.com/drop.

## Option 3: Cloudflare Pages

```bash
npm i -g wrangler
wrangler pages deploy dist --project-name=pokemon-palette
```

## Option 4: GitHub Pages

1. Push this repo to GitHub
2. Settings → Pages → Source: GitHub Actions
3. Use the standard Vite deploy action with `base: '/REPO_NAME/'`
   (update `vite.config.ts` accordingly)

## What's inside dist/

- `index.html`, `assets/` — the app (90KB gzipped JS, 3KB CSS)
- `sprites/` — 1071 Pokémon sprite PNGs (4.3MB)
- `data/` — 1351 JSON files with palettes/stats (10MB)

Total: ~15MB static. No backend required.
