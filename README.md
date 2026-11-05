# PokémonPalette — WebMCP-enabled design tool

Extract beautiful color palettes from every Pokémon. Built as an **Apple-style** interface
with **WebMCP** integration so AI agents can use it as a design data source.

## What makes it different

This is not just a static palette site — it ships as an **open web MCP server** via
[WebMCP](https://developer.chrome.com/docs/ai/webmcp) (`document.modelContext`).
Any AI agent (Chrome built-in agent, Claude Desktop, Cursor, ChatGPT, Gemini)
can discover and call these tools:

| Tool | What it does |
| --- | --- |
| `list_pokemon` | Search/filter the 1025-Pokémon library by name, type, generation, rarity |
| `get_pokemon_palette` | Extract full color palette (primary/secondary/accent + 6 highlights) |
| `get_design_skill` | Get distilled design principles — Apple Design, Emil Kowalski design eng |
| `generate_design_brief` | Fuse palette + skill → CSS tokens, typography scale, motion guide |

### Example user journey

> *"Use the Jigglypuff color palette and Apple design skill to design a landing page."*

1. Agent calls `get_pokemon_palette({ pokemon: 'jigglypuff' })` → gets `#ffaca4`, `#e67383`, `#ec5f6d` …
2. Agent calls `get_design_skill({ skill: 'apple-design' })` → gets Apple fluid-interface principles
3. Agent calls `generate_design_brief({ pokemon: 'jigglypuff', skill: 'apple-design' })` → gets ready-to-paste CSS tokens + motion + typography rules
4. Agent uses that brief to generate the actual web page

## Tech stack

- Vite + React 19 + TypeScript
- Apple Design Language (translucent materials, fluid motion, optical typography)
- WebMCP via `@mcp-b/global` polyfill (works on Chrome 155+ natively, Safari/Firefox via polyfill)
- Static hosting ready (Vercel, Netlify, Cloudflare Pages, GitHub Pages)

## Deploy

```bash
npm run build   # outputs to dist/
```

Or push to GitHub and import into Vercel — config already included.

## Local dev

```bash
npm install
npm run dev      # http://localhost:5173
```

## Credits

- Sprite & palette data from the original
  [PokémonPalette](https://github.com/yassenshopov/pokemonpalette) (MIT)
- Design philosophy from [Apple Design](https://developer.apple.com/design/) and
  Emil Kowalski's design engineering
