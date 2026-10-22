import { Component, OnInit } from '@angular/core';
// Importamos el servicio y la interfaz del Pokémon
import { Pokemon, PokemonService } from 'src/app/services/pokemon.service';
// Importamos forkJoin de rxjs para realizar peticiones simultáneas de forma sencilla
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
  // Lista de Pokémon mostrados en la lista principal
  pokemons: PokemonListItem[] = [];
  // Pokémon seleccionado actualmente con solo sus detalles generales
  selectedPokemon: Pokemon | null = null;
  // Imagen grande seleccionada de la galería
  imagenGrande: string | null = null;
  // Mensaje de error para la vista de lista/detalles
  errorMessage = '';
  // Indicador de carga para la vista de lista/detalles
  loading = false;
  // Texto ingresado en la barra de búsqueda
  searchTerm: string = '';

  // Controla la pestaña visible: 'lista' para explorar o 'comparar' para comparar dos Pokémon
  vistaActual: string = 'lista';

  // Nombre o número ingresado para el primer Pokémon a comparar
  compararNombre1: string = '';
  // Nombre o número ingresado para el segundo Pokémon a comparar
  compararNombre2: string = '';
  // Detalles generales del primer Pokémon comparado
  pokemon1: Pokemon | null = null;
  // Detalles generales del segundo Pokémon comparado
  pokemon2: Pokemon | null = null;
  // Mensaje de error para la sección de comparación
  errorComparacion: string = '';
  // Indicador de carga durante la comparación
  cargandoComparacion: boolean = false;

  // Inyección del servicio de Pokémon
  constructor(private pokemonService: PokemonService) {}

  // Se ejecuta al inicializar el componente
  ngOnInit() {
    // Carga la lista inicial de Pokémon
    this.fetchPokemons();
  }

  // Traer todos los pokemones para la lista inicial
  fetchPokemons() {
    // Activa la bandera de carga
    this.loading = true;
    // Limpia mensajes de error previos
    this.errorMessage = '';
    // Resetea el Pokémon seleccionado
    this.selectedPokemon = null;
    // Resetea la imagen grande
    this.imagenGrande = null;
    // Llama al servicio pidiendo los primeros 50 Pokémon
    this.pokemonService.getPokemons(50).subscribe({
      // Cuando la respuesta es exitosa
      next: (response) => {
        // Asigna la lista obtenida
        this.pokemons = response.results;
        // Desactiva la bandera de carga
        this.loading = false;
      },
      // Si ocurre un error al traer la lista
      error: (error) => {
        // Imprime el error en la consola
        console.error('Error fetching Pokémon:', error);
        // Asigna el mensaje de error para el usuario
        this.errorMessage = 'No se pudo cargar la lista de Pokémon.';
        // Desactiva la bandera de carga
        this.loading = false;
      },
    });
  }

  // Buscar Pokémon por nombre o ID
  buscarPokemons() {
    // Si el término está vacío, recarga la lista inicial
    if (!this.searchTerm || !this.searchTerm.trim()) {
      // Carga la lista inicial
      this.fetchPokemons();
      // Detiene la ejecución
      return;
    }

    // Carga los detalles del Pokémon buscado en minúsculas y sin espacios
    this.cargarPokemon(this.searchTerm.trim().toLowerCase());
  }

  // Función para filtrar y limitar los datos a solo los detalles generales
  obtenerDetallesGenerales(pokemon: any): Pokemon {
    // Retornamos un objeto únicamente con los campos generales
    return {
      // Número o ID del Pokémon
      id: pokemon.id,
      // Nombre del Pokémon
      name: pokemon.name,
      // Altura del Pokémon
      height: pokemon.height,
      // Peso del Pokémon
      weight: pokemon.weight,
      // Tipos elementales del Pokémon
      types: pokemon.types,
      // Habilidades básicas del Pokémon
      abilities: pokemon.abilities,
      // Estadísticas base (hp, ataque, defensa, etc.)
      stats: pokemon.stats,
      // Sprites para las imágenes y galería
      sprites: pokemon.sprites,
      // Sonidos del Pokémon
      cries: pokemon.cries,
    };
  }

  // Cargar los detalles limitados a solo lo general de un Pokémon específico
  cargarPokemon(name: string) {
    // Activa el estado de carga
    this.loading = true;
    // Limpia el mensaje de error anterior
    this.errorMessage = '';
    // Consulta los detalles del Pokémon en la API
    this.pokemonService.getPokemonDetails(name).subscribe({
      // Si la consulta fue exitosa
      next: (pokemon) => {
        // Limita los datos asignando exclusivamente los detalles generales
        this.selectedPokemon = this.obtenerDetallesGenerales(pokemon);
        // Selecciona la primera imagen disponible para mostrar en grande
        this.imagenGrande = this.imagenes(this.selectedPokemon)[0] ?? null;
        // Desactiva el estado de carga
        this.loading = false;
      },
      // Si ocurre un error o el Pokémon no existe
      error: (error) => {
        // Muestra el error en la consola
        console.error('Error al encontrar Pokémon:', error);
        // Desactiva el estado de carga
        this.loading = false;
        // Limpia el Pokémon seleccionado
        this.selectedPokemon = null;
        // Limpia la imagen grande
        this.imagenGrande = null;
        // Establece el mensaje de error descriptivo
        this.errorMessage = `No se encontró el Pokémon "${name}".`;
      },
    });
  }

  // Obtener galería de imágenes del Pokémon
  imagenes(pokemon: Pokemon | null): string[] {
    // Retorna la galería si existe el Pokémon, o un arreglo vacío si no
    return pokemon ? this.pokemonService.getPokemonGalery(pokemon) : [];
  }

  // Obtener animación del Pokémon
  animacion(pokemon: Pokemon | null): string | null {
    // Retorna la animación si existe el Pokémon, o null si no
    return pokemon ? this.pokemonService.getPokemonAnimatedSprite(pokemon) : null;
  }

  // ================= MÉTODOS PARA LA COMPARACIÓN ENTRE DOS POKÉMON =================

  // Realiza la comparación entre los dos Pokémon indicados
  compararPokemons() {
    // Valida que se hayan escrito ambos nombres o números
    if (!this.compararNombre1.trim() || !this.compararNombre2.trim()) {
      // Asigna un mensaje de error si falta alguno
      this.errorComparacion = 'Por favor ingresa los dos Pokémon a comparar.';
      // Detiene la ejecución
      return;
    }

    // Activa la bandera de carga para la comparación
    this.cargandoComparacion = true;
    // Limpia mensajes de error previos
    this.errorComparacion = '';
    // Limpia los datos del primer Pokémon
    this.pokemon1 = null;
    // Limpia los datos del segundo Pokémon
    this.pokemon2 = null;

    // Ejecuta las dos peticiones simultáneamente de forma sencilla
    forkJoin({
      // Petición para obtener datos del primer Pokémon
      p1: this.pokemonService.getPokemonDetails(this.compararNombre1.trim().toLowerCase()),
      // Petición para obtener datos del segundo Pokémon
      p2: this.pokemonService.getPokemonDetails(this.compararNombre2.trim().toLowerCase()),
    }).subscribe({
      // Cuando ambas peticiones responden con éxito
      next: (resultado) => {
        // Guarda solo los detalles generales del primer Pokémon
        this.pokemon1 = this.obtenerDetallesGenerales(resultado.p1);
        // Guarda solo los detalles generales del segundo Pokémon
        this.pokemon2 = this.obtenerDetallesGenerales(resultado.p2);
        // Desactiva el indicador de carga
        this.cargandoComparacion = false;
      },
      // En caso de que alguno de los dos Pokémon no exista o falle
      error: () => {
        // Desactiva el indicador de carga
        this.cargandoComparacion = false;
        // Muestra mensaje indicando el error al usuario
        this.errorComparacion = 'No se encontró uno o ambos Pokémon. Verifica los nombres o números.';
      },
    });
  }

  // Obtiene el valor numérico de una estadística específica (ej: 'attack', 'defense', 'hp', 'speed')
  obtenerStat(pokemon: Pokemon | null, nombreStat: string): number {
    // Retorna 0 si el Pokémon o su arreglo de estadísticas no existe
    if (!pokemon || !pokemon.stats) return 0;
    // Busca la estadística que coincida con el nombre solicitado
    const statEncontrada = pokemon.stats.find((s) => s.stat.name === nombreStat);
    // Retorna el valor base de la estadística encontrada o 0 si no existe
    return statEncontrada ? statEncontrada.base_stat : 0;
  }

  // Calcula la suma total de las estadísticas base de un Pokémon
  obtenerTotalStats(pokemon: Pokemon | null): number {
    // Retorna 0 si el Pokémon o sus estadísticas no existen
    if (!pokemon || !pokemon.stats) return 0;
    // Suma todos los valores de las estadísticas base
    return pokemon.stats.reduce((acumulado, s) => acumulado + s.base_stat, 0);
  }

  // Limpia los campos y resultados de la sección de comparación
  limpiarComparacion() {
    // Limpia el nombre del primer Pokémon
    this.compararNombre1 = '';
    // Limpia el nombre del segundo Pokémon
    this.compararNombre2 = '';
    // Limpia el objeto del primer Pokémon
    this.pokemon1 = null;
    // Limpia el objeto del segundo Pokémon
    this.pokemon2 = null;
    // Limpia el mensaje de error de la comparación
    this.errorComparacion = '';
  }

  // Facilita iniciar la comparación llevando el Pokémon actual al comparador
  iniciarComparacionCon(nombre: string) {
    // Asigna el nombre al primer Pokémon del comparador
    this.compararNombre1 = nombre;
    // Cambia la pestaña a la sección de comparar
    this.vistaActual = 'comparar';
  }
}