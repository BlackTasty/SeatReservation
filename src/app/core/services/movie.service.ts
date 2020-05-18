import { Genre } from './../../shared/model/genre';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { host } from './host';
import { Movie } from 'src/app/shared/model/movie';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private hostName;

  constructor(private httpClient: HttpClient) {
    this.hostName = host + '/movie';
  }

  public getMovies(showArchived: boolean): Observable<Movie[]> {
    return this.httpClient.get(this.hostName + '/getmovies?showArchived=' + showArchived)
    .pipe(map((result: Movie[]) => {
      return result;
    }));
  }

  public searchMoviesByTitle(title: string): Observable<Movie> {
    return this.httpClient.get(this.hostName + '/searchmoviesbytitle?title=' + title)
    .pipe(map((result: Movie) => {
      return result;
    }));
  }

  public addMovie(movie: Movie): Observable<boolean> {
    return this.httpClient.post(this.hostName + '/addmovie', movie)
      .pipe(map((result: boolean) => {
        return result;
      }));
  }

  public archiveMovie(movieId: number): Observable<boolean> {
    return this.httpClient.get(this.hostName + '/archivemovie?movieId=' + movieId)
    .pipe(map((result: boolean) => {
      return result;
    }));
  }

  public getGenres(): Observable<Genre[]> {
    return this.httpClient.get(this.hostName + '/getgenres')
    .pipe(map((result: Genre[]) => {
      return result;
    }));
  }

  public getGenreById(genreId: number): Observable<Genre> {
    return this.httpClient.get(this.hostName + '/getgenrebyid?genreId=' + genreId)
    .pipe(map((result: Genre) => {
      return result;
    }));
  }

  public updateMovie(movie: Movie): Observable<boolean> {
    return this.httpClient.post(this.hostName + '/updatemovie', movie)
    .pipe(map((result: boolean) => {
      return result;
    }));
  }
}
