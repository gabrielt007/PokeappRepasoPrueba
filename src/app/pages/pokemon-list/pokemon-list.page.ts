import { Component, OnInit } from '@angular/core';
import { Pokemon, PokemonService } from 'src/app/services/pokemon.service';
import { forkJoin } from 'rxjs';

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

  vistaActual: string = 'lista';

  compararNombre1: string = '';
  compararNombre2: string = '';
  pokemon1: Pokemon | null = null;
  pokemon2: Pokemon | null = null;
  errorComparacion: string = '';
  cargandoComparacion: boolean = false;

  constructor(private pokemonService: PokemonService) {}

  ngOnInit() {
    this.fetchPokemons();
  }

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

  // Buscar Pokémon por nombre o ID
  buscarPokemons() {
    if (!this.searchTerm || !this.searchTerm.trim()) {
      this.fetchPokemons();
      return;
    }

    this.cargarPokemon(this.searchTerm.trim().toLowerCase());
  }

  obtenerDetallesGenerales(pokemon: any): Pokemon {
    return {
      id: pokemon.id,
      name: pokemon.name,
      height: pokemon.height,
      weight: pokemon.weight,
      types: pokemon.types,
      abilities: pokemon.abilities,
      stats: pokemon.stats,
      sprites: pokemon.sprites,
      cries: pokemon.cries,
    };
  }

  cargarPokemon(name: string) {
    this.loading = true;
    this.errorMessage = '';
    this.pokemonService.getPokemonDetails(name).subscribe({
      next: (pokemon) => {
        this.selectedPokemon = this.obtenerDetallesGenerales(pokemon);
        this.imagenGrande = this.imagenes(this.selectedPokemon)[0] ?? null;
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

  // Realiza la comparación entre los dos Pokémon indicados
  compararPokemons() {
    if (!this.compararNombre1.trim() || !this.compararNombre2.trim()) {
      this.errorComparacion = 'Por favor ingresa los dos Pokémon a comparar.';
      return;
    }

    this.cargandoComparacion = true;
    this.errorComparacion = '';
    this.pokemon1 = null;
    this.pokemon2 = null;

    // Ejecuta las dos peticiones simultáneamente de forma sencilla
    forkJoin({
      p1: this.pokemonService.getPokemonDetails(this.compararNombre1.trim().toLowerCase()),
      p2: this.pokemonService.getPokemonDetails(this.compararNombre2.trim().toLowerCase()),
    }).subscribe({
      next: (resultado) => {
        this.pokemon1 = this.obtenerDetallesGenerales(resultado.p1);
        this.pokemon2 = this.obtenerDetallesGenerales(resultado.p2);
        this.cargandoComparacion = false;
      },
      error: () => {
        this.cargandoComparacion = false;
        this.errorComparacion = 'No se encontró uno o ambos Pokémon. Verifica los nombres o números.';
      },
    });
  }

  // Obtiene el valor numérico de una estadística específica
  obtenerStat(pokemon: Pokemon | null, nombreStat: string): number {
    if (!pokemon || !pokemon.stats) return 0;
    const statEncontrada = pokemon.stats.find((s) => s.stat.name === nombreStat);
    return statEncontrada ? statEncontrada.base_stat : 0;
  }

  // Calcula la suma total de las estadísticas base de un Pokémon
  obtenerTotalStats(pokemon: Pokemon | null): number {
    if (!pokemon || !pokemon.stats) return 0;
    return pokemon.stats.reduce((acumulado, s) => acumulado + s.base_stat, 0);
  }

  // Limpia los campos y resultados de la sección de comparación
  limpiarComparacion() {
    this.compararNombre1 = '';
    this.compararNombre2 = '';
    this.pokemon1 = null;
    this.pokemon2 = null;
    this.errorComparacion = '';
  }

  // Facilita iniciar la comparación llevando el Pokémon actual al comparador
  iniciarComparacionCon(nombre: string) {
    this.compararNombre1 = nombre;
    this.vistaActual = 'comparar';
  }
}