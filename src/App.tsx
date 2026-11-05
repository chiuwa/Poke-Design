import { useMemo, useState, useCallback } from 'react';
import { pokemonIndex, searchPokemon } from './lib/pokemon';
import type { PokemonMetadata } from './lib/types';
import PokemonCard from './components/PokemonCard';
import PokemonDetail from './components/PokemonDetail';
import './App.css';

const PAGE_SIZE = 60;

function App() {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<PokemonMetadata | null>(null);
  const [visible, setVisible] = useState(PAGE_SIZE);

  const filtered = useMemo(
    () => (query.trim() ? searchPokemon(query) : pokemonIndex),
    [query]
  );
  const shown = filtered.slice(0, visible);

  const onSelect = useCallback((p: PokemonMetadata) => setSelected(p), []);
  const onQuery = useCallback((v: string) => {
    setQuery(v);
    setVisible(PAGE_SIZE);
  }, []);

  return (
    <div className="app">
      <header className="header">
        <div className="header-brand">
          <span className="header-icon" aria-hidden="true">🎨</span>
          <h1>PokémonPalette</h1>
        </div>
        <input
          className="search"
          type="search"
          name="search"
          placeholder="Search Pokémon…"
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          aria-label="Search Pokémon"
        />
        <span className="result-count">
          {filtered.length} Pokémon{query && ` matching "${query}"`}
        </span>
      </header>

      {query === '' && (
        <section className="hero">
          <h2 className="hero-title">
            Beautiful color palettes
            <br />
            from every Pokémon
          </h2>
          <p className="hero-subtitle">
            Browse over 1,000 Pokémon and discover the dominant color
            combinations extracted from their sprites — perfect for your next
            design project.
          </p>
        </section>
      )}

      <main className="grid">
        {shown.map((p) => (
          <PokemonCard key={p.id} pokemon={p} onClick={onSelect} />
        ))}
      </main>

      {filtered.length === 0 && (
        <div className="empty-state">
          <span className="empty-state-icon" aria-hidden="true">🔍</span>
          <h3>No Pokémon found</h3>
          <p>Try searching by name or species — for example, "pika" or "flame".</p>
        </div>
      )}

      {visible < filtered.length && (
        <button
          className="load-more"
          onClick={() => setVisible((v) => v + PAGE_SIZE)}
        >
          Load more
        </button>
      )}

      {query === '' && (
        <section className="agent-section">
          <h2>Built for AI Agents</h2>
          <p>
            Every palette on this site is exposed as a <strong>WebMCP</strong> tool.
            Ask your AI agent to grab a Pokémon palette and pair it with a design
            skill — Apple Design, Emil Kowalski — to design your next web page.
          </p>
          <div className="agent-pills">
            <span className="agent-pill">
              <code>list_pokemon</code> Search the library
            </span>
            <span className="agent-pill">
              <code>get_pokemon_palette</code> Extract a palette
            </span>
            <span className="agent-pill">
              <code>get_design_skill</code> Get design principles
            </span>
            <span className="agent-pill">
              <code>generate_design_brief</code> Compose a full design brief
            </span>
          </div>
        </section>
      )}

      {selected && (
        <PokemonDetail pokemon={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}

export default App;
