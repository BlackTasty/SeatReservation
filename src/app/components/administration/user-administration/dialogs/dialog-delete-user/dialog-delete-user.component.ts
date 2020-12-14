import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-dialog-delete-user',
  templateUrl: './dialog-delete-user.component.html',
  styleUrls: ['./dialog-delete-user.component.scss']
})
export class DialogDeleteUserComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<DialogDeleteUserComponent>) {
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
