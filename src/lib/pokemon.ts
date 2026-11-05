import indexJson from '../../public/data/pokemon/index.json';
import type { Pokemon, PokemonMetadata } from './types';

export const pokemonIndex = indexJson as PokemonMetadata[];

const cache = new Map<number, Pokemon>();

export async function getPokemonById(id: number): Promise<Pokemon | null> {
  if (cache.has(id)) return cache.get(id)!;
  try {
    const res = await fetch(`/data/pokemon/${id}.json`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const pokemon = (await res.json()) as Pokemon;
    cache.set(id, pokemon);
    return pokemon;
  } catch {
    return null;
  }
}

export function searchPokemon(query: string): PokemonMetadata[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return pokemonIndex.filter(
    (p) => p.name.toLowerCase().includes(q) || p.species.toLowerCase().includes(q)
  );
}

export function formatId(id: number): string {
  return `#${String(id).padStart(4, '0')}`;
}
