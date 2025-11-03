import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DetailsComponent } from './features/detalles/detalles.component';
import { BusquedaComponent } from './features/busqueda/busqueda.component';
import { Movie } from '@models/movie.model';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, DetailsComponent, BusquedaComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Listado de Peliculas';
  selected: Movie | null = null;
  onMovieSelected(movie: Movie) {
    this.selected = movie;
  }
}
