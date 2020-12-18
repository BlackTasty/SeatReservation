import { Permission } from './../../shared/model/permission';
import { UserPermission } from '../../shared/model/userPermission';
import { UserService } from './user.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { User } from 'src/app/shared/model/user';
import { HttpClient } from '@angular/common/http';
import { UserCredential } from 'src/app/shared/model/userCredential';
import { host } from './host';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  public loggedIn = false;
  private hostName;
  private permissions: Permission[] = [];

  constructor(private httpClient: HttpClient,
              private userService: UserService,
              private router: Router) {
    this.hostName = host + '/user';
  }

  public checkLoggedIn() {
    if (this.tokenExpired()) {
      this.logout(false);
      return;
    }

    if (this.loggedIn) {
      return;
    }

    const currentUser = localStorage.getItem('currentUser');
    if (!!currentUser) {
      const user = JSON.parse(currentUser);
      this.permissions = user.permissions;
      this.loggedIn = true;
    }
  }

  public refreshAuthentication(currentUsername: string, currentPassword: string,
                               newUsername: string, newPassword: string): Observable<boolean> {
    return this.httpClient.post(this.hostName + '/authenticate', new UserCredential(currentUsername, currentPassword))
      .pipe(map((user: User) => {
        if (!!user) {
          return true;
        } else {
          return false;
        }
      },
      err => {
        return false;
      }));
  }

  public reLogin(username: string, password: string): Observable<User> {
    const stayLoggedIn = localStorage.getItem('stayLoggedIn') === '1';

    return this.login(username, password, stayLoggedIn);
  }

  public login(username: string, password: string, stayLoggedIn: boolean): Observable<User> {
    return this.httpClient.post(this.hostName + '/authenticate', new UserCredential(username, password))
      .pipe(map((user: User) => {
        if (!!user) {
          user.authData = window.btoa(username + ':' + password);
          localStorage.setItem('currentUser', JSON.stringify(user));

          const expireTime = new Date();

          if (!stayLoggedIn) {
            expireTime.setDate(expireTime.getDate() + 1);
          } else {
            expireTime.setMonth(expireTime.getMonth() + 1);
          }

          localStorage.setItem('expireTime', expireTime.getTime().toString());
          localStorage.setItem('stayLoggedIn', stayLoggedIn ? '1' : '0');

          this.permissions = user.permissions;
          this.loggedIn = true;
        }

        return user;
      }));
  }

  public hasPermission(id: number): boolean {
    if (!this.loggedIn) {
      return false;
    }

    // If user has admin permissions, always return true
    if (this.hasPermissionId(1)) {
      return true;
    }

    // Check if the required permission is in the permissions array
    return this.hasPermissionId(id);
  }

  public isNormalUser(): boolean {
    if (!this.loggedIn) {
      return true;
    }

    return this.permissions.length === 1 && this.hasPermissionId(7);
  }

  private hasPermissionId(id: number): boolean {
    return !!this.permissions.find(x => x.id === id);
  }

  public getCurrentUserId(): number {
    const currentUser = localStorage.getItem('currentUser');
    if (!!currentUser) {
      const user = JSON.parse(currentUser);
      return user.id;
    } else {
      return null;
    }
  }

  public getCurrentUsername(): string {
    const currentUser = localStorage.getItem('currentUser');
    if (!!currentUser) {
      const user = JSON.parse(currentUser);
      return user.username;
    } else {
      return '';
    }
  }

  public getCurrentUser(): Observable<User> {
    return this.userService.getById(this.getCurrentUserId());
  }

  public logout(redirectToHome: boolean) {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('expireTime');
    this.loggedIn = false;

    if (redirectToHome) {
      this.router.navigate(['/home']);
      /*if (this.router.url.includes('/settings')) {
        this.router.navigate(['/home']);
      } else {
        window.location.reload();
      }*/
    }
  }

  public tokenExpired(): boolean {
    const currentTime: Date = new Date();
    const expireTime = Number.parseInt(localStorage.getItem('expireTime'), 10);
    return !!expireTime === false || currentTime.getTime() > expireTime;
  }
}
