import { MediaFile } from './media-file';
import { SeatPosition } from './seat-position';

export class SeatType {
  constructor(public id: number,
              public name: string,
              public seatImage: MediaFile,
              public seatCount: number,
              public basePrice: number,
              public position: SeatPosition) {

  }
}
