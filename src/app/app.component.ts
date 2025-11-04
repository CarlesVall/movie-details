import { Component } from '@angular/core';
import { DetailsComponent } from './features/details/details.component';
import { SearchComponent } from './features/search/search.component';
import { Movie } from '@models/movie.model';

@Component({
  selector: 'app-root',
  imports: [DetailsComponent, SearchComponent],
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
