import { ScheduleService } from './../../../../../core/services/schedule.service';
import { ScheduleSlot } from './../../../../../shared/model/schedule-slot';
import { RoomService } from './../../../../../core/services/room.service';
import { MovieService } from 'src/app/core/services/movie.service';
import { Room } from 'src/app/shared/model/room';
import { Component, OnInit, Inject } from '@angular/core';
import { Movie } from 'src/app/shared/model/movie';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import * as moment from 'moment';
import { FormControl } from '@angular/forms';
import { RoomScheduleSlot } from 'src/app/shared/model/room-schedule-slot';

@Component({
  selector: 'app-dialog-schedule-movie',
  templateUrl: './dialog-schedule-movie.component.html',
  styleUrls: ['./dialog-schedule-movie.component.scss']
})
export class DialogScheduleMovieComponent implements OnInit {
  public movies: Movie[] = [];
  public rooms: Room[] = [];

  public selectedMovieId: number;
  public selectedRoomId: number;
  public startTime: string;
  public date = new FormControl(new Date());

  public isOverlapError: boolean;

  constructor(private dialogRef: MatDialogRef<DialogScheduleMovieComponent>,
              private movieService: MovieService,
              private roomService: RoomService,
              private scheduleService: ScheduleService,
              @Inject(MAT_DIALOG_DATA) data) {
    const currentDate = new Date();
    this.startTime = currentDate.getHours() + ':' + currentDate.getMinutes();
    currentDate.setHours(0, 0, 0, 0);
    this.date.setValue(currentDate);
    if (!!data) {
      if (!!data.movie) {
        this.selectedMovieId = data.movie.id;
      }
      if (!!data.room) {
        this.selectedRoomId = data.room.id;
      }
    }
  }

  ngOnInit() {
    this.movieService.getMovies(false).subscribe(movies => {
      this.movies = movies;
    });

    this.roomService.getRooms().subscribe(rooms => {
      this.rooms = rooms;
    });
  }

  public getEndTime() {
    const movie = this.movies.find(x => x.id === this.selectedMovieId);
    if (!!movie) {
      return this.getCombinedDate().add(movie.movieLength, 'minutes');
    } else {
      return this.getCombinedDate();
    }
  }

  public onConfirmClicked(): void {
    const room = this.rooms.find(x => x.id === this.selectedRoomId);
    const startTime = this.getCombinedDate().toDate();
    const endTime = this.getEndTime().toDate();

    const isOverlapping = this.checkOverlap(room.schedule.movieSchedule, startTime, endTime);
    if (!isOverlapping) {
      const scheduleSlot = new ScheduleSlot(0, room.scheduleId, this.selectedMovieId,
                            this.movies.find(x => x.id === this.selectedMovieId),
                            this.getCombinedDate().toDate(), this.getEndTime().toDate(), []);

      this.scheduleService.scheduleMovie(new RoomScheduleSlot(this.selectedRoomId, scheduleSlot)).subscribe(result => {
        if (!!result) {
          this.dialogRef.close(true);
        } else {
          console.error('Error scheduling movie');
        }
      });
    } else {
      this.isOverlapError = true;
    }
  }

  private checkOverlap(schedule: ScheduleSlot[], start: Date, end: Date): boolean {
    let isOverlapping = false;
    schedule.filter(x => moment(start).isBetween(x.start, x.end) || moment(end).isBetween(x.start, x.end))
            .forEach(scheduleSlot => {
      if (moment(start).isBetween(scheduleSlot.start, scheduleSlot.end) ||
          moment(end).isBetween(scheduleSlot.start, scheduleSlot.end)) {
        isOverlapping = true;
      }
    });

    return isOverlapping;
  }

  private filterSchedule(slot: ScheduleSlot, start: Date, end: Date) {
    start.getDate();
  }

  private checkSlotBetween(slot: ScheduleSlot, date: Date) {
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();

    const baseStartDate = moment(new Date(year, month, day));
    const baseEndDate = moment(new Date(year, month, day + 1, 23, 59, 59));

    return !moment(slot.start).isBetween(baseStartDate, baseEndDate) &&
           !moment(slot.end).isBetween(baseStartDate, baseEndDate);
  }

  public onRoomChanged() {
    this.isOverlapError = false;
  }

  public onDateTimeChanged() {
    this.isOverlapError = false;
  }

  public onAbortClicked(): void {
    this.dialogRef.close(false);
  }

  private getCombinedDate() {
    const combinedDate = moment(this.date.value);
    const time = this.startTime.split(':');
    combinedDate.add(Number.parseInt(time[0], 10), 'h').add(Number.parseInt(time[1], 10), 'm');

    return combinedDate;
  }
}
