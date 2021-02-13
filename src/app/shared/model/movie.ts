import { MediaFile } from './media-file';
import { Genre } from './genre';
import { Person } from './person';
import { ScheduleSlot } from './schedule-slot';
import { Studio } from './studio';

export class Movie {
  constructor(public id: number,
              public title: string,
              public banner: string,
              public bannerId: number,
              public poster: string,
              public posterId: number,
              public logo: string,
              public logoId: number,
              public trailer: string,
              public trailerId: number,
              public description: string,
              public movieLength: number,
              public releaseDate: Date,
              public scheduleSlots: ScheduleSlot[],
              public isArchived: boolean,
              public genres: Genre[],
              public isFeatured: boolean,
              public directors: Person[],
              public actors: Person[],
              public studios: Studio[]) {

  }
}
