import { Room } from './room';
import { ScheduleSlot } from './schedule-slot';

export class Schedule {
  constructor(public id: number,
              public movieSchedule: ScheduleSlot[]) {

  }
}
