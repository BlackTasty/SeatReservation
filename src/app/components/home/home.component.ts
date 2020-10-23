import { DomSanitizer } from '@angular/platform-browser';
import { Movie } from 'src/app/shared/model/movie';
import { MovieService } from 'src/app/core/services/movie.service';
import { Component, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { TitleService } from 'src/app/core/services/title.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    dots: true,
    navSpeed: 700,
    autoplay: true,
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 1
      },
      940: {
        items: 1
      }
    }
  };

  public movies: Movie[] = [];

  constructor(private movieService: MovieService,
              public titleService: TitleService,
              public domSanitizer: DomSanitizer) {
    titleService.setToolbarTitle('Startseite', true);
  }

  ngOnInit() {
    this.movieService.getFeaturedMovies().subscribe(movies => {
      this.movies = movies;
    });
  }
}
