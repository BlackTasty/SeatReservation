import { LocationService } from './../../../core/services/location.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ScheduleSlot } from './../../../shared/model/schedule-slot';
import { RoomService } from './../../../core/services/room.service';
import { Component, OnInit, NgZone, AfterViewInit, OnDestroy, ViewChild, ElementRef, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { EChartOption } from 'echarts';
import * as moment from 'moment';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { MatDialogConfig, MatDialog, MatTableDataSource } from '@angular/material';
import { DialogScheduleMovieComponent } from './dialogs/dialog-schedule-movie/dialog-schedule-movie.component';
import { Room } from 'src/app/shared/model/room';
import { Movie } from 'src/app/shared/model/movie';

am4core.useTheme(am4themes_animated);

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('chartElement') chartElement: ElementRef<HTMLElement>;

  private chart: am4charts.XYChart;
  private slotClicked: EventEmitter<{slot, movie, room}> = new EventEmitter();

  public selectedScheduleSlot: ScheduleSlot;
  public selectedScheduleSlotMovie: Movie;
  public selectedScheduleSlotRoom: Room;
  public scheduleDate = new FormControl(new Date());

  public pendingMovies: MatTableDataSource<ScheduleSlot>;
  public displayedPendingColumns = [ 'room', 'title', 'remainingTime', 'openSeats'];
  public runningMovies: MatTableDataSource<ScheduleSlot>;
  public displayedRunningColumns = [ 'room', 'title', 'remainingTime', 'openSeats'];

  private refreshTimer;
  private chartIndicator: am4charts.DateAxisDataItem;

  private rooms: Room[] = [];

  constructor(private roomService: RoomService,
              private locationService: LocationService,
              private zone: NgZone,
              private dialog: MatDialog,
              public domSanitizer: DomSanitizer) {
    this.pendingMovies = new MatTableDataSource();
    this.runningMovies = new MatTableDataSource();
  }

  ngOnInit() {
    this.refreshTimer = setInterval(() => {
      this.chartIndicator.date = new Date();
      this.refreshPendingAndRunningMoviesCount();
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
      categoryAxis.events.on('sizechanged', (ev) => {
          const axis = ev.target;
          const cellWidth = axis.pixelWidth / (axis.endIndex - axis.startIndex);
          axis.renderer.labels.template.maxWidth = cellWidth;
        });

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
      series.columns.template.events.on('hit', event => {
        this.slotClicked.emit({
          // @ts-ignore
          slot: event.target.dataItem.dataContext.slot,
          // @ts-ignore
          movie: event.target.dataItem.dataContext.movie,
          // @ts-ignore
          room: event.target.dataItem.dataContext.room
        });
      });
      const valueLabel = series.columns.template.createChild(am4core.Label);
      valueLabel.text = '{task}';
      valueLabel.fontSize = 14;
      valueLabel.valign = 'middle';
      valueLabel.align = 'center';
      valueLabel.wrap = true;
      valueLabel.fill = am4core.color('#FFFFFF');
      valueLabel.stroke = am4core.color('#000000');
      valueLabel.fontWeight = 'bold';
      valueLabel.strokeWidth = 0;
      valueLabel.events.on('sizechanged', (ev) => {
        const label = ev.target;
        const container = label.parent;
        label.maxWidth = container.measuredWidth - 8;
      });

      chart.scrollbarX = new am4core.Scrollbar();
      this.chart = chart;

      this.refreshData(chart);
    });

    this.slotClicked.subscribe(event => {
      this.zone.run(() => {
        this.selectedScheduleSlot = event.slot;
        this.selectedScheduleSlotMovie = event.movie;
        this.selectedScheduleSlotRoom = event.room;
      });
    });

    this.locationService.selectedLocationChanged.subscribe(result => {
      this.refreshChart();
    });
  }

  ngOnDestroy() {
    this.zone.runOutsideAngular(() => {
      if (this.chart) {
        this.chart.dispose();
      }
    });
  }

  public refreshChart() {
    this.refreshData(this.chart);
  }

  private refreshData(chart: am4charts.XYChart) {
    const colorSet = new am4core.ColorSet();
    if (!!this.locationService.getSelectedLocation()) {
      this.rooms = this.locationService.getSelectedLocation().rooms;
      const data = [];

      this.rooms.forEach(room => {
        // Only show rooms with a schedule
        if (room.scheduleId > 0) {
          const scheduleOfDay = room.schedule.movieSchedule.filter(x => this.checkDate(x.start));

          if (scheduleOfDay.length > 0) {
            scheduleOfDay.forEach(scheduleSlot => {
              scheduleSlot.scheduleId = room.scheduleId;
              scheduleSlot.room = room;
              data.push({
                category: room.name,
                start: moment(scheduleSlot.start).format('YYYY-MM-DD HH:mm'),
                end: moment(scheduleSlot.end).format('YYYY-MM-DD HH:mm'),
                color: colorSet.getIndex(data.length).brighten(0),
                task: scheduleSlot.movie.title,
                slot: scheduleSlot,
                movie: scheduleSlot.movie,
                room
              });
            });
          } else {
            data.push({
              category: room.name
            });
          }
        }
      });

      this.refreshPendingAndRunningMoviesCount();
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
  }

  private checkDate(scheduleSlotDateRaw) {
    const scheduleSlotDate = moment(scheduleSlotDateRaw);
    const selectedDate = moment(this.scheduleDate.value);

    return selectedDate.isSame(scheduleSlotDate, 'day');
  }

  public onScheduleMovie() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;
    dialogConfig.data = {
    };

    const dialogRef = this.dialog.open(DialogScheduleMovieComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      result => {
        if (!!result) {
          this.refreshChart();
        }
      }
    );
  }

  public getSeatCountForRoom(room: Room): number {
    if (!(!!room) || !(!!room.roomPlan) || !(!!room.roomPlan.seats)) {
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

  public getRemainingTime(scheduleSlot: ScheduleSlot, getPendingTime: boolean) {
    if (getPendingTime) {
      return moment(scheduleSlot.start).diff(moment(new Date()), 'minutes');
    } else {
      return moment(scheduleSlot.end).diff(moment(new Date()), 'minutes');
    }
  }

  public getRoomForScheduleSlot(scheduleSlot: ScheduleSlot) {
    return this.rooms.find(x => x.scheduleId === scheduleSlot.scheduleId);
  }

  public getOpenSeats(scheduleSlot: ScheduleSlot) {
    if (!!scheduleSlot && !!scheduleSlot.room && !!scheduleSlot.room.roomPlan){
      return this.getSeatCountForRoom(scheduleSlot.room) - scheduleSlot.reservations.length;
    } else {
      return 0;
    }
  }

  private refreshPendingAndRunningMoviesCount() {
    const pendingMovies: ScheduleSlot[] = [];
    const runningMovies: ScheduleSlot[] = [];
    this.rooms.forEach(room => {
      if (!!room.schedule) {
        room.schedule.movieSchedule.forEach(scheduleSlot => {
          if (moment(new Date()).isBetween(moment(scheduleSlot.start).subtract(30, 'minutes'), moment(scheduleSlot.start))) {
            pendingMovies.push(scheduleSlot);
          } else if (moment(new Date()).isBetween(moment(scheduleSlot.start), moment(scheduleSlot.end))) {
            runningMovies.push(scheduleSlot);
          }
        });
      }
    });

    pendingMovies.sort((a: ScheduleSlot, b: ScheduleSlot) => {
      return (this.getRemainingTime(a, true) as number) - (this.getRemainingTime(b, true) as number);
    });

    this.runningMovies.data = runningMovies;
    this.pendingMovies.data = pendingMovies;
  }
}
