import { Room } from './room';
import { SeatPosition } from './seat-position';

export class RoomPlan {
  constructor(public id: number,
              public roomId: number,
              public room: Room,
              public seats: SeatPosition[],
              public columns: number,
              public rows: number) {

  }
}
