import { Genre } from './genre';
import { ScheduleSlot } from './schedule-slot';

export class Movie {
  constructor(public id: number,
              public title: string,
              public banner: string,
              public poster: string,
              public logo: string,
              public trailer: string,
              public description: string,
              public movieLength: number,
              public releaseDate: Date,
              public scheduleSlots: ScheduleSlot[],
              public isArchived: boolean,
              public genres: Genre[]) {

  }
}
