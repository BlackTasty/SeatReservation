import { Location } from './../../../shared/model/location';
import { ScheduleSlot } from './../../../shared/model/schedule-slot';
import { Room } from 'src/app/shared/model/room';
import { Movie } from './../../../shared/model/movie';

export class CinemaProgram {
  constructor(public movie: Movie,
              public slots: ScheduleSlot[]) {

  }
}
