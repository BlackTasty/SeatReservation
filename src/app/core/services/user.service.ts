import { UserPermission } from '../../shared/model/userPermission';
import { Observable } from 'rxjs';
import { User } from '../../shared/model/user';
import { Injectable } from '@angular/core';
import { Permission } from 'src/app/shared/model/permission';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { host } from './host';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private hostName;

  constructor(private httpClient: HttpClient) {
    this.hostName = host + '/user';
  }

  public add(user: User): Observable<number> {
    return this.httpClient.post(this.hostName + '/add', user)
      .pipe(map((result: number) => {
        return result;
      }));
  }

  public update(user: User): Observable<boolean> {
    return this.httpClient.post(this.hostName + '/update', user)
      .pipe(map((result: boolean) => {
        return result;
      }));
  }

  public delete(userId: number): Observable<boolean> {
    return this.httpClient.delete(this.hostName + '/delete?userId=' + userId)
      .pipe(map((result: boolean) => {
        return result;
      }));
  }

  public setPermissions(userPermissions: UserPermission): Observable<boolean> {
    return this.httpClient.post(this.hostName + '/setpermissions', userPermissions)
      .pipe(map((result: boolean) => {
        return result;
      }));
  }

  public getPermissions(userId: number): Observable<UserPermission> {
    return this.httpClient.get(this.hostName + '/getPermissions?userId=' + userId)
      .pipe(map((result: UserPermission) => {
        return result;
      }));
  }

  public getAvailablePermissions(): Observable<Permission[]> {
    return this.httpClient.get(this.hostName + '/getavailablepermissions')
      .pipe(map((result: Permission[]) => {
        return result;
      }));
  }

  public get(): Observable<User[]> {
    return this.httpClient.get(this.hostName + '/get')
      .pipe(map((result: User[]) => {
        return result;
      }));
  }

  public getById(userId: number): Observable<User> {
    return this.httpClient.get(this.hostName + '/getbyid?userId=' + userId)
      .pipe(map((result: User) => {
        return result;
      }));
  }
}
