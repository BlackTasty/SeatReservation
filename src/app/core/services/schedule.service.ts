import { ScheduleSlot } from './../../shared/model/schedule-slot';
import { RoomScheduleSlot } from './../../shared/model/room-schedule-slot';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { host } from './host';
import { map } from 'rxjs/operators';
import { RoomPlan } from 'src/app/shared/model/room-plan';
import { Schedule } from 'src/app/shared/model/schedule';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  private hostName;

  constructor(private httpClient: HttpClient) {
    this.hostName = host + '/schedule';
  }

  public getSchedules(): Observable<Schedule[]> {
    return this.httpClient.get(this.hostName + '/getschedules')
    .pipe(map((result: Schedule[]) => {
      return result;
    }));
  }

  public getScheduleSlotById(slotId: number): Observable<ScheduleSlot> {
    return this.httpClient.get(this.hostName + '/getscheduleslotbyid?id=' + slotId)
    .pipe(map((result: ScheduleSlot) => {
      return result;
    }));
  }

  public generateSchedule(writeToDatabase: boolean): Observable<number> {
    return this.httpClient.get(this.hostName + '/generateschedule?writeToDatabase=' + writeToDatabase)
    .pipe(map((result: number) => {
      return result;
    }));
  }

  public scheduleMovie(roomScheduleSlot: RoomScheduleSlot): Observable<boolean> {
    return this.httpClient.post(this.hostName + '/schedulemovie', roomScheduleSlot)
    .pipe(map((result: boolean) => {
      return result;
    }));
  }

  public updateSchedule(roomScheduleSlot: RoomScheduleSlot): Observable<boolean> {
    return this.httpClient.post(this.hostName + '/updateschedule', roomScheduleSlot)
    .pipe(map((result: boolean) => {
      return result;
    }));
  }

  public removeScheduledMovie(roomId: number, scheduleSlotId: number): Observable<boolean> {
    return this.httpClient.get(this.hostName + '/removescheduledmovie?roomId=' + roomId + '&scheduleSlotId=' + scheduleSlotId)
    .pipe(map((result: boolean) => {
      return result;
    }));
  }
}
