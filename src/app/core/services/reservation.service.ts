import { Reservation } from './../../shared/model/reservation';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { host } from './host';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private hostName;

  constructor(private httpClient: HttpClient) {
    this.hostName = host + '/reservation';
  }

  public getReservations(): Observable<Reservation[]> {
    return this.httpClient.get(this.hostName + '/getreservations')
      .pipe(map((result: Reservation[]) => {
        return result;
      }));
  }

  public getReservationsForSchedule(scheduleId: number): Observable<Reservation[]> {
    return this.httpClient.get(this.hostName + '/getreservationsforschedule?id=' + scheduleId)
      .pipe(map((result: Reservation[]) => {
        return result;
      }));
  }

  public addReservation(reservations: Reservation[]): Observable<boolean> {
    return this.httpClient.post(this.hostName + '/addreservation', reservations)
      .pipe(map((result: boolean) => {
        return result;
      }));
  }

  public cancelReservation(reservationId: number, userId: number, password: string): Observable<boolean> {
    return this.httpClient.get(this.hostName + '/cancelreservation?reservation=' + reservationId + '&user=' + userId)
      .pipe(map((result: boolean) => {
        return result;
      }));
  }
}
