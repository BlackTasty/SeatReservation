import { Room } from './room';

export class Location {
  constructor(public id: number,
              public name: string,
              public address: string,
              public zipCode: number,
              public country: string,
              public state: string,
              public logo: string,
              public isShutdown: boolean,
              public rooms: Room[]) {
    }
}
