import { Component, EventEmitter, Output } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { Observable, catchError, debounceTime, distinctUntilChanged, map, switchMap, tap, of} from 'rxjs';
import { CommonModule } from '@angular/common';
import { MovieTMDB, Movie } from '@models/movie.model';
import { TmdbService } from 'app/api/tmdb.service';

const MOVIE_DETAILS: Movie[] = [];

@Component({
  standalone: true,
  selector: 'search-component',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class SearchComponent {
  constructor(private tmdbService: TmdbService) {}
  query = new FormControl<string>('', { nonNullable: true });
  loading = false;
  errorMsg: string | null = null;

  movies$: Observable<MovieTMDB[]> = this.query.valueChanges.pipe(
    debounceTime(300),
    map(q => (q || '').trim().toLowerCase()),
    distinctUntilChanged(),
    tap(() => { this.loading = true; this.errorMsg = null; }),
    switchMap(searchTerm => 
      searchTerm 
      ? this.tmdbService.searchMovies(searchTerm).pipe(
        map(response => response.map((m: any) => ({ id: m.id, title: m.title }))),
        catchError(err => { this.errorMsg = 'Error fetching movies'; return of([]); }),
      ) 
      : of([])
    ),
    tap(() => this.loading = false),
    );


  @Output() movieSelected = new EventEmitter<Movie>();
  onSelect(m: MovieTMDB) {
    if (MOVIE_DETAILS.find(md => md.id === m.id)) {
      const cachedMovie = MOVIE_DETAILS.find(md => md.id === m.id);
      this.movieSelected.emit(cachedMovie);
      return;
    }
    this.tmdbService.getMovieDetails(m.id).subscribe(response => {
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