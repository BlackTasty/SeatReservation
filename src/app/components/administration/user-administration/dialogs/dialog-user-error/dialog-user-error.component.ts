import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-dialog-user-error',
  templateUrl: './dialog-user-error.component.html',
  styleUrls: ['./dialog-user-error.component.scss']
})
export class DialogUserErrorComponent implements OnInit {
  public errorTitle: string;
  public errorMessage: string;

  constructor(private dialogRef: MatDialogRef<DialogUserErrorComponent>,
              @Inject(MAT_DIALOG_DATA) data) {
    this.errorTitle = data.title;
    this.errorMessage = data.message;
  }

  ngOnInit() {
  }

  public onConfirmClicked(): void {
    this.dialogRef.close();
  }
}
