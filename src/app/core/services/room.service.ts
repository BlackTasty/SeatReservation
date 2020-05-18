import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { host } from './host';
import { map } from 'rxjs/operators';
import { RoomPlan } from 'src/app/shared/model/room-plan';
import { Schedule } from 'src/app/shared/model/schedule';
import { Room } from 'src/app/shared/model/room';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private hostName;

  constructor(private httpClient: HttpClient) {
    this.hostName = host + '/room';
  }

  public getRoomPlans(roomId: number): Observable<RoomPlan[]> {
    return this.httpClient.get(this.hostName + '/getroomplans?roomId' + roomId)
      .pipe(map((result: RoomPlan[]) => {
        return result;
      }));
  }

  public getSchedule(roomId: number): Observable<Schedule> {
    return this.httpClient.get(this.hostName + '/getschedule?roomId=' + roomId)
    .pipe(map((result: Schedule) => {
      return result;
    }));
  }

  public getRoomByName(name: string): Observable<Room> {
    return this.httpClient.get(this.hostName + '/getroombyname?name=' + name)
    .pipe(map((result: Room) => {
      return result;
    }));
  }

  public addRoom(room: Room): Observable<boolean> {
    return this.httpClient.post(this.hostName + '/addroom', room)
    .pipe(map((result: boolean) => {
      return result;
    }));
  }

  public updateRoom(room: Room): Observable<boolean> {
    return this.httpClient.post(this.hostName + '/updateroom', room)
    .pipe(map((result: boolean) => {
      return result;
    }));
  }

  public removeRoom(roomId: number): Observable<boolean> {
    return this.httpClient.get(this.hostName + '/removeroom?roomId=' + roomId)
    .pipe(map((result: boolean) => {
      return result;
    }));
  }

  public getRooms(): Observable<Room[]> {
    return this.httpClient.get(this.hostName + '/getrooms')
    .pipe(map((result: Room[]) => {
      return result;
    }));
  }

  public setOpenStatus(roomId: number, isOpen: boolean): Observable<boolean> {
    return this.httpClient.get(this.hostName + '/setopenstatus?roomId=' + roomId + '&isOpen=' + isOpen)
    .pipe(map((result: boolean) => {
      return result;
    }));
  }
}
