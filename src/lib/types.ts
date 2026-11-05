export interface PokemonMetadata {
  id: number;
  name: string;
  species: string;
  type: string[];
  generation: number;
  rarity: string;
}

export interface PokemonColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  highlights: string[];
  locked: boolean;
}

export interface PokemonArtwork {
  official: string;
  front: string;
  back: string;
  shiny: string;
  back_shiny: string;
  front_female?: string;
  back_female?: string;
}

export interface Pokemon extends PokemonMetadata {
  height: number;
  weight: number;
  abilities: { name: string; is_hidden: boolean }[];
  baseStats: {
    hp: number;
    attack: number;
    defense: number;
    specialAttack: number;
    specialDefense: number;
    speed: number;
  };
  description: string;
  colorPalette: PokemonColorPalette;
  artwork: PokemonArtwork;
  evolution: { name: string; level: number }[];
}

export const TYPE_COLORS: Record<string, string> = {
  Normal: '#A8A878',
  Fire: '#F08030',
  Water: '#6890F0',
  Electric: '#F8D030',
  Grass: '#78C850',
  Ice: '#98D8D8',
  Fighting: '#C03028',
  Poison: '#A040A0',
  Ground: '#E0C068',
  Flying: '#A890F0',
  Psychic: '#F85888',
  Bug: '#A8B820',
  Rock: '#B8A038',
  Ghost: '#705898',
  Dragon: '#7038F8',
  Dark: '#705848',
  Steel: '#B8B8D0',
  Fairy: '#EE99AC',
};
