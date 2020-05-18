import { Movie } from 'src/app/shared/model/movie';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { OverlayContainer } from '@angular/cdk/overlay';

@Component({
  selector: 'app-dialog-archive-movie',
  templateUrl: './dialog-archive-movie.component.html',
  styleUrls: ['./dialog-archive-movie.component.scss']
})
export class DialogArchiveMovieComponent implements OnInit {
  public movie: Movie;

  constructor(private dialogRef: MatDialogRef<DialogArchiveMovieComponent>,
              @Inject(MAT_DIALOG_DATA) data) {
    if (!!data) {
      this.movie = data.movie;
    }
  }

  ngOnInit() {
  }

  public onConfirmClicked(): void {
    this.dialogRef.close(true);
  }

  public onAbortClicked(): void {
    this.dialogRef.close(false);
  }

}
