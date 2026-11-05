/**
 * WebMCP integration — exposes the Pokémon Palette site's data and features
 * to AI agents (Chrome built-in agent, Claude Desktop, Cursor, etc.) via
 * document.modelContext (W3C WebMCP spec).
 *
 * Register tools here so agents can:
 *  - search / list Pokémon
 *  - fetch full color palettes
 *  - get design skill guidance (Apple Design, Emil Kowalski design engineering)
 *  - compose a complete design brief using a palette + a design skill
 */

import '@mcp-b/global';

interface McpToolResult {
  content: Array<{ type: 'text'; text: string }>;
}

function text(result: unknown): McpToolResult {
  return {
    content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
  };
}

// Avoid TS conflict with DOM lib types — cast to any for WebMCP runtime
const ctx = document.modelContext as unknown as {
  registerTool: (t: unknown) => Promise<void>;
};

export async function registerWebMcpTools() {
  if (!ctx) {
    console.warn('[WebMCP] document.modelContext unavailable');
    return;
  }

  // Lazy-load data so we don't ship it into the main bundle
  const indexModule = await import('../../public/data/pokemon/index.json');
  const index = indexModule.default as Array<{
    id: number;
    name: string;
    species: string;
    type: string[];
    generation: number;
    rarity: string;
  }>;

  await ctx.registerTool({
    name: 'list_pokemon',
    description:
      'List Pokémon in the palette library. Supports filtering by type, generation, rarity, or name search. Returns id, name, species, types, generation and rarity.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Name or species substring, e.g. "pika".' },
        type: {
          type: 'string',
          description: 'Filter by Pokémon type, e.g. "Fire", "Water", "Grass".',
        },
        generation: { type: 'number', description: 'Filter by generation 1-9.' },
        rarity: { type: 'string', description: 'Filter by rarity, e.g. "Common", "Legendary".' },
        limit: { type: 'number', description: 'Max results. Default 20.' },
      },
    },
    execute: async (args: {
      query?: string;
      type?: string;
      generation?: number;
      rarity?: string;
      limit?: number;
    }) => {
      let list = index;
      if (args.query) {
        const q = args.query.toLowerCase();
        list = list.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.species.toLowerCase().includes(q)
        );
      }
      if (args.type) {
        list = list.filter((p) =>
          p.type.some((t) => t.toLowerCase() === args.type!.toLowerCase())
        );
      }
      if (args.generation) {
        list = list.filter((p) => p.generation === args.generation);
      }
      if (args.rarity) {
        list = list.filter((p) => p.rarity.toLowerCase() === args.rarity!.toLowerCase());
      }
      const limit = Math.min(args.limit ?? 20, 200);
      return text({ total: list.length, results: list.slice(0, limit) });
    },
  });

  await ctx.registerTool({
    name: 'get_pokemon_palette',
    description:
      'Get the full extracted color palette for a Pokémon by name or id. Returns primary, secondary, accent colors plus 6 highlight hex values — ready to use as a design system.',
    inputSchema: {
      type: 'object',
      properties: {
        pokemon: {
          type: 'string',
          description: 'Pokémon name (e.g. "jigglypuff") or id (e.g. "39").',
        },
      },
      required: ['pokemon'],
    },
    execute: async (args: { pokemon: string }) => {
      const query = args.pokemon.trim().toLowerCase();
      const meta =
        index.find((p) => p.name.toLowerCase() === query) ??
        index.find((p) => p.name.toLowerCase().includes(query)) ??
        index.find((p) => String(p.id) === query);
      if (!meta) {
        return text({ error: `No Pokémon matching "${args.pokemon}"` });
      }
      const res = await fetch(`/data/pokemon/${meta.id}.json`);
      if (!res.ok) return text({ error: `Failed to load data for ${meta.name}` });
      const full = await res.json();
      return text({
        id: full.id,
        name: full.name,
        species: full.species,
        types: full.type,
        sprite: `/sprites/${full.id}.png`,
        colorPalette: full.colorPalette,
      });
    },
  });

  await ctx.registerTool({
    name: 'get_design_skill',
    description:
      'Get distilled design principles from an expert design skill to apply to a project. Skills: "apple-design" (fluid motion, materials, typography, 8 design principles), "emil-design-eng" (UI polish, animation decisions, component craft). Combine with get_pokemon_palette to generate a design brief.',
    inputSchema: {
      type: 'object',
      properties: {
        skill: {
          type: 'string',
          enum: ['apple-design', 'emil-design-eng'],
          description: 'Which design skill to return.',
        },
        topic: {
          type: 'string',
          description: 'Optional: narrow to a topic, e.g. "motion", "typography", "materials".',
        },
      },
      required: ['skill'],
    },
    execute: async (args: { skill: string; topic?: string }) => {
      const skills: Record<string, string> = {
        'apple-design': APPLE_DESIGN_SKILL,
        'emil-design-eng': EMIL_DESIGN_SKILL,
      };
      const content = skills[args.skill];
      if (!content) return text({ error: `Unknown skill: ${args.skill}` });
      if (args.topic) {
        const t = args.topic.toLowerCase();
        const paragraphs = content.split(/\n\n+/);
        const matching = paragraphs.filter((p) =>
          p.toLowerCase().includes(t)
        );
        return text({ skill: args.skill, topic: args.topic, excerpt: matching });
      }
      return text({ skill: args.skill, principles: content });
    },
  });

  await ctx.registerTool({
    name: 'generate_design_brief',
    description:
      'Compose a complete design brief that fuses a Pokémon color palette with a design skill. Returns CSS design tokens, typography scale, motion guidance and layout suggestions — ready to paste into a web page.',
    inputSchema: {
      type: 'object',
      properties: {
        pokemon: {
          type: 'string',
          description: 'Pokémon name or id for the palette, e.g. "jigglypuff".',
        },
        skill: {
          type: 'string',
          enum: ['apple-design', 'emil-design-eng'],
          description: 'Design skill to apply.',
        },
      },
      required: ['pokemon', 'skill'],
    },
    execute: async (args: { pokemon: string; skill: string }) => {
      const paletteRes = await (async () => {
        const query = args.pokemon.trim().toLowerCase();
        const meta =
          index.find((p) => p.name.toLowerCase() === query) ??
          index.find((p) => String(p.id) === query);
        if (!meta) return null;
        const res = await fetch(`/data/pokemon/${meta.id}.json`);
        if (!res.ok) return null;
        return res.json();
      })();
      if (!paletteRes) {
        return text({ error: `No Pokémon matching "${args.pokemon}"` });
      }
      const cp = paletteRes.colorPalette;
      const tokens = {
        colors: {
          primary: cp.primary,
          secondary: cp.secondary,
          accent: cp.accent,
          background: cp.background,
          text: cp.text,
          highlights: cp.highlights,
        },
        cssVariables: `:root {
  --color-primary: ${cp.primary};
  --color-secondary: ${cp.secondary};
  --color-accent: ${cp.accent};
  --color-bg: ${cp.background};
  --color-text: ${cp.text};
  --highlight-1: ${cp.highlights[0] ?? cp.primary};
  --highlight-2: ${cp.highlights[1] ?? cp.secondary};
  --highlight-3: ${cp.highlights[2] ?? cp.accent};
}`,
        typography: {
          heading: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
          body: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
          mono: 'ui-monospace, "SF Mono", Menlo, monospace',
          scale: {
            display: 'clamp(2.5rem, 6vw, 4.5rem), letter-spacing: -0.028em, line-height: 1.05',
            title: 'clamp(1.5rem, 4vw, 2.5rem), letter-spacing: -0.022em, line-height: 1.1',
            body: '1rem, letter-spacing: -0.003em, line-height: 1.5',
            caption: '0.75rem, letter-spacing: 0.02em, uppercase',
          },
        },
        motion: {
          spring: 'cubic-bezier(0.32, 0.72, 0, 1) — Apple drawer curve',
          easeOut: 'cubic-bezier(0.23, 1, 0.32, 1) — Apple default for UI',
          easeInOut: 'cubic-bezier(0.77, 0, 0.175, 1) — on-screen movement',
          durations: {
            buttonPress: '100-160ms',
            tooltip: '125-200ms',
            dropdown: '150-250ms',
            modal: '200-500ms',
          },
        },
        layout: {
          spacing: 'Use 8/12/16/24/32/48/64px scale',
          radius: { small: '10px', medium: '14px', large: '20px', xl: '28px' },
          shadows: {
            small: '0 1px 3px rgba(0,0,0,0.06)',
            medium: '0 4px 16px rgba(0,0,0,0.08)',
            large: '0 20px 40px rgba(0,0,0,0.12)',
          },
        },
        accessibility: {
          reducedMotion: 'Respect prefers-reduced-motion: cross-fade instead of slide/spring.',
          reducedTransparency: 'Respect prefers-reduced-transparency: drop backdrop-filter, raise opacity.',
          contrast: 'Respect prefers-contrast: more — near-solid backgrounds, defined borders.',
        },
      };
      const skill = args.skill === 'apple-design' ? APPLE_DESIGN_SKILL : EMIL_DESIGN_SKILL;
      return text({
        pokemon: paletteRes.name,
        skill: args.skill,
        tokens,
        skillExcerpt: skill.slice(0, 3000) + '…',
        nextStep:
          'Use these tokens to style your next web page. Combine with the skill excerpt above for deeper guidance.',
      });
    },
  });
}

// Distilled skill texts (compact versions suitable as LLM context)
const APPLE_DESIGN_SKILL = `
APPLE DESIGN — from WWDC "Designing Fluid Interfaces" and related talks.

Core: an interface feels alive when motion starts from the current on-screen value, inherits user velocity, projects momentum, and can be grabbed/reversed at any instant. Springs make this natural.

1. Response — kill latency. Respond on pointer-down, not release. Every latency is a regression.
2. Direct manipulation — 1:1 tracking. Content follows the finger, respecting grab offset.
3. Interruptibility — every animation must be redirectable mid-flight. Never lock input during transition.
4. Behavior over animation — use springs (damping + response). Defaults: damping 1.0, response 0.3-0.4s. Add bounce (damping 0.8) only for momentum gestures.
5. Velocity handoff — animation continues at finger's exact velocity on release.
6. Momentum projection — project resting position from velocity: current + (v/1000)*d/(1-d), d=0.998.
7. Spatial consistency — enter and exit along the same path. Anchor interactions to their source.
8. Hint in direction of gesture — intermediate motion should telegraph the outcome.
9. Rubber-banding — soft boundaries. Resist progressively instead of hard stops.
10. Gesture details — tap highlights on touch-down, 10px hysteresis, cancel-by-dragging-away.
11. Frame-level smoothness — animate only transform and opacity (compositor-friendly).
12. Materials & depth — translucent layers via backdrop-filter. Bigger surface = stronger blur. Never stack light on light.
13. Multimodal feedback — motion + sound + haptics on the same frame.
14. Reduced motion & accessibility — prefers-reduced-motion: cross-fade, not slide. prefers-reduced-transparency: drop blur. prefers-contrast: more — solid surfaces.
15. Typography — tracking is size-specific. Large text wants negative tracking; small text wants slight positive. Tight leading on large, loose on body. Use system font.
16. Design foundations — Purpose, Agency, Responsibility, Familiarity, Flexibility, Simplicity, Craft, Delight.
17. Process — prototype interactively, test with real people, review motion with fresh eyes.

Concrete values:
- Critically damped spring: damping 1.0, response 0.3-0.4s.
- Momentum spring: damping 0.8, response 0.3-0.4s.
- Gesture velocity handoff: gestureVelocity / (target - current).
- Flick projection: current + (v/1000)*0.998/(1-0.998).
- Translucent chrome: background rgba(255,255,255,0.6) + backdrop-filter blur(20px) saturate(180%).
- Typography: display uses clamp(2rem,5vw,4rem), line-height 1.05, letter-spacing -0.02em.
`.trim();

const EMIL_DESIGN_SKILL = `
EMIL DESIGN ENG — from Emil Kowalski's design engineering philosophy.

Taste is trained, not innate. Unseen details compound. Beauty is leverage.

Animation decision framework:
1. Should this animate at all? 100+ times/day: no animation. Occasional (modals): standard. Rare: can add delight.
2. What is the purpose? Spatial consistency, state indication, explanation, feedback, preventing jarring changes. Never "it looks cool".
3. Easing? Entering/exiting: ease-out. Moving/morphing: ease-in-out. Hover/color: ease. Constant motion: linear.
4. Speed? UI under 300ms. Button press 100-160ms. Tooltips 125-200ms. Dropdowns 150-250ms. Modals 200-500ms.

Custom curves: use cubic-bezier, never built-in ease. ease-out: cubic-bezier(0.23,1,0.32,1). ease-in-out: cubic-bezier(0.77,0,0.175,1).

Component principles:
- Buttons must feel responsive: transform: scale(0.97) on :active with transition 160ms ease-out.
- Never animate from scale(0). Start from scale(0.95) + opacity 0.
- Popovers scale from their trigger (transform-origin). Modals stay center.
- Tooltips: skip delay on subsequent hovers.
- Use CSS transitions over keyframes for interruptible UI.
- Use blur to mask imperfect transitions: filter: blur(2px) during crossfade.
- @starting-style for modern entry animations.
- translateY(100%) for drawers, regardless of size.
- Stagger animations: 30-80ms between items.
- Reduced motion: keep opacity/color, remove movement.
- Hover: gate behind @media (hover: hover) and (pointer: fine).
- Only animate transform and opacity (GPU accelerated).
- Framer Motion x/y props are not hardware accelerated — use transform string.

Sonner principles: DX is key. Good defaults matter. Naming creates identity. Handle edge cases invisibly. Use transitions, not keyframes. Build a great documentation site.
`.trim();
