import { MovieService } from 'src/app/core/services/movie.service';
import { UserService } from './../../../../../core/services/user.service';
import { Genre } from './../../../../../shared/model/genre';
import { Component, OnInit, Inject } from '@angular/core';
import { Movie } from 'src/app/shared/model/movie';
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource } from '@angular/material';
import { CheckableGenre } from './model/checkable-genre';

@Component({
  selector: 'app-dialog-create-edit-movie',
  templateUrl: './dialog-create-edit-movie.component.html',
  styleUrls: ['./dialog-create-edit-movie.component.scss']
})
export class DialogCreateEditMovieComponent implements OnInit {
  public movie: Movie;
  public isEdit: boolean;
  public genres: MatTableDataSource<CheckableGenre>;
  public displayedColumns: string[] = [ 'checked', 'name' ];

  constructor(private dialogRef: MatDialogRef<DialogCreateEditMovieComponent>,
              private movieService: MovieService,
              @Inject(MAT_DIALOG_DATA) data) {
    this.genres = new MatTableDataSource();

    if (!!data) {
      this.isEdit = data.isEdit;

      this.movie = this.isEdit ? data.movie : new Movie(0, '', null, null, null, null, '', 0, new Date(), null, false, null);
    }
  }

  ngOnInit() {
    this.movieService.getGenres().subscribe(genres => {
      const checkableGenres: CheckableGenre[] = [];

      genres.forEach(genre => {
        checkableGenres.push(new CheckableGenre(genre,
          this.isEdit && !!this.movie.genres ? !!this.movie.genres.find(x => x.id === genre.id) : false));
      });
      this.genres.data = checkableGenres;
    });
  }

  public onConfirmClicked(): void {
    const genres: Genre[] = [];

    this.genres.data.forEach(genre => {
      if (genre.checked) {
        genres.push(genre.genre);
      }
    });

    this.movie.genres = genres;
    this.dialogRef.close(this.movie);
  }

  public onAbortClicked(): void {
    this.dialogRef.close(null);
  }
}
