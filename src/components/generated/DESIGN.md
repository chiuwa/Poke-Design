# Jigglypuff × Apple Design — SaaS index page

Generated from the live WebMCP tools on this site:

- `pokemon_palette("jigglypuff")`
- `design_skill("apple-design")`
- `design_brief("jigglypuff", "apple-design")`

## Source palette

| Role | Hex |
| --- | --- |
| Primary | `#ffaca4` |
| Secondary | `#e67383` |
| Accent | `#ec5f6d` |
| Deep highlight | `#dd4655` |
| Counter-color | `#1785b5` |
| Background | `#F8F8F8` |
| Text | `#2C2C2C` |

## CSS variables

```css
:root {
  --color-primary: #ffaca4;
  --color-secondary: #e67383;
  --color-accent: #ec5f6d;
  --color-bg: #F8F8F8;
  --color-text: #2C2C2C;
  --highlight-1: #ffaca4;
  --highlight-2: #e67383;
  --highlight-3: #ec5f6d;
}
```

The implementation uses prefixed `--jp-*` equivalents in `tokens.css` so the sample cannot leak variables into the surrounding editorial site.

## Design direction

- **Product:** Puffbase, a calm planning workspace for small teams.
- **Typography:** system SF/Apple stack. Display type uses `clamp(2.5rem, 6vw, 4.5rem)`, `letter-spacing: -0.028em`, `line-height: 1.05`; body uses `1rem`, `line-height: 1.5`.
- **Materials:** one translucent navigation layer and one elevated product surface. `rgba(255,255,255,0.6)` plus `blur(20px) saturate(180%)`; no stacked light-on-light blur.
- **Layout:** 8/12/16/24/32/48/64px spacing scale; 10/14/20/28px radii; asymmetric hero with a compact dashboard specimen.
- **Motion:** `cubic-bezier(0.32, 0.72, 0, 1)` for spring-like interaction and `cubic-bezier(0.23, 1, 0.32, 1)` for UI ease-out. Only `transform` and `opacity` animate; press feedback is `scale(0.97)`.
- **Accessibility:** reduced motion removes transforms and transitions; reduced transparency replaces blur with solid surfaces; increased contrast strengthens borders and removes translucent fills.
- **Craft details:** exact palette tokens shown as a six-part rule, source chip uses the `/sprites/39.png` asset, and every interactive element has a visible state without a decorative sparkle or generic gradient.

## Deliverables

- `DESIGN.md` — this brief.
- `tokens.css` — CSS variables and Apple-derived motion/type tokens.
- `JigglypuffSaasIndex.tsx` — complete React component.
- `JigglypuffSaasIndex.css` — implementation.
- `GeneratedPreview.tsx` — scaled specimen used in the “Try this prompt” area.