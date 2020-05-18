import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { host } from './host';
import { SeatType } from 'src/app/shared/model/seat-type';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SeatTypeService {
  private hostName;

  constructor(private httpClient: HttpClient) {
    this.hostName = host + '/seat-type';
  }

  public addSeatType(seatType: SeatType): Observable<boolean> {
    return this.httpClient.post(this.hostName + '/addseattype', seatType)
    .pipe(map((result: boolean) => {
      return result;
    }));
  }

  public updateSeatType(seatType: SeatType): Observable<boolean> {
    return this.httpClient.post(this.hostName + '/updateseattype', seatType)
    .pipe(map((result: boolean) => {
      return result;
    }));
  }

  public removeSeatType(seatTypeId: number): Observable<boolean> {
    return this.httpClient.get(this.hostName + '/removeseattype?seatTypeId=' + seatTypeId)
    .pipe(map((result: boolean) => {
      return result;
    }));
  }

  public getSeatTypes(): Observable<SeatType[]> {
    return this.httpClient.get(this.hostName + '/getseattypes')
    .pipe(map((result: SeatType[]) => {
      return result;
    }));
  }
}
