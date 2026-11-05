import { TYPE_COLORS } from '../lib/types';
import type { PokemonMetadata } from '../lib/types';
import { formatId } from '../lib/pokemon';

interface Props {
  pokemon: PokemonMetadata;
  onClick: (p: PokemonMetadata) => void;
}

export default function PokemonCard({ pokemon, onClick }: Props) {
  return (
    <button
      className="pokemon-card"
      onClick={() => onClick(pokemon)}
      aria-label={`${pokemon.name}, ${pokemon.type.join(' / ')}`}
    >
      <img
        src={`/sprites/${pokemon.id}.png`}
        alt={pokemon.name}
        loading="lazy"
        decoding="async"
      />
      <span className="pokemon-card-id">{formatId(pokemon.id)}</span>
      <span className="pokemon-card-name">{pokemon.name}</span>
      <span className="pokemon-card-types">
        {pokemon.type.map((t) => (
          <span
            key={t}
            className="type-chip"
            style={{ background: TYPE_COLORS[t] ?? '#888' }}
          >
            {t}
          </span>
        ))}
      </span>
    </button>
  );
}
