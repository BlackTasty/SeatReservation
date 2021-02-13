export class Breadcrumb {
  constructor(name: string, routerLink: string, isActive: boolean, layer: number) {
    this.name = name;
    this.routerLink = routerLink;
    this.isActive = isActive;
    this.layer = layer;
  }

  public name: string;
  public routerLink: string;
  public isActive: boolean;
  public layer: number;
}
