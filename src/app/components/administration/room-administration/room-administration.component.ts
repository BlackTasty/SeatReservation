import { LocationService } from './../../../core/services/location.service';
import { DialogRemoveRoomComponent } from './dialogs/dialog-remove-room/dialog-remove-room.component';
import { DialogCreateEditRoomComponent } from './dialogs/dialog-create-edit-room/dialog-create-edit-room.component';
import { RoomService } from './../../../core/services/room.service';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Room } from 'src/app/shared/model/room';
import { MatDialogConfig, MatPaginator, MatSort, MatDialog, MatTableDataSource, MatSlideToggleChange } from '@angular/material';
import { DialogScheduleMovieComponent } from '../schedule/dialogs/dialog-schedule-movie/dialog-schedule-movie.component';

@Component({
  selector: 'app-room-administration',
  templateUrl: './room-administration.component.html',
  styleUrls: ['./room-administration.component.scss']
})
export class RoomAdministrationComponent implements OnInit, AfterViewInit {
  public displayedColumns = [ 'isOpen', 'name', 'seatCount', 'actions'];
  public rooms: MatTableDataSource<Room>;

  @ViewChild(MatPaginator) moviesPaginator: MatPaginator;
  @ViewChild(MatSort) moviesSort: MatSort;

  constructor(private roomService: RoomService,
              private locationService: LocationService,
              private dialog: MatDialog) {
    this.rooms = new MatTableDataSource();
  }

  ngOnInit() {
    this.rooms.sort = this.moviesSort;
    this.rooms.paginator = this.moviesPaginator;
    //this.loadRooms();
  }

  ngAfterViewInit() {
    this.locationService.selectedLocationChanged.subscribe(result => {
      this.loadRooms();
    });
  }

  public loadRooms(): void {
    this.rooms.data = this.locationService.getSelectedLocation().rooms;
    /*const selectedLocationIdRaw = localStorage.getItem('selLoc');
    const id = Number.parseInt(selectedLocationIdRaw, 10);

    this.locationService.getAssignedRoomsForLocation(id).subscribe(
      rooms => {
        this.rooms.data = rooms;
      }
    );*/
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

  public onScheduleMovie(room: Room) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      room
    };

    const dialogRef = this.dialog.open(DialogScheduleMovieComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      result => {
        if (!!result) {

        }
      }
    );
  }

  public showCreateEditDialog(room: Room, isEdit: boolean) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      room,
      isEdit
    };

    const dialogRef = this.dialog.open(DialogCreateEditRoomComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      resultRoom => {
        if (!!resultRoom) {
          if (!isEdit) {
            this.roomService.addRoom(resultRoom).subscribe(result => {
              if (result === true) {
                this.loadRooms();
                this.locationService.getSelectedLocation().rooms.push(resultRoom);
                this.locationService.updateSelectedLocation().subscribe(locationResult => {
                });
              }
            });
          } else {
            this.roomService.updateRoom(resultRoom).subscribe(result => {
              if (result === true) {
                this.loadRooms();
              }
            },
            err => {
              console.log('Fehler ' + err.message);
            });
          }
        }
      }
    );
  }

  public toggleRoomOpen(event: MatSlideToggleChange, roomId: number) {
    this.roomService.setOpenStatus(roomId, event.checked).subscribe(result => {
      if (result === true) {
        this.loadRooms();
      }
    });
  }

  public onRemoveRoom(room: Room) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      room
    };

    const dialogRef = this.dialog.open(DialogRemoveRoomComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      result => {
        if (result === true) {
          this.roomService.removeRoom(room.id).subscribe(result => {
            if (result === true) {
              this.loadRooms();
            }
          });
        }
      },
      // err => this.notificationService.error('Fehler ' + err.message)
    );
  }
}
