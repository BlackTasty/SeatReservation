import { Schedule } from './schedule';
import { RoomPlan } from './room-plan';
import { RoomTechnology } from './room-technology';

export class Room {
  constructor(public id: number,
              public name: string,
              public scheduleId: number,
              public schedule: Schedule,
              public roomPlanId: number,
              public roomPlan: RoomPlan,
              public isOpen: boolean,
              public technologyId: number,
              public technology: RoomTechnology = null) {

  }
}
