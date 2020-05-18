export class Breadcrumb {
  constructor(name: string, routerLink: string, isActive: boolean) {
    this.name = name;
    this.routerLink = routerLink;
    this.isActive = isActive;
  }

  public name: string;
  public routerLink: string;
  public isActive: boolean;
}
