import { Component, OnInit } from '@angular/core';
import { Pokemon, PokemonService } from 'src/app/services/pokemon.service';

interface PokemonListItem {
  name: string;
  url: string;
}

@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.page.html',
  styleUrls: ['./pokemon-list.page.scss'],
})
export class PokemonListPage implements OnInit {
  pokemons: PokemonListItem[] = [];
  selectedPokemon: Pokemon | null = null;
  imagenGrande: string | null = null;
  errorMessage = '';
  loading = false;
  searchTerm: string = '';

  constructor(private pokemonService: PokemonService) {}

  ngOnInit() {
    this.fetchPokemons();
  }

  // Traer todos los pokemones para la lista inicial
  fetchPokemons() {
    this.loading = true;
    this.errorMessage = '';
    this.selectedPokemon = null;
    this.imagenGrande = null;
    this.pokemonService.getPokemons(50).subscribe({
      next: (response) => {
        this.pokemons = response.results;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching Pokémon:', error);
        this.errorMessage = 'No se pudo cargar la lista de Pokémon.';
        this.loading = false;
      },
    });
  }

  // Buscar Pokémon por nombre o id
  buscarPokemons() {
    if (!this.searchTerm || !this.searchTerm.trim()) {
      this.fetchPokemons();
      return;
    }

    this.cargarPokemon(this.searchTerm.trim().toLowerCase());
  }

  // Cargar los detalles completos de un Pokémon específico
  cargarPokemon(name: string) {
    this.loading = true;
    this.errorMessage = '';
    this.pokemonService.getPokemonDetails(name).subscribe({
      next: (pokemon) => {
        this.selectedPokemon = pokemon;
        this.imagenGrande = this.imagenes(pokemon)[0] ?? null;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al encontrar Pokémon:', error);
        this.loading = false;
        this.selectedPokemon = null;
        this.imagenGrande = null;
        this.errorMessage = `No se encontró el Pokémon "${name}".`;
      },
    });
  }

  // Obtener galería de imágenes del Pokémon
  imagenes(pokemon: Pokemon | null): string[] {
    return pokemon ? this.pokemonService.getPokemonGalery(pokemon) : [];
  }

  // Obtener animación del Pokémon
  animacion(pokemon: Pokemon | null): string | null {
    return pokemon ? this.pokemonService.getPokemonAnimatedSprite(pokemon) : null;
  }
}