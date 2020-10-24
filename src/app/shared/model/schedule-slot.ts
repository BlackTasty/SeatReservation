import { Location } from './location';
import { Movie } from './movie';
import { Reservation } from './reservation';
import * as moment from 'moment';
import { Room } from './room';

export class ScheduleSlot {
  constructor(public id: number,
              public scheduleId: number,
              public movieId: number,
              public movie: Movie,
              public start: Date,
              public end: Date,
              public reservations: Reservation[]) {

  }

  public room: Room;
  public location: Location;
}
