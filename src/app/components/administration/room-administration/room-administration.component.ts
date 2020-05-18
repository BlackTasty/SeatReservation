import { DialogRemoveRoomComponent } from './dialogs/dialog-remove-room/dialog-remove-room.component';
import { DialogCreateEditRoomComponent } from './dialogs/dialog-create-edit-room/dialog-create-edit-room.component';
import { RoomService } from './../../../core/services/room.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Room } from 'src/app/shared/model/room';
import { MatDialogConfig, MatPaginator, MatSort, MatDialog, MatTableDataSource, MatSlideToggleChange } from '@angular/material';

@Component({
  selector: 'app-room-administration',
  templateUrl: './room-administration.component.html',
  styleUrls: ['./room-administration.component.scss']
})
export class RoomAdministrationComponent implements OnInit {
  public displayedColumns = [ 'isOpen', 'name', 'seatCount', 'actions'];
  public rooms: MatTableDataSource<Room>;

  @ViewChild(MatPaginator) moviesPaginator: MatPaginator;
  @ViewChild(MatSort) moviesSort: MatSort;

  constructor(private roomService: RoomService,
              private dialog: MatDialog) {
    this.rooms = new MatTableDataSource();
  }

  ngOnInit() {
    this.rooms.sort = this.moviesSort;
    this.rooms.paginator = this.moviesPaginator;
    this.loadRooms();
  }

  public loadRooms(): void {
    this.roomService.getRooms().subscribe(
      rooms => {
        this.rooms.data = rooms;
      }
    );
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
