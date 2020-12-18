import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/shared/model/user';
import { UserService } from 'src/app/core/services/user.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss']
})
export class GeneralComponent implements OnInit {
  public user: User;
  public isEdit: boolean = false;

  constructor(private authenticationService: AuthenticationService,
              private userService: UserService,
              private snackBar: MatSnackBar) {
    authenticationService.getCurrentUser().subscribe(user => {
      this.user = user;
    });
  }

  ngOnInit() {
  }

  public onEditConfirmClick() {
    if (this.isEdit) {
      this.userService.update(this.user).subscribe(result => {
        if (!!result) {
          this.showSnackBarMessage('Einstellungen gespeichert!');
          this.isEdit = false;
        } else {
          this.showSnackBarMessage('Fehler beim Speichern der Einstellungen!');
        }
      },
      err => {
        this.showSnackBarMessage('Unbekannter Fehler beim Speichern der Einstellungen!');
        console.log(err);
      });
    } else {
      this.isEdit = true;
    }
  }

  private showSnackBarMessage(message: string) {
    this.snackBar.open(message, '', {
      duration: 3000
    });
  }
}
