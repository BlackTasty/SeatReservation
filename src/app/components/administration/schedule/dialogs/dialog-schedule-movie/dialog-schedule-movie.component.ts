import { LocationService } from './../../../../../core/services/location.service';
import { ScheduleService } from './../../../../../core/services/schedule.service';
import { ScheduleSlot } from './../../../../../shared/model/schedule-slot';
import { RoomService } from './../../../../../core/services/room.service';
import { MovieService } from 'src/app/core/services/movie.service';
import { Room } from 'src/app/shared/model/room';
import { Component, OnInit, Inject, AfterViewInit, NgZone, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Movie } from 'src/app/shared/model/movie';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import * as moment from 'moment';
import { FormControl } from '@angular/forms';
import { RoomScheduleSlot } from 'src/app/shared/model/room-schedule-slot';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

@Component({
  selector: 'app-dialog-schedule-movie',
  templateUrl: './dialog-schedule-movie.component.html',
  styleUrls: ['./dialog-schedule-movie.component.scss']
})
export class DialogScheduleMovieComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('chartElement') chartElement: ElementRef<HTMLElement>;

  private refreshTimer;
  private chartIndicator: am4charts.DateAxisDataItem;
  private chart: am4charts.XYChart;
  public scheduleDate = new FormControl(new Date());

  public movies: Movie[] = [];
  public rooms: Room[] = [];

  public selectedMovieId: number;
  public selectedRoomId: number;
  public selectedRoom: Room;
  public startTime: string;
  public date = new FormControl(new Date());

  public isOverlapError: boolean;

  constructor(private dialogRef: MatDialogRef<DialogScheduleMovieComponent>,
              private zone: NgZone,
              private movieService: MovieService,
              private roomService: RoomService,
              private scheduleService: ScheduleService,
              private locationService: LocationService,
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

    this.rooms = this.locationService.getSelectedLocation().rooms;
    /*this.roomService.getRooms().subscribe(rooms => {
      this.rooms = rooms;
    });*/
    this.refreshTimer = setInterval(() => {
      if (!!this.chartIndicator) {
        this.chartIndicator.date = new Date();
      }
    }, 10000);
  }

  ngAfterViewInit() {
    this.zone.runOutsideAngular(() => {
      const chart = am4core.create(this.chartElement.nativeElement, am4charts.XYChart);
      chart.hiddenState.properties.opacity = 0;

      chart.paddingRight = 30;
      chart.dateFormatter.inputDateFormat = 'yyyy-MM-dd HH:mm';
      chart.dateFormatter.dateFormat = 'dd.MM.yyyy HH:mm';

      const colorSet = new am4core.ColorSet();
      colorSet.saturation = 0.4;

      const categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
      categoryAxis.dataFields.category = 'category';
      categoryAxis.renderer.grid.template.location = 0;
      categoryAxis.renderer.inversed = true;
      categoryAxis.renderer.labels.template.fill = am4core.color('#FFFFFF');
      categoryAxis.renderer.labels.template.stroke = am4core.color('#CCCCCC');

      const dateAxis = chart.xAxes.push(new am4charts.DateAxis());
      dateAxis.renderer.minGridDistance = 70;
      dateAxis.baseInterval = { count: 1, timeUnit: 'minute' };
      // dateAxis.max = new Date(2018, 0, 1, 24, 0, 0, 0).getTime();
      // dateAxis.strictMinMax = true;
      dateAxis.renderer.tooltipLocation = 0;
      dateAxis.renderer.labels.template.fill = am4core.color('#FFFFFF');
      dateAxis.renderer.labels.template.stroke = am4core.color('#CCCCCC');
      this.chartIndicator = dateAxis.axisRanges.create();
      this.chartIndicator.date = new Date();
      this.chartIndicator.grid.stroke = am4core.color('red');
      this.chartIndicator.grid.strokeWidth = 2;
      this.chartIndicator.grid.strokeOpacity = 1;

      const series = chart.series.push(new am4charts.ColumnSeries());
      series.columns.template.height = am4core.percent(70);
      series.columns.template.tooltipText = "[bold]{task}[/]\n[bold]Von:[/] {openDateX.formatDate('HH:mm')}\n[bold]Bis:[/] {dateX.formatDate('HH:mm')}";
      series.dataFields.openDateX = 'start';
      series.dataFields.dateX = 'end';
      series.dataFields.categoryY = 'category';
      series.columns.template.propertyFields.fill = 'color'; // get color from data
      series.columns.template.propertyFields.stroke = 'color';
      series.columns.template.strokeOpacity = 1;
      series.clickable = true;
      const valueLabel = series.columns.template.createChild(am4core.Label);
      valueLabel.text = "";
      valueLabel.fontSize = 11;
      valueLabel.valign = 'middle';
      valueLabel.align = 'center';
      valueLabel.wrap = true;
      valueLabel.fill = am4core.color('#FFFFFF');
      valueLabel.stroke = am4core.color('#000000');
      valueLabel.fontWeight = 'bold';
      valueLabel.strokeWidth = 0;

      chart.scrollbarX = new am4core.Scrollbar();

      this.refreshData(chart);
    });
  }

  ngOnDestroy() {
    this.zone.runOutsideAngular(() => {
      if (this.chart) {
        this.chart.dispose();
      }
    });
  }

  public isSelectedRoomOpen(): boolean {
    if (!!this.selectedRoomId && this.selectedRoomId >= 0) {
      return this.rooms.find(x => x.id === this.selectedRoomId).isOpen;
    }

    return true;
  }

  public getSelectedRoomName(): string {
    if (!!this.selectedRoomId && this.selectedRoomId >= 0) {
      return this.rooms.find(x => x.id === this.selectedRoomId).name;
    }

    return '';
  }

  public refreshChart() {
    this.refreshData(this.chart);
  }

  private refreshData(chart: am4charts.XYChart) {
    const colorSet = new am4core.ColorSet();
    const room = this.rooms.find(x => x.id === this.selectedRoomId);
    const data = [];

    if (!!room) {
      if (room.scheduleId > 0) {
        const scheduleOfDay = room.schedule.movieSchedule.filter(x => this.checkDate(x.start));
        if (scheduleOfDay.length > 0) {
          scheduleOfDay.forEach(scheduleSlot => {
            scheduleSlot.scheduleId = room.scheduleId;
            data.push({
              category: room.name,
              start: moment(scheduleSlot.start).format('YYYY-MM-DD HH:mm'),
              end: moment(scheduleSlot.end).format('YYYY-MM-DD HH:mm'),
              color: colorSet.getIndex(data.length).brighten(0),
              task: scheduleSlot.movie.title,
              slot: scheduleSlot,
              movie: scheduleSlot.movie,
              room,
              temp: false
            });
          });
        } else {
          data.push({
            category: room.name
          });
        }
      }
    }

    chart.data = data;
    const dateAxis: am4charts.DateAxis = chart.xAxes.values[0] as am4charts.DateAxis;
    const selectedDate: Date = this.scheduleDate.value;
    dateAxis.min = new Date(selectedDate.getFullYear(), selectedDate.getMonth(),
                            selectedDate.getDate(), 0, 0, 0, 0).getTime();
    dateAxis.max = new Date(selectedDate.getFullYear(), selectedDate.getMonth(),
                            selectedDate.getDate() + 1, 0, 0, 0, 0).getTime();
    dateAxis.disabled = false;
    this.chart = chart;

    this.refreshSchedulingData(chart);
  }

  private refreshSchedulingData(chart: am4charts.XYChart) {
    let data = [];
    if (!!chart && !!chart.data) {
      const tempIndex = chart.data.findIndex(x => x.temp === true);
      if (tempIndex >= 0) {
        data = chart.data.filter(x => x.temp === false);
      } else {
        data = chart.data;
      }
    }

    const room = this.rooms.find(x => x.id === this.selectedRoomId);

    if (!!room && !!this.selectedMovieId) {
      const startTime = this.getCombinedDate().toDate();
      const endTime = this.getEndTime().toDate();
      const isOverlapping = this.checkOverlap(!!room && !!room.schedule ? room.schedule.movieSchedule : null, startTime, endTime);

      data.push({
        category: room.name,
        start: moment(startTime).format('YYYY-MM-DD HH:mm'),
        end: moment(endTime).format('YYYY-MM-DD HH:mm'),
        color: isOverlapping ? '#ff0000' : '#aaaaaa',
        room,
        temp: true
      });
    }

    chart.data = data;
    const dateAxis: am4charts.DateAxis = chart.xAxes.values[0] as am4charts.DateAxis;
    const selectedDate: Date = this.scheduleDate.value;
    dateAxis.min = new Date(selectedDate.getFullYear(), selectedDate.getMonth(),
                            selectedDate.getDate(), 0, 0, 0, 0).getTime();
    dateAxis.max = new Date(selectedDate.getFullYear(), selectedDate.getMonth(),
                            selectedDate.getDate() + 1, 0, 0, 0, 0).getTime();
    dateAxis.disabled = false;
    this.chart = chart;
  }

  private checkDate(scheduleSlotDateRaw) {
    const scheduleSlotDate = moment(scheduleSlotDateRaw);
    const selectedDate = moment(this.scheduleDate.value);

    return selectedDate.isSame(scheduleSlotDate, 'day');
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
          this.roomService.getRoomById(room.id).subscribe(updatedRoom => {
            if (!!updatedRoom) {
              const target = this.locationService.getSelectedLocation().rooms.find(x => x.id === updatedRoom.id);
              if (!!target) {
                target.schedule = updatedRoom.schedule;
                this.dialogRef.close(true);
              }
            }
          });
        } else {
          console.error('Error scheduling movie');
        }
      });
    } else {
      this.isOverlapError = true;
    }
  }

  private checkOverlap(schedule: ScheduleSlot[], start: Date, end: Date): boolean {
    if (!!!schedule) {
      return false;
    }

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

  public onRoomChanged() {
    this.isOverlapError = false;
    this.refreshChart();
    if (this.selectedRoomId > -1) {
      this.selectedRoom = this.rooms.find(x => x.id === this.selectedRoomId);
    }
  }

  public onDateTimeChanged() {
    this.isOverlapError = false;
    this.refreshSchedulingData(this.chart);
  }

  public onMovieChanged() {
    this.refreshSchedulingData(this.chart);
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
