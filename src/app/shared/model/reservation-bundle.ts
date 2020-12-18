import { ScheduleSlot } from './schedule-slot';
import { Movie } from 'src/app/shared/model/movie';
import { Reservation } from 'src/app/shared/model/reservation';
import { ReservationData } from 'src/app/shared/model/reservationData';

export class ReservationBundle {
  constructor(public reservationNumber: string,
              public reservations: Reservation[],
              public movie: Movie,
              public reservationData: ReservationData,
              public scheduleSlot: ScheduleSlot,
              public canCancel: boolean) {

  }
}
