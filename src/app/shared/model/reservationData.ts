import { Room } from 'src/app/shared/model/room';
import { RoomTechnology } from './room-technology';
import { SeatPosition } from './seat-position';

export class ReservationData {
  constructor(public seatPositions: SeatPosition[],
              public roomTechnology: RoomTechnology,
              public room: Room) {

  }
}
