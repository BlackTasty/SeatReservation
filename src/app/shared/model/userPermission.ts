export class UserPermission {
  constructor(userId: number, permissions: string[]) {
    this.userId = userId;
    this.permissions = permissions;
  }

  public userId: number;
  public permissions: string[];
}
