# Laboratorio 
# Consumo de API's con ionic

El presente repo contiene una aplicación que consume el API de https://pokeapi.co/, con el endpoint [https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0](https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0)

La actividad por realizar es generar una aplicación que me permita buscar y mostrar Pokémons pero con todas sus características, incluida su foto, para lo cual puede consumir el endpoint: https://pokeapi.co/api/v2/pokemon/ditto , en este caso "ditto" es el nombre del Pokémon a mostrar.

Entregable: en el aula virtual deberá subir su repositorio de github donde debe detallar el proceso en el readme y adjuntar capturas de la app en ejecución. Pueden trabajar hasta 3 personas. Todos deben subir su repositorio.


----
ionic start pokeapp blank --type=angular

(NgModules)

cd pokeapp

npm install @angular/common @angular/http, puede que deba usar --force

ionic generate service services/pokemon

ionic generate page pages/pokemon-list


----
# Imagenes del Funcionamiento

<table>
<tr>
<td align="center" width="50%">
<strong>EXPLORAR</strong>
<br><br>
<img src="https://github.com/user-attachments/assets/d44bea5a-247d-4219-97b6-356e3363fbf6" alt="Captura de pantalla 1" width="240">
</td>
<td align="center" width="50%">
<strong>COMPARAR</strong>
<br><br>
<img src="https://github.com/user-attachments/assets/41575449-a58a-4259-bf8b-02085a3ec03a" alt="Captura de pantalla 2" width="240">
</td>
</tr>
<tr>
<td align="center" width="50%">
<strong>Información de Pokémon</strong>
<br><br>
<img src="https://github.com/user-attachments/assets/edd93d30-c067-497d-b714-12fee1e90b0e" alt="Captura de pantalla 3" width="180">
</td>
<td align="center" width="50%">
<strong>Comparación 2 Pokémones</strong>
<br><br>
<img src="https://github.com/user-attachments/assets/3e890b11-e67b-4e84-a5f2-bf8668c66716" alt="Captura de pantalla 4" width="180">
</td>
</tr>
</table>
