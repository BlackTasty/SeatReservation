import { SeatPosition } from './../../../../shared/model/seat-position';
export class SeatRow {
  constructor(public row: number,
              public seats: SeatPosition[]) {

    }
}
