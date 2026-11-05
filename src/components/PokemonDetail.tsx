import { useEffect, useState } from 'react';
import { TYPE_COLORS } from '../lib/types';
import type { Pokemon, PokemonMetadata } from '../lib/types';
import { formatId, getPokemonById } from '../lib/pokemon';

interface Props {
  pokemon: PokemonMetadata;
  onClose: () => void;
}

export default function PokemonDetail({ pokemon, onClose }: Props) {
  const [full, setFull] = useState<Pokemon | null>(null);

  useEffect(() => {
    setFull(null);
    getPokemonById(pokemon.id).then(setFull);
  }, [pokemon.id]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const palette = full?.colorPalette;

  return (
    <div className="detail-overlay" onClick={onClose}>
      <div
        className="detail-modal"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: palette
            ? `linear-gradient(135deg, var(--bg-elev) 0%, var(--bg-elev) 60%), linear-gradient(135deg, ${palette.primary}15 0%, ${palette.secondary}15 100%)`
            : undefined,
        }}
      >
        <button className="detail-close" onClick={onClose} aria-label="Close">
          ✕
        </button>

        <div className="detail-hero">
          <img
            src={`/sprites/${pokemon.id}.png`}
            alt={pokemon.name}
            className="detail-sprite"
          />
          <div className="detail-info">
            <span className="detail-id">{formatId(pokemon.id)}</span>
            <h2>{pokemon.name}</h2>
            <p className="detail-species">{pokemon.species}</p>
            <div className="detail-types">
              {pokemon.type.map((t) => (
                <span
                  key={t}
                  className="type-chip"
                  style={{ background: TYPE_COLORS[t] ?? '#888' }}
                >
                  {t}
                </span>
              ))}
            </div>
            {full && (
              <p className="detail-desc">{full.description}</p>
            )}
          </div>
        </div>

        {palette && (
          <div className="palette-section">
            <h3>Color Palette</h3>
            <div className="palette-grid">
              <div
                className="palette-swatch"
                style={{ background: palette.primary }}
              >
                <span>Primary</span>
                <code>{palette.primary}</code>
              </div>
              <div
                className="palette-swatch"
                style={{ background: palette.secondary }}
              >
                <span>Secondary</span>
                <code>{palette.secondary}</code>
              </div>
              <div
                className="palette-swatch"
                style={{ background: palette.accent }}
              >
                <span>Accent</span>
                <code>{palette.accent}</code>
              </div>
            </div>
            <div className="palette-highlights">
              {palette.highlights.map((h, i) => (
                <button
                  key={i}
                  className="palette-hex"
                  style={{ background: h }}
                  onClick={() => {
                    navigator.clipboard.writeText(h);
                  }}
                  title={`Copy ${h}`}
                />
              ))}
            </div>
          </div>
        )}

        {full && (
          <div className="stats-section">
            <h3>Base Stats</h3>
            {[
              ['HP', full.baseStats.hp],
              ['Attack', full.baseStats.attack],
              ['Defense', full.baseStats.defense],
              ['Sp. Atk', full.baseStats.specialAttack],
              ['Sp. Def', full.baseStats.specialDefense],
              ['Speed', full.baseStats.speed],
            ].map(([label, value]) => (
              <div key={label as string} className="stat-row">
                <span className="stat-label">{label}</span>
                <div className="stat-bar">
                  <div
                    className="stat-fill"
                    style={{
                      width: `${Math.min(100, (Number(value) / 180) * 100)}%`,
                      background: palette?.primary ?? 'var(--accent)',
                    }}
                  />
                </div>
                <span className="stat-value">{value}</span>
              </div>
            ))}
            <p className="detail-meta">
              Height: {full.height}m · Weight: {full.weight}kg
              {full.abilities.length > 0 && (
                <>
                  {' '}· Abilities:{' '}
                  {full.abilities.map((a) => a.name).join(', ')}
                </>
              )}
            </p>
          </div>
        )}

        {!full && <p className="loading-note">Loading…</p>}
      </div>
    </div>
  );
}
