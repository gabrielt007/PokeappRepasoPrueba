import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Pokemon {
  id: number; name: string; height: number; weight: number;
  types: { slot: number; type: { name: string } }[];
  abilities: { ability: { name: string } }[];
  stats: { base_stat: number; stat: { name: string } }[];
  sprites: {
    front_default: string | null; 
    back_default: string | null; 
    front_shiny: string | null; 
    back_shiny: string | null;
    other?: { 'official-artwork'?: { 
      front_default?: string | null; 
      front_shiny?: string | null 
    }; 
    home?: { 
      front_default?: string | null; 
      front_shiny?: string | null 
    }; showdown?: { 
      front_default?: string | null; 
      back_default?: string | null 
    } 
  };
    versions?: {
      'generation-v'?: {
        'black-white'?: {
          animated?: {
            front_default?: string | null;
            back_default?: string | null;
            front_shiny?: string | null;
            back_shiny?: string | null;
          };
        };
      };
    };
  };
  cries?: { latest?: string | null; legacy?: string | null };
}

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  private apiUrl = 'https://pokeapi.co/api/v2';

  constructor(private http: HttpClient) { }

  // Obtener la lista de Pokémon
  getPokemons(limit: number = 5, offset: number = 0): Observable<any> {
    return this.http.get(`${this.apiUrl}/pokemon?limit=${limit}&offset=${offset}`);
  }

  // Obtener detalles de un Pokémon por nombre o ID
  getPokemonDetails(nameOrId: string): Observable<Pokemon> {
    return this.http.get<Pokemon>(`${this.apiUrl}/pokemon/${nameOrId}`);
  }
  // Obtener imagenes de un Pokemon
  getPokemonGalery(pokemon: Pokemon): string[] {
    const otherSprites = pokemon.sprites?.other;
    const sources = [
      otherSprites?.['official-artwork']?.front_default,
      otherSprites?.['official-artwork']?.front_shiny,
      otherSprites?.home?.front_default,
      otherSprites?.home?.front_shiny,
      pokemon.sprites?.front_default,
      pokemon.sprites?.back_default,
      pokemon.sprites?.front_shiny,
      pokemon.sprites?.back_shiny,
    ];

    return [...new Set(sources.filter((source): source is string => !!source))].slice(0, 5);
  }

  getPokemonAnimatedSprite(pokemon: Pokemon): string | null {
    return pokemon.sprites?.versions?.['generation-v']?.['black-white']?.animated?.front_default ?? null;
  }
}
