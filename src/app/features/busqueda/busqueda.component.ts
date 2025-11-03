import { Component, EventEmitter, Output, signal } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { Observable, Subject, map} from 'rxjs';
import { CommonModule } from '@angular/common';
import { MovieTMDB, Movie } from '@models/movie.model';
import { TmdbService } from 'app/api/tmdb.service';

const MOVIE_LIST: MovieTMDB[] = [];
const MOVIE_DETAILS: Movie[] = [];
@Component({
  standalone: true,
  selector: 'busqueda-component',
  templateUrl: './busqueda.component.html',
  styleUrls: ['./busqueda.component.css'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class BusquedaComponent {
  constructor(private tmdbService: TmdbService) {}
  private searchClick$ = new Subject<void>();
  loading = signal(false);

  movies$: Observable<MovieTMDB[]> = this.searchClick$.pipe(
    map(() => MOVIE_LIST)
    );

  async onSearch(searchTerm: string) {
    try {
      const term = searchTerm.trim().toLowerCase();
      this.loading.set(true);
      this.tmdbService.searchMovies(term).subscribe(response => {
        console.log('TMDB Search Response:', response);
        MOVIE_LIST.length = 0;
        response.forEach((m: { id: any; title: any; }) => {
          MOVIE_LIST.push({id: m.id, title: m.title});
        });
        this.searchClick$.next();
      });
    } catch (error) {
      console.error('Error occurred while searching:', error);
    } finally {
      this.loading.set(false);
    }
  }

  @Output() movieSelected = new EventEmitter<Movie>();
  onSelect(m: MovieTMDB) {
    if (MOVIE_DETAILS.find(md => md.id === m.id)) {
      const cachedMovie = MOVIE_DETAILS.find(md => md.id === m.id);
      console.log('Using cached movie details:', cachedMovie);
      this.movieSelected.emit(cachedMovie);
      return;
    }
    this.tmdbService.getMovieDetails(m.id).subscribe(response => {
      console.log('TMDB Search Response:', response);
      const movieDetails: Movie = {
        id: response.id,
        title: response.title,
        original_title: response.original_title,
        date: response.release_date,
        language: response.original_language,
        overview: response.overview,
        genres: response.genres.map((g: { name: any; }) => g.name) || [],
      };
      MOVIE_DETAILS.push(movieDetails);
      this.movieSelected.emit(movieDetails);
    });
  }

  trackById = (_: number, item: MovieTMDB) => item.id;
}