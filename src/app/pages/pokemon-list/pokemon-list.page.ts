import { Component, OnInit } from '@angular/core';
import { PokemonService } from 'src/app/services/pokemon.service';
@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.page.html',
  styleUrls: ['./pokemon-list.page.scss'],
})
export class PokemonListPage implements OnInit {
  pokemons: any[] = [];
  loading = false;
  searchTerm: string = '';
  constructor(private pokemonService: PokemonService) {}

  ngOnInit() {
    this.fetchPokemons();
    
  }
  // Traer todos los pokemones
  fetchPokemons() {
    this.loading = true;
    this.pokemonService.getPokemons(50).subscribe({
      next: (response) => {
        this.pokemons = response.results;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching Pokémon:', error);
        this.loading = false;
      },
    });
  }

  //Buscar Pokemones
  buscarPokemons(){
    if(!this.searchTerm.trim()){
      this.fetchPokemons();
      return;
    }
    this.loading = true;
    this.pokemonService.getPokemonDetails(this.searchTerm.toLowerCase()).subscribe({
      next: (response) => {
        this.pokemons = [response];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al encontrar Pokémon:', error);
        this.loading = false;
        this.pokemons = [];
      },
    });
  }
}