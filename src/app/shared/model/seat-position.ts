import { RoomPlan } from './room-plan';
import { SeatType } from './seat-type';
import { ReservationStatus } from './reservation-status';

export class SeatPosition {
  constructor(public id: number,
              public seatTypeId: number,
              public seatType: SeatType,
              public column: number,
              public row: number,
              public rotation: number) {

  }
}
