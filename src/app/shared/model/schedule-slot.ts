import { Movie } from './movie';
import { Reservation } from './reservation';

export class ScheduleSlot {
  constructor(public id: number,
              public movieId: number,
              public movie: Movie,
              public start: Date,
              public end: Date,
              public reservations: Reservation[]) {

  }
}
