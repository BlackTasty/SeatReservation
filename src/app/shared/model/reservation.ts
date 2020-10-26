import { ScheduleSlot } from './schedule-slot';
import { ReservationStatus } from './reservation-status';

export class Reservation {
  constructor(public id: number,
              public seatId: number,
              public scheduleSlotId: number,
              public roomId: number,
              public reservationStatus: ReservationStatus,
              public bookingDate: Date,
              public userId: number,
              public email: string,
              public isConfirmed: boolean) {

              }
}
