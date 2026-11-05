import { useMemo, useState, useCallback } from 'react';
import { pokemonIndex, searchPokemon } from './lib/pokemon';
import type { PokemonMetadata } from './lib/types';
import PokemonCard from './components/PokemonCard';
import PokemonDetail from './components/PokemonDetail';
import ReconstructionStage from './components/ReconstructionStage';
import AgentBanner from './components/AgentBanner';
import './App.css';

const PAGE_SIZE = 48;
const FILTERS = ['All', 'Fire', 'Water', 'Grass', 'Electric', 'Psychic', 'Fairy', 'Dragon'];

function App() {
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [selected, setSelected] = useState<PokemonMetadata | null>(null);
  const [visible, setVisible] = useState(PAGE_SIZE);

  const filtered = useMemo(() => {
    let list = query.trim() ? searchPokemon(query) : pokemonIndex;
    if (typeFilter !== 'All') {
      list = list.filter((p) => p.type.includes(typeFilter));
    }
    return list;
  }, [query, typeFilter]);
  const shown = filtered.slice(0, visible);

  const onSelect = useCallback((p: PokemonMetadata) => setSelected(p), []);
  const onQuery = useCallback((v: string) => {
    setQuery(v);
    setVisible(PAGE_SIZE);
  }, []);
  const onFilter = useCallback((v: string) => {
    setTypeFilter(v);
    setVisible(PAGE_SIZE);
  }, []);

  const colorPrompt = `Use the Jigglypuff color palette from pokemon_palette (#ffaca4, #e67383, #ec5f6d), apply the Apple Design skill from design_skill, and design a warm landing page. Return DESIGN.md, CSS variables and a React component.`;
  const [copiedColorPrompt, setCopiedColorPrompt] = useState(false);
  const copyColorPrompt = () => {
    navigator.clipboard.writeText(colorPrompt).then(() => {
      setCopiedColorPrompt(true);
      window.setTimeout(() => setCopiedColorPrompt(false), 1400);
    }).catch(() => undefined);
  };

  return (
    <div className="site-shell">
      <header className="masthead">
        <a className="wordmark" href="#top" aria-label="Poké Palette Atelier home">
          <span className="wordmark-mark" aria-hidden="true">
            <svg viewBox="0 0 40 40" width="30" height="30">
              <path d="M4 21a16 16 0 0 1 32 0" fill="#c23b2b" stroke="#1a1814" strokeWidth="2.2" />
              <rect x="4" y="21" width="32" height="4" fill="#1a1814" />
              <circle cx="20" cy="23" r="5.2" fill="#faf8f2" stroke="#1a1814" strokeWidth="2.2" />
              <circle cx="20" cy="23" r="1.8" fill="#1a1814" />
              <rect x="10" y="29" width="20" height="3" fill="#1785b5" />
              <rect x="10" y="34" width="8" height="2" fill="#ffaca4" />
              <rect x="20" y="34" width="6" height="2" fill="#e67383" />
              <rect x="28" y="34" width="2" height="2" fill="#2649a8" />
            </svg>
          </span>
          <span className="wordmark-name">Poké Palette Atelier</span>
        </a>
        <nav className="masthead-nav" aria-label="Primary">
          <a href="#connect">Connect</a>
          <a href="#formula">Formula</a>
          <a href="#specimens">Specimens</a>
        </nav>
        <div className="masthead-meta">
          <span>Design materials for agents</span>
        </div>
      </header>

      <main id="top">
        <section className="hero-editorial">
          <div className="hero-copy">
            <p className="eyebrow">Issue 001 — AI-readable design materials</p>
            <h1>
              <span>One sentence.</span>
              <span>A finished</span>
              <span><em>design direction.</em></span>
            </h1>
            <p className="hero-dek">
              Combine <code>pokemon_palette</code> + <code>design_skill</code> through WebMCP.
              Your agent reads the palette, applies a design language, and reconstructs the interface.
            </p>
            <div className="hero-actions">
              <a className="primary-action" href="#connect">Connect an agent</a>
              <a className="text-action" href="#specimens">Browse 1,025 specimens <span>↘</span></a>
            </div>
            <div className="color-prompt-sample">
              <div className="color-prompt-head">
                <span>Copy &amp; paste color prompt</span>
                <button type="button" onClick={copyColorPrompt}>
                  {copiedColorPrompt ? '✓ Copied' : 'Copy prompt'}
                </button>
              </div>
              <p>{colorPrompt}</p>
              <div className="color-prompt-swatches" aria-hidden="true">
                <i style={{ background: '#ffaca4' }} />
                <i style={{ background: '#e67383' }} />
                <i style={{ background: '#ec5f6d' }} />
                <i style={{ background: '#dd4655' }} />
                <i style={{ background: '#ffffff' }} />
                <i style={{ background: '#1785b5' }} />
              </div>
            </div>
            <div className="hero-annotation">
              <span className="annotation-line" />
              <p>Based on WebMCP · W3C Community Group draft<br />No backend, no API key, no screenshot scraping.</p>
            </div>
          </div>
          <div className="hero-stage">
            <ReconstructionStage />
          </div>
        </section>

        <AgentBanner />

        <section className="formula-section" id="formula">
          <div className="section-index">02 / The formula</div>
          <div className="formula-grid">
            <div className="formula-intro">
              <h2>A design library<br />made for sentence-sized briefs.</h2>
              <p>
                Pokemon palettes are the color source. Expert skills are the judgment.
                WebMCP is the handoff. Ask once; your agent assembles the rest.
              </p>
            </div>
            <div className="formula-steps">
              <article><span>01</span><h3>pokemon_palette</h3><p>1,025 pre-extracted sprite palettes, each with primary, secondary, accent and highlights.</p></article>
              <article><span>02</span><h3>design_skill</h3><p>Apple Design and Emil Kowalski principles: type, spacing, motion, materials, craft.</p></article>
              <article><span>03</span><h3>design_brief</h3><p>A single structured output: CSS variables, type scale, motion curves, layout and accessibility.</p></article>
            </div>
          </div>
        </section>

        <section className="specimens-section" id="specimens">
          <div className="section-index">03 / Palette specimens</div>
          <div className="specimens-head">
            <div>
              <p className="eyebrow">The archive</p>
              <h2>Choose a color origin.</h2>
              <p>Every card is a structured design token set exposed to your agent. Open one to see its palette applied live.</p>
            </div>
            <div className="archive-count"><b>{filtered.length}</b><span>specimens<br />in view</span></div>
          </div>

          <div className="archive-controls">
            <label className="search-field">
              <span className="visually-hidden">Search specimens</span>
              <input
                type="search"
                name="search"
                placeholder="Search by name or species…"
                value={query}
                onChange={(e) => onQuery(e.target.value)}
              />
              <span aria-hidden="true">⌕</span>
            </label>
            <div className="filter-row" aria-label="Filter by type">
              {FILTERS.map((f) => (
                <button key={f} type="button" className={typeFilter === f ? 'active' : ''} onClick={() => onFilter(f)}>{f}</button>
              ))}
            </div>
          </div>

          <div className="specimen-grid">
            {shown.map((p, i) => (
              <PokemonCard key={p.id} pokemon={p} index={i} onClick={onSelect} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="empty-state"><h3>No specimen found</h3><p>Try “pika”, “flame”, or clear the type filter.</p></div>
          )}

          {visible < filtered.length && (
            <button className="load-more" type="button" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
              Show more specimens <span>↓</span>
            </button>
          )}
        </section>

        <section className="tool-ledger">
          <div className="section-index">04 / Tool ledger</div>
          <div className="ledger-row"><code>list_pokemon</code><span>Search the archive by name, species, type, generation or rarity.</span><em>read</em></div>
          <div className="ledger-row"><code>pokemon_palette</code><span>Return a complete palette and sprite reference for one Pokémon.</span><em>read</em></div>
          <div className="ledger-row"><code>design_skill</code><span>Return distilled Apple Design or Emil Kowalski design engineering rules.</span><em>read</em></div>
          <div className="ledger-row"><code>design_brief</code><span>Fuse palette + skill into CSS tokens, typography, motion and layout guidance.</span><em>compose</em></div>
        </section>
      </main>

      {selected && <PokemonDetail pokemon={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

export default App;
