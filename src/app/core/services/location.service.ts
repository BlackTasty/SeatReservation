import { Location } from './../../shared/model/location';
import { HttpClient } from '@angular/common/http';
import { Injectable, Output, EventEmitter } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { host } from './host';
import { Room } from 'src/app/shared/model/room';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private hostName;
  private selectedLocation: Location;

  private selectedLocationChangedSource = new Subject<Location>();
  public selectedLocationChanged = this.selectedLocationChangedSource.asObservable();

  constructor(private httpClient: HttpClient) {
    this.hostName = host + '/location';
  }

  public getSelectedLocation() {
    return this.selectedLocation;
  }

  public setSelectedLocation(location: Location) {
    this.selectedLocation = location;
    this.selectedLocationChangedSource.next(location);
  }

  public getLocations(showShutdown: boolean): Observable<Location[]> {
    return this.httpClient.get(this.hostName + '/getlocations?showshutdown=' + showShutdown)
    .pipe(map((result: Location[]) => {
      return result;
    }));
  }

  public getLocationById(locationId: number): Observable<Location> {
    return this.httpClient.get(this.hostName + '/getlocationbyid?id=' + locationId)
    .pipe(map((result: Location) => {
      return result;
    }));
  }

  public addLocation(location: Location): Observable<boolean> {
    return this.httpClient.post(this.hostName + '/addlocation', location)
      .pipe(map((result: boolean) => {
        return result;
      }));
  }

  public updateSelectedLocation(): Observable<boolean> {
    return this.updateLocation(this.selectedLocation);
  }

  public updateLocation(location: Location): Observable<boolean> {
    return this.httpClient.post(this.hostName + '/updatelocation', location)
    .pipe(map((result: boolean) => {
      return result;
    }));
  }

  public shutdownLocation(locationId: number): Observable<boolean> {
    return this.httpClient.get(this.hostName + '/shutdownlocation?id=' + locationId)
    .pipe(map((result: boolean) => {
      return result;
    }));
  }

  public reopenLocation(locationId: number): Observable<boolean> {
    return this.httpClient.get(this.hostName + '/reopenlocation?id=' + locationId)
    .pipe(map((result: boolean) => {
      return result;
    }));
  }

  public getUnassignedRooms(): Observable<Room[]> {
    return this.httpClient.get(this.hostName + '/getunassignedrooms')
    .pipe(map((result: Room[]) => {
      return result;
    }));
  }

  public getAssignedRoomsForLocation(locationId: number): Observable<Room[]> {
    return this.httpClient.get(this.hostName + '/getassignedroomsforlocation?id=' + locationId)
    .pipe(map((result: Room[]) => {
      return result;
    }));
  }
}
