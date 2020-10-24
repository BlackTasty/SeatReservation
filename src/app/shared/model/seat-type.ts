import { SeatPosition } from './seat-position';

export class SeatType {
  constructor(public id: number,
              public name: string,
              public seatImage: string,
              public seatCount: number,
              public basePrice: number,
              public position: SeatPosition) {

  }
}
