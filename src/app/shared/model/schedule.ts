import { Room } from './room';
import { ScheduleSlot } from './schedule-slot';

export class Schedule {
  constructor(public id: number,
              public movieSchedule: ScheduleSlot[]) {

  }

  public checkOverlap(start: Date, end: Date): boolean {
    this.movieSchedule.forEach(scheduleSlot => {
      if (scheduleSlot.overlapsWithPlannedSchedule(start, end)) {
        return true;
      }
    });

    return false;
  }
}
