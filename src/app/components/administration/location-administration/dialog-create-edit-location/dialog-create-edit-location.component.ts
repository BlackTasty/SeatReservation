import { Location } from './../../../../shared/model/location';
import { LocationService } from './../../../../core/services/location.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource } from '@angular/material';
import { Component, Inject, OnInit } from '@angular/core';
import { Room } from 'src/app/shared/model/room';

@Component({
  selector: 'app-dialog-create-edit-location',
  templateUrl: './dialog-create-edit-location.component.html',
  styleUrls: ['./dialog-create-edit-location.component.scss']
})
export class DialogCreateEditLocationComponent implements OnInit {
  public countries = [
    { name: 'Albanien', id: 1 },
    { name: 'Andorra', id: 2 },
    { name: 'Belgien', id: 3 },
    { name: 'Bosnien-Herzegowina', id: 4 },
    { name: 'Bulgarien', id: 5 },
    { name: 'Dänemark', id: 6 },
    { name: 'Deutschland', id: 7 },
    { name: 'Estland', id: 8 },
    { name: 'Finnland', id: 9 },
    { name: 'Frankreich', id: 10 },
    { name: 'Griechenland', id: 11 },
    { name: 'Großbritannien', id: 12 },
    { name: 'Irland', id: 14 },
    { name: 'Island', id: 15 },
    { name: 'Italien', id: 16 },
    { name: 'Kosovo', id: 17 },
    { name: 'Kroatien', id: 18 },
    { name: 'Lettland', id: 19 },
    { name: 'Liechtenstein', id: 20 },
    { name: 'Litauen', id: 21 },
    { name: 'Luxemburg', id: 22 },
    { name: 'Mazedonien', id: 23 },
    { name: 'Malta', id: 24 },
    { name: 'Moldawien', id: 25 },
    { name: 'Monaco', id: 26 },
    { name: 'Montenegro', id: 27 },
    { name: 'Niederlande', id: 28 },
    { name: 'Norwegen', id: 29 },
    { name: 'Österreich', id: 30 },
    { name: 'Polen', id: 31 },
    { name: 'Portugal', id: 32 },
    { name: 'Rumänien', id: 33 },
    { name: 'Russland', id: 34 },
    { name: 'San Marino', id: 35 },
    { name: 'Schweden', id: 36 },
    { name: 'Schweiz', id: 37 },
    { name: 'Serbien', id: 38 },
    { name: 'Slowakei', id: 39 },
    { name: 'Slowenien', id: 40 },
    { name: 'Spanien', id: 41 },
    { name: 'Tschechische Republik', id: 42 },
    { name: 'Türkei', id: 43 },
    { name: 'Ukraine', id: 44 },
    { name: 'Ungarn', id: 45 },
    { name: 'Vatikan', id: 46 },
    { name: 'Weißrussland', id: 47 },
    { name: 'Zypern', id: 48 }
  ];
  public selectedCountry: number;

  public unassignedRooms: MatTableDataSource<Room>;
  public assignedRooms: MatTableDataSource<Room>;
  public displayedColumns: string[] = [ 'name', 'seatCount', 'actions' ];

  public location: Location;
  public isEdit: boolean;

  constructor(private dialogRef: MatDialogRef<DialogCreateEditLocationComponent>,
              private locationService: LocationService,
              @Inject(MAT_DIALOG_DATA) data) {
    this.unassignedRooms = new MatTableDataSource();
    this.assignedRooms = new MatTableDataSource();

    if (!!data) {
      this.isEdit = data.isEdit;

      this.location = this.isEdit ? data.location : new Location(0, '', '', null, '', '', '', false, []);
      if (this.isEdit) {
        this.selectedCountry = this.countries.find(x => x.name === this.location.country).id;
        this.assignedRooms.data = this.location.rooms;
      }
    }

    locationService.getUnassignedRooms().subscribe(result => {
      this.unassignedRooms.data = result;
    });
  }

  ngOnInit() {
  }

  public getSeatCountForRoom(room: Room): number {
    if (!(!!room.roomPlan) || !(!!room.roomPlan.seats)) {
      return 0;
    }

    let seatCount = 0;

    room.roomPlan.seats.forEach(seat => {
      if (!!seat.seatType) {
        seatCount += seat.seatType.seatCount;
      }
    });

    return seatCount;
  }

  public onCountryChanged(event) {
    this.location.country = this.countries.find(x => x.id === event).name;
  }

  public onConfirmClicked(): void {
    this.dialogRef.close(this.location);
  }

  public onAbortClicked(): void {
    this.dialogRef.close(null);
  }

  public onAssignRoomClicked(room: Room) {
    this.location.rooms.push(room);
    this.assignedRooms.data = this.location.rooms;
    this.unassignedRooms.data = this.unassignedRooms.data.filter(x => x.id !== room.id);
  }

  public onUnassignRoomClicked(room: Room) {
    const data = this.unassignedRooms.data;
    data.push(room);
    this.unassignedRooms.data = data;
    this.location.rooms = this.location.rooms.filter(x => x.id !== room.id);
    this.assignedRooms.data = this.location.rooms;
  }
}
