import { AuthenticationService } from './../../../core/services/authentication.service';
import { DialogCreateEditUserComponent } from './dialogs/dialog-create-edit-user/dialog-create-edit-user.component';
import { User } from './../../../shared/model/user';
import { UserService } from './../../../core/services/user.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { DialogDeleteUserComponent } from './dialogs/dialog-delete-user/dialog-delete-user.component';
import { DialogUserErrorComponent } from './dialogs/dialog-user-error/dialog-user-error.component';

@Component({
  selector: 'app-user-administration',
  templateUrl: './user-administration.component.html',
  styleUrls: ['./user-administration.component.scss']
})
export class UserAdministrationComponent implements OnInit {
  public displayedColumns = [ 'avatar', 'username', 'lastName', 'firstName', 'registerDate', 'email', 'phone', 'actions'];
  public users: MatTableDataSource<User>;

  @ViewChild(MatPaginator) usersPaginator: MatPaginator;
  @ViewChild(MatSort) usersSort: MatSort;

  public currentUserId = 0;

  constructor(private userService: UserService,
              private authenticationService: AuthenticationService,
              private dialog: MatDialog,
              public domSanitizer: DomSanitizer) {
    this.users = new MatTableDataSource();
    this.currentUserId = authenticationService.getCurrentUserId();
  }

  ngOnInit() {
    this.users.sort = this.usersSort;
    this.users.paginator = this.usersPaginator;
    this.loadUsers();
  }

  public loadUsers(): void {
    this.userService.get().subscribe(
      users => {

        this.users.data = users;
      }
    );
  }

  public showCreateEditDialog(user: User, isEdit: boolean) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      user,
      isEdit
    };

    const dialogRef = this.dialog.open(DialogCreateEditUserComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      data => {
        if (!!data) {
          if (!isEdit) {
            this.userService.add(data.user).subscribe(userId => {
              if (userId > 0) {
                data.permissions.userId = userId;
                this.userService.setPermissions(data.permissions).subscribe(
                  result => {
                    if (result) {
                      this.loadUsers();
                    }
                  }
                );
              } else {
                const errorDialogConfig = new MatDialogConfig();

                errorDialogConfig.autoFocus = true;
                if (userId === -2) {
                  errorDialogConfig.data = {
                    title: 'Benutzer existiert bereits!',
                    message: 'Ein Benutzer mit diesem Namen existiert bereits und kann daher nicht hinzugefügt werden!'
                  };
                } else {
                  errorDialogConfig.data = {
                    title: 'Unbekannter Fehler!',
                    message: 'Ein unbekannter Fehler ist während dem Hinzufügen eines Benutzers aufgetreten! (Fehlercode: ' + userId + ')'
                  };
                }

                this.dialog.open(DialogUserErrorComponent, errorDialogConfig);
              }
            });
          } else {
            this.userService.update(data.user).subscribe(result => {
              if (result) {
                this.userService.setPermissions(data.permissions).subscribe(
                  result => {
                    if (result) {
                      this.loadUsers();
                    }
                  }
                );
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

  public onRemoveUser(id: number) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;

    const dialogRef = this.dialog.open(DialogDeleteUserComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      result => {
        if (!!result) {
          this.userService.delete(id).subscribe(
            success => {
              if (success) {
                this.loadUsers();
              }
            }
          );
        }
      },
      // err => this.notificationService.error('Fehler ' + err.message)
    );
  }
}
