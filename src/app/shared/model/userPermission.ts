import { Permission } from './permission';

export class UserPermission {
  constructor(public userId: number,
              public permissions: Permission[]) {
  }
}
