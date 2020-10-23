import { DialogScheduleMovieComponent } from './../schedule/dialogs/dialog-schedule-movie/dialog-schedule-movie.component';
import { DomSanitizer } from '@angular/platform-browser';
import { DialogCreateEditMovieComponent } from './dialogs/dialog-create-edit-movie/dialog-create-edit-movie.component';
import { MovieService } from './../../../core/services/movie.service';
import { DialogArchiveMovieComponent } from './dialogs/dialog-archive-movie/dialog-archive-movie.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog, MatDialogConfig } from '@angular/material';
import { Movie } from 'src/app/shared/model/movie';

@Component({
  selector: 'app-movie-administration',
  templateUrl: './movie-administration.component.html',
  styleUrls: ['./movie-administration.component.scss']
})
export class MovieAdministrationComponent implements OnInit {
  public displayedColumns = [ 'logo', 'title', 'length', 'genre', 'earnings', 'actions'];
  public movies: MatTableDataSource<Movie>;
  public showArchived: boolean = false;

  @ViewChild(MatPaginator) moviesPaginator: MatPaginator;
  @ViewChild(MatSort) moviesSort: MatSort;

  constructor(private movieService: MovieService,
              private dialog: MatDialog,
              public domSanitizer: DomSanitizer) {
    this.movies = new MatTableDataSource();
  }

  ngOnInit() {
    this.movies.sort = this.moviesSort;
    this.movies.paginator = this.moviesPaginator;
    this.loadMovies();
  }

  public loadMovies(): void {
    this.movieService.getMovies(this.showArchived).subscribe(
      movies => {

        this.movies.data = movies;
      }
    );
  }

  public genreListToString(movie: Movie) {
    let genreString = '';

    movie.genres.forEach(genre => {
      if (!!genre) {
        genreString += genreString === '' ? genre.name : ', ' + genre.name;
      }
    });

    return genreString;
  }

  public onScheduleMovie(movie: Movie) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      movie
    };

    const dialogRef = this.dialog.open(DialogScheduleMovieComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      result => {
        if (!!result) {

        }
      }
    );
  }

  public showCreateEditDialog(movie: Movie, isEdit: boolean) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      movie,
      isEdit
    };

    const dialogRef = this.dialog.open(DialogCreateEditMovieComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      resultMovie => {
        if (!!resultMovie) {
          if (!isEdit) {
            this.movieService.addMovie(resultMovie).subscribe(result => {
              if (result === true) {
                this.loadMovies();
              }
            });
          } else {
            this.movieService.updateMovie(resultMovie).subscribe(result => {
              if (result === true) {
                this.loadMovies();
              }
            },
            err => {
              console.log('Fehler ' + err.message);
            });
          }
        }
      }
    );
  }

  public onArchiveMovie(movie: Movie) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      movie
    };

    const dialogRef = this.dialog.open(DialogArchiveMovieComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      result => {
        if (result === true) {
          this.movieService.archiveMovie(movie.id).subscribe(result => {
            if (result === true) {
              this.loadMovies();
            }
          });
        }
      },
      // err => this.notificationService.error('Fehler ' + err.message)
    );
  }
}
