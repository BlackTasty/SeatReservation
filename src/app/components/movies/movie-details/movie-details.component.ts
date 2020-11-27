import { TitleService } from './../../../core/services/title.service';
import { MovieService } from './../../../core/services/movie.service';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Movie } from 'src/app/shared/model/movie';

let apiLoaded = false;

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.scss']
})
export class MovieDetailsComponent implements OnInit {
  public movie: Movie;
  public isYoutubeVideo: boolean = false;
  public youtubeVideoId: string;

  constructor(private route: ActivatedRoute,
              private movieService: MovieService,
              private titleService: TitleService,
              public domSanitizer: DomSanitizer) {
    titleService.setToolbarTitle('Film-Details', true);
    this.route.params.subscribe(params => {
      const movieId: number = params['movieid'];
      movieService.getMovieById(movieId).subscribe(movie => {
        this.movie = movie;
        titleService.addBreadcrumb(movie.title, '');

        if (!!movie.trailer && movie.trailer.includes('https://www.youtube.com/watch?v=')) {
          this.isYoutubeVideo = true;
          this.youtubeVideoId = movie.trailer.replace('https://www.youtube.com/watch?v=', '');
        }
      });
    });
  }

  ngOnInit() {
    if (!apiLoaded) {
      // This code loads the IFrame Player API code asynchronously, according to the instructions at
      // https://developers.google.com/youtube/iframe_api_reference#Getting_Started
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);
      apiLoaded = true;
    }
  }

  public getGenres(): string {
    if (!!!this.movie) {
      return '';
    }

    let genres = '';
    this.movie.genres.forEach(genre => {
      genres += genres === '' ? genre.name : ', ' + genre.name;
    });

    return genres;
  }

  public getStudios(): string {
    if (!!!this.movie) {
      return '';
    }

    let studios = '';
    this.movie.studios.forEach(studio => {
      studios += studios === '' ? studio.name : ', ' + studio.name;
    });

    return studios;
  }

  public getActors(): string {
    if (!!!this.movie) {
      return '';
    }

    let actors = '';
    this.movie.actors.forEach(actor => {
      actors += actors === '' ? actor.name : ', ' + actor.name;
    });

    return actors;
  }

  public getDirectors(): string {
    if (!!!this.movie) {
      return '';
    }

    let directors = '';
    this.movie.directors.forEach(director => {
      directors += directors === '' ? director.name : ', ' + director.name;
    });

    return directors;
  }
}
