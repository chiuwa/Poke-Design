# Poké Palette Atelier

A design-material library for AI agents. Combine `pokemon_palette` +
`design_skill` through WebMCP and generate a UI design in one sentence.

## What it is

This is not a Pokédex. It is an editorial, AI-readable design archive:

- 1,025 sprite-derived color palettes exposed as structured WebMCP tools
- Expert design skills: Apple Design and Emil Kowalski design engineering
- A `design_brief` tool that fuses a palette + skill into CSS tokens,
  typography, motion, layout and accessibility guidance
- A visible "Reconstruction Stage" inspired by
  [swarm-cursors](https://github.com/DhvanilPatel/swarm-cursors): virtual
  cursors rebuild a generated UI from a blank canvas — rulers, selection
  handles, W×H badges, type and media layers
- A public-deployable static site, no backend or API key required

## WebMCP tools

| Tool | Purpose |
| --- | --- |
| `list_pokemon` | Search the archive by name, species, type, generation or rarity |
| `pokemon_palette` | Return one Pokémon's color palette and sprite reference |
| `design_skill` | Return distilled `apple-design` or `emil-design-eng` principles |
| `design_brief` | Compose CSS variables, type scale, motion, spacing and a11y rules |

Example agent prompt:

> Use the Jigglypuff color palette from `pokemon_palette`, apply the Apple
> Design skill from `design_skill`, and generate a complete landing page.
> Return DESIGN.md + CSS variables + a React component.

## Connect an agent

The page loads `@mcp-b/global` and the `@mcp-b/webmcp-local-relay@6` browser
embed. Add the relay to your MCP client:

### Codex — `~/.codex/config.toml`

```toml
[mcp_servers.poke-palette-atelier]
command = "npx"
args = ["-y", "@mcp-b/webmcp-local-relay@latest"]
```

Official OpenAI documentation: [Codex MCP](https://learn.chatgpt.com/docs/extend/mcp.md).

### Claude Code

```bash
claude mcp add --transport stdio poke-palette-atelier -- npx -y @mcp-b/webmcp-local-relay@latest
```

### Claude Desktop / Cursor / Windsurf

```json
{
  "mcpServers": {
    "poke-palette-atelier": {
      "command": "npx",
      "args": ["-y", "@mcp-b/webmcp-local-relay@latest"]
    }
  }
}
```

Keep the site open in a browser tab. The relay discovers tools from
`document.modelContext` via the embed iframe.

### Browser-native agents

Chrome 155+ with WebMCP enabled, or the Model Context Tool Inspector
extension, can call `document.modelContext.getTools()` directly — no relay.

## Design direction

Editorial / archive / specimen-sheet. Warm paper, serif display type,
monospace metadata, rule lines, asymmetric split hero, sharp corners.
The hero stage is a reconstruction performance, not a decorative animation.

## Local dev

```bash
npm install
npm run dev
```

## Build

```bash
npm run build   # dist/
```

See [DEPLOY.md](./DEPLOY.md) for Vercel / Netlify / Cloudflare / GitHub Pages.

## Data

Sprite and palette data adapted from the original MIT-licensed
[PokémonPalette](https://github.com/yassenshopov/pokemonpalette) project.
