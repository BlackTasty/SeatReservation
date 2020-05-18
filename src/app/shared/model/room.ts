import { Schedule } from './schedule';
import { RoomPlan } from './room-plan';

export class Room {
  constructor(public id: number,
              public name: string,
              public schedule: Schedule,
              public roomPlan: RoomPlan,
              public isOpen: boolean) {

  }
}
