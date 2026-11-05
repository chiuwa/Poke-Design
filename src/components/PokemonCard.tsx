import { TYPE_COLORS } from '../lib/types';
import type { PokemonMetadata } from '../lib/types';
import { formatId } from '../lib/pokemon';

interface Props {
  pokemon: PokemonMetadata;
  index: number;
  onClick: (p: PokemonMetadata) => void;
}

const TYPE_INITIALS: Record<string, string> = {
  Fire: 'FR', Water: 'WT', Grass: 'GR', Electric: 'EL', Psychic: 'PS',
  Fairy: 'FA', Dragon: 'DR', Normal: 'NR', Bug: 'BG', Poison: 'PO',
  Ground: 'GD', Flying: 'FL', Fighting: 'FG', Rock: 'RK', Ghost: 'GH',
  Ice: 'IC', Steel: 'ST', Dark: 'DK',
};

export default function PokemonCard({ pokemon, index, onClick }: Props) {
  const mainType = pokemon.type[0] ?? 'Normal';
  const typeColor = TYPE_COLORS[mainType] ?? '#8a8172';

  return (
    <button
      type="button"
      className="specimen-card"
      onClick={() => onClick(pokemon)}
      style={{ '--card-accent': typeColor, '--card-delay': `${Math.min(index, 11) * 35}ms` } as React.CSSProperties}
      aria-label={`Open ${pokemon.name} color palette specimen`}
    >
      <span className="specimen-number">{formatId(pokemon.id)}</span>
      <span className="specimen-type-code">{TYPE_INITIALS[mainType] ?? mainType.slice(0, 2).toUpperCase()}</span>
      <span className="specimen-image">
        <img src={`/sprites/${pokemon.id}.png`} alt="" loading="lazy" decoding="async" />
      </span>
      <span className="specimen-name">{pokemon.name}</span>
      <span className="specimen-species">{pokemon.species}</span>
      <span className="specimen-types">
        {pokemon.type.map((t) => <i key={t} style={{ background: TYPE_COLORS[t] ?? '#8a8172' }} title={t} />)}
      </span>
      <span className="specimen-open">Open specimen <i>↗</i></span>
    </button>
  );
}
