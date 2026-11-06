import { useEffect, useRef, useState } from 'react';
import { TYPE_COLORS } from '../lib/types';
import type { Pokemon, PokemonMetadata } from '../lib/types';
import { formatId, getPokemonById } from '../lib/pokemon';

interface Props {
  pokemon: PokemonMetadata;
  onClose: () => void;
}

function readableText(hex: string): string {
  const c = hex.replace('#', '');
  if (c.length !== 6) return '#16130f';
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.62 ? '#191511' : '#fffaf2';
}

function mix(hex: string, target: string, amount: number): string {
  const a = hex.replace('#', '');
  const b = target.replace('#', '');
  const av = [0, 2, 4].map((i) => parseInt(a.slice(i, i + 2), 16));
  const bv = [0, 2, 4].map((i) => parseInt(b.slice(i, i + 2), 16));
  const out = av.map((v, i) => Math.round(v + (bv[i] - v) * amount).toString(16).padStart(2, '0'));
  return `#${out.join('')}`;
}

export default function PokemonDetail({ pokemon, onClose }: Props) {
  const [full, setFull] = useState<Pokemon | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setFull(null);
    getPokemonById(pokemon.id).then(setFull);
  }, [pokemon.id]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    dialogRef.current?.focus();
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const cp = full?.colorPalette;
  const primary = cp?.primary ?? '#f0e7d8';
  const secondary = cp?.secondary ?? '#d7c5ad';
  const accent = cp?.accent ?? '#b13f32';
  const base = cp?.background ?? '#fbf8f2';
  const ink = cp?.text ?? '#1b1713';
  const highlights = cp?.highlights ?? [primary, secondary, accent];

  const sheetVars = {
    '--sheet-primary': primary,
    '--sheet-secondary': secondary,
    '--sheet-accent': accent,
    '--sheet-bg': base,
    '--sheet-ink': ink,
    '--sheet-line': mix(ink, base, 0.78),
    '--sheet-soft': mix(base, primary, 0.14),
    '--sheet-on-primary': readableText(primary),
    '--sheet-on-accent': readableText(accent),
  } as React.CSSProperties;

  const copy = (value: string) => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(value);
      window.setTimeout(() => setCopied(null), 1200);
    }).catch(() => undefined);
  };

  const tokens = Array.from(new Set([primary, secondary, accent, ...highlights]));
  const brief = `Use the ${pokemon.name} color palette (${tokens.join(', ')}) from pokemon_palette, then apply a design_skill and draft a landing page. Return DESIGN.md, CSS tokens and a React component.`;

  return (
    <div className="palette-overlay" onMouseDown={onClose}>
      <div
        className="palette-sheet"
        style={sheetVars}
        role="dialog"
        aria-modal="true"
        aria-label={`${pokemon.name} color palette`}
        tabIndex={-1}
        ref={dialogRef}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="sheet-accent-strip" aria-hidden="true" />
        <header className="sheet-header">
          <div>
            <span className="sheet-index">Specimen {formatId(pokemon.id)}</span>
            <h2>{pokemon.name}</h2>
            <p>{pokemon.species}</p>
          </div>
          <button type="button" className="sheet-close" onClick={onClose} aria-label="Close palette sheet">×</button>
        </header>

        <div className="sheet-body">
          <div className="sheet-visual">
            <div className="sheet-sprite-frame">
              <img src={`/sprites/${pokemon.id}.png`} alt={pokemon.name} />
              <span className="frame-tick frame-tick-tl" /><span className="frame-tick frame-tick-tr" />
              <span className="frame-tick frame-tick-bl" /><span className="frame-tick frame-tick-br" />
            </div>
            <div className="sheet-preview" aria-label="Miniature UI preview using this palette">
              <div className="mini-nav"><i /><span /><span /><span /></div>
              <div className="mini-hero">
                <div><b>Make it<br />feel like {pokemon.name}.</b><small>Palette → interface</small></div>
                <div className="mini-orb" />
              </div>
              <div className="mini-row"><i /><i /><i /></div>
            </div>
          </div>

          <div className="sheet-data">
            <section className="sheet-types">
              {pokemon.type.map((t) => (
                <span key={t} style={{ background: TYPE_COLORS[t] ?? '#777', color: readableText(TYPE_COLORS[t] ?? '#777') }}>{t}</span>
              ))}
            </section>

            <section className="sheet-palette">
              <div className="sheet-section-head"><h3>Color Palette</h3><span>{highlights.length + 3} tokens</span></div>
              <div className="main-swatches">
                {[
                  ['Primary', primary],
                  ['Secondary', secondary],
                  ['Accent', accent],
                ].map(([label, color]) => (
                  <button key={label} type="button" onClick={() => copy(color)} style={{ background: color, color: readableText(color) }}>
                    <span>{label}</span><code>{color}{copied === color ? ' ✓' : ''}</code>
                  </button>
                ))}
              </div>
              <div className="highlight-row">
                {highlights.map((h, i) => (
                  <button key={`${h}-${i}`} type="button" onClick={() => copy(h)} style={{ background: h }} title={`Copy ${h}`} aria-label={`Copy ${h}`}>
                    <span>{copied === h ? '✓' : ''}</span>
                  </button>
                ))}
              </div>
              <p className="sheet-hint">Click any swatch to copy its hex.</p>
            </section>

            <section className="sheet-brief">
              <div className="sheet-section-head"><h3>Assistant ready</h3><span>DESIGN.md starter</span></div>
              <p>{brief}</p>
              <button type="button" className="sheet-primary-action" onClick={() => copy(brief)}>
                {copied === brief ? 'Prompt copied' : 'Copy studio prompt'}
              </button>
            </section>

            {full && (
              <section className="sheet-meta">
                <div><span>Height</span><b>{full.height} m</b></div>
                <div><span>Weight</span><b>{full.weight} kg</b></div>
                <div><span>Generation</span><b>{pokemon.generation}</b></div>
                <div><span>Rarity</span><b>{pokemon.rarity}</b></div>
              </section>
            )}
          </div>
        </div>

        <footer className="sheet-footer">
          <span>pokemon_palette · design_skill · WebMCP</span>
          <span>{formatId(pokemon.id)} / {pokemon.name}</span>
        </footer>
      </div>
    </div>
  );
}
