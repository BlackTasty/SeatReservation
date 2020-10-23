import { Movie } from './movie';
import { Reservation } from './reservation';
import * as moment from 'moment';

export class ScheduleSlot {
  constructor(public id: number,
              public scheduleId: number,
              public movieId: number,
              public movie: Movie,
              public start: Date,
              public end: Date,
              public reservations: Reservation[]) {

  }

  public overlapsWithPlannedSchedule(start: Date, end: Date): boolean {
    return moment(start).isBetween(this.start, this.end) ||
           moment(end).isBetween(this.start, this.end);
  }
}
