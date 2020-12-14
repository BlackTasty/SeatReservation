import { Permission } from './permission';
export class User {
  public authData: string;

  constructor(public id: number,
              public username: string,
              public password: string,
              public firstName: string,
              public lastName: string,
              public registerDate: Date,
              public permissions: Permission[],
              public email: string,
              public phone: string,
              public avatar: string) {

  }
}
