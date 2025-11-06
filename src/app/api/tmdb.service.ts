import { Injectable, inject } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { tmdb } from "@environments/environment";
import { map } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class TmdbService {
    private http = inject(HttpClient);
    private baseUrl = tmdb.baseUrl;

    searchMovies(query: string, page: number = 1) {
        if(!query || query.trim() === '') {
            throw new Error('Query parameter is required');
        }
        const url = `/search/movie`;
        let params = new HttpParams()
            .set('language', 'es-ES')
            .set('query', query)
            .set('page', page.toString());
        const response = this.http.get<any>(url, {
            params,
        });
        if (!response) {
            throw new Error('No results found');
        }
        return response.pipe(map(response => response.results));
    }

    getMovieDetails(movieId: number) {
        if (!movieId) {
            throw new Error('Movie ID is required');
        }
        const url = `/movie/${movieId}`;
        let params = new HttpParams()
            .set('language', 'es-ES');
        const response = this.http.get<any>(url, {
            params,
        });
        if (!response) {
            throw new Error('Movie not found');
        }
        return response;
    }
}