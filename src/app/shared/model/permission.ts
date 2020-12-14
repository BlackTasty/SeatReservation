export class Permission {
  constructor(public name: string,
              public description: string,
              public id: number) {

  }

  public checked: boolean;
}
