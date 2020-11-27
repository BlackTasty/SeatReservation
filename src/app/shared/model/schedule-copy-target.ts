import { ScheduleSlot } from './schedule-slot';
export class ScheduleCopyTarget {
  constructor(public scheduleSlotIds: number[],
              public roomIds: number[],
              public targetDate: Date) {

  }
}
