import { SeatTypeService } from './../../../../../core/services/seat-type.service';
import { DomSanitizer } from '@angular/platform-browser';
import { SeatPosition } from './../../../../../shared/model/seat-position';
import { ScheduleService } from './../../../../../core/services/schedule.service';
import { RoomService } from './../../../../../core/services/room.service';
import { RoomPlan } from './../../../../../shared/model/room-plan';
import { Schedule } from './../../../../../shared/model/schedule';
import { Room } from './../../../../../shared/model/room';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSelectChange } from '@angular/material';
import { SeatRow } from '../../model/seat-row';
import { SeatType } from 'src/app/shared/model/seat-type';

@Component({
  selector: 'app-dialog-create-edit-room',
  templateUrl: './dialog-create-edit-room.component.html',
  styleUrls: ['./dialog-create-edit-room.component.scss']
})
export class DialogCreateEditRoomComponent implements OnInit {
  public room: Room;
  public isEdit: boolean;
  public isLoaded: boolean = false;

  public schedules: Schedule[] = [];
  public roomPlan: RoomPlan = new RoomPlan(0, 0, null, [], 10, 6);
  public selectedScheduleIndex: number = -1;
  public seatRows: SeatRow[] = [];
  public selectedSeatPosition: SeatPosition;
  public seatTypes: SeatType[] = [];
  public selectedSeatTypeIndex: number = 0;

  private oldRowCount: number = 0;
  private oldColumnCount: number = 0;

  constructor(private dialogRef: MatDialogRef<DialogCreateEditRoomComponent>,
              private scheduleService: ScheduleService,
              private seatTypeService: SeatTypeService,
              public domSanitizer: DomSanitizer,
              @Inject(MAT_DIALOG_DATA) data) {
    if (!!data) {
      this.isEdit = data.isEdit;

      this.room = this.isEdit ? data.room : new Room(0, '', 0, new Schedule(0, []), 0, this.roomPlan, false, 1);
    }

  }

  ngOnInit() {
    this.scheduleService.getSchedules().subscribe(schedules => {
      this.schedules = schedules;

      this.oldColumnCount = this.roomPlan.columns;
      this.oldRowCount = this.roomPlan.rows;

      if (this.isEdit) {
        this.selectedScheduleIndex = schedules.find(x => x.id === this.room.scheduleId).id;
        this.roomPlan = this.room.roomPlan;
        this.oldColumnCount = this.roomPlan.columns;
        this.oldRowCount = this.roomPlan.rows;
        for (let row = 1; row <= this.roomPlan.rows; row++) {
          const seatRow: SeatRow = new SeatRow(row, []);
          for (let column = 1; column <= this.roomPlan.columns; column++) {
            seatRow.seats.push(this.roomPlan.seats.find(x => x.row === row && x.column === column));
          }
          this.seatRows.push(seatRow);
        }
      } else {
        this.scheduleService.generateSchedule(false).subscribe(id => {
          this.room.scheduleId = id;
          this.room.schedule.id = id;
        });
      }
      this.isLoaded = true;
    });

    this.seatTypeService.getSeatTypes().subscribe(seatTypes => {
      this.seatTypes = seatTypes;
      if (!this.isEdit) {
        this.generateRoomPlan();
      }
    });
  }

  public onGenerateSchedule() {
    this.scheduleService.generateSchedule(true).subscribe(id => {
      this.scheduleService.getSchedules().subscribe(schedules => {
        this.schedules = schedules;
        const schedule = this.schedules.find(x => x.id === id);
        this.selectedScheduleIndex = schedule.id;
        if (this.selectedScheduleIndex >= 0) {
          this.room.schedule = schedule;
          this.room.scheduleId = schedule.id;
        }
      });
    });
  }

  public onScheduleIndexChanged(event: MatSelectChange) {
    this.room.schedule = this.schedules.find(x => x.id === event.value);
    this.room.scheduleId = this.room.schedule.id;
  }

  public onConfirmClicked(): void {
    const seats: SeatPosition[] = [];

    this.seatRows.forEach(seatRow => {
      seatRow.seats.forEach(seat => {
        seats.push(seat);
      });
    });

    if (!this.isEdit) {
      this.scheduleService.generateSchedule(true).subscribe(id => {
        this.roomPlan.seats = seats;
        this.room.roomPlan.id = 0;
        this.room.roomPlanId = 0;
        this.room.schedule.id = 0;
        this.room.scheduleId = id;
        this.dialogRef.close(this.room);
      });
    } else {
      this.roomPlan.seats = seats;
      this.dialogRef.close(this.room);
    }
  }

  public onAbortClicked(): void {
    this.dialogRef.close(null);
  }

  public onSeatClicked(selectedSeatPosition: SeatPosition) {
    this.selectedSeatPosition = selectedSeatPosition;
    this.selectedSeatTypeIndex = selectedSeatPosition.seatType.id;
  }

  public onRoomPlanChange() {
    //First check if column count has changed
    if (this.roomPlan.columns !== this.oldColumnCount) {
      this.seatRows.forEach(seatRow => {
        if (this.roomPlan.columns > this.oldColumnCount) {
          seatRow.seats.push(new SeatPosition(0, this.seatTypes[0].id, this.seatTypes[0],
            this.roomPlan.columns, seatRow.row, 0));
        } else {
          seatRow.seats.pop();
        }
      });
    }

    if (this.roomPlan.rows > this.oldRowCount) {
      this.seatRows.push(this.generateSeatRow(this.roomPlan.rows, this.roomPlan.columns));
    } else if (this.roomPlan.rows < this.oldRowCount) {
      this.seatRows.pop();
    }

    this.oldRowCount = this.roomPlan.rows;
    this.oldColumnCount = this.roomPlan.columns;
  }

  private generateRoomPlan() {
    for (let row = 1; row <= this.roomPlan.rows; row++) {
      const seatRow = new SeatRow(row, []);
      for (let column = 1; column <= this.roomPlan.columns; column++) {
        seatRow.seats.push(new SeatPosition(0, this.seatTypes[0].id, this.seatTypes[0],
          column, row, 0));
      }

      this.seatRows.push(seatRow);
    }
  }

  private generateSeatRow(row: number, columns: number): SeatRow {
    const seatRow = new SeatRow(row, []);

    for (let column = 1; column <= columns; column++) {
      seatRow.seats.push(new SeatPosition(0, this.seatTypes[0].id, this.seatTypes[0],
        column, row, 0));
    }

    return seatRow;
  }

  public isSeatSelected(seatPosition: SeatPosition) {
    return !!this.selectedSeatPosition &&
      seatPosition.row === this.selectedSeatPosition.row && seatPosition.column === this.selectedSeatPosition.column;
  }

  public onSelectedSeatTypeChanged(seatTypeId) {
    this.selectedSeatPosition.seatType = this.seatTypes[seatTypeId - 1];
    this.selectedSeatPosition.seatTypeId = this.selectedSeatPosition.seatType.id;
  }
}
