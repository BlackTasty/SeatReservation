import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MatTableDataSource, MAT_DIALOG_DATA } from '@angular/material';
import { UserService } from 'src/app/core/services/user.service';
import { Permission } from 'src/app/shared/model/permission';
import { User } from 'src/app/shared/model/user';
import { UserPermission } from 'src/app/shared/model/userPermission';

@Component({
  selector: 'app-dialog-create-edit-user',
  templateUrl: './dialog-create-edit-user.component.html',
  styleUrls: ['./dialog-create-edit-user.component.scss']
})
export class DialogCreateEditUserComponent implements OnInit {
  public user: User = new User(0, '', '', '', '', new Date(), [], '', '', '', 0, '', '', '');
  public password: string;
  public passwordRepeat: string;
  public isAdd: boolean;
  public permissions: MatTableDataSource<Permission>;
  public displayedColumns: string[] = [ 'checked', 'name', 'description' ];

  private avatarRemoved: boolean;

  constructor(private dialogRef: MatDialogRef<DialogCreateEditUserComponent>,
              private userService: UserService,
              @Inject(MAT_DIALOG_DATA) data) {
  this.permissions = new MatTableDataSource();

  this.isAdd = !!data.user === false;

  if (!this.isAdd) {
    this.user = data.user;
  }
}

  ngOnInit() {
    this.userService.getAvailablePermissions().subscribe(permissions => {
      const data = permissions;

      if (!this.isAdd) {
        this.userService.getPermissions(this.user.id).subscribe(userPermissions => {
          data.forEach(permission => {
            permission.checked = this.user.permissions.some(x => x.id === permission.id);
          });
          this.permissions.data = data;
        });
      } else {
        this.permissions.data = data;
      }
    });
  }

  public onConfirmClicked(): void {
    const permissions: Permission[] = [];
    this.permissions.data.forEach(permission => {
      if (permission.checked) {
        permissions.push(permission);
      }
    });

    this.user.password = this.password;
    if (this.isAdd) {
      this.user.registerDate = new Date();
    }

    const userPermissions = new UserPermission(this.user.id, permissions);
    this.dialogRef.close({ user: this.user, permissions: userPermissions });
  }

  public onAbortClicked(): void {
    if (!this.avatarRemoved) {
      this.dialogRef.close(null);
    } else {
      this.dialogRef.close({ reload: true });
    }
  }

  public allowSave(): boolean {
    if (this.isAdd) {
      return !!this.user.username && !!this.password && !!this.passwordRepeat && this.password === this.passwordRepeat;
    } else {
      if (!!this.password) {
        return !!this.user.username && this.password === this.passwordRepeat;
      } else {
        return !!this.user.username;
      }
    }
  }

  /*public onRemoveImage() {
    this.userService.removeAvatar(this.user.id).subscribe(result => {
      if (!!result) {
        this.user.profilePicture = null;
        this.avatarRemoved = true;
      }
    });
  }*/
}
