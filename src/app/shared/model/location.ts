import { MediaFile } from './media-file';
import { Room } from './room';

export class Location {
  constructor(public id: number,
              public name: string,
              public address: string,
              public zipCode: number,
              public country: string,
              public state: string,
              public logo: MediaFile,
              public isShutdown: boolean,
              public rooms: Room[]) {
    }
}
