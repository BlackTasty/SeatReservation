import { ScheduleCopyTarget } from './../../../../../shared/model/schedule-copy-target';
import { ScheduleSlot } from './../../../../../shared/model/schedule-slot';
import { ScheduleService } from './../../../../../core/services/schedule.service';
import { LocationService } from './../../../../../core/services/location.service';
import { Component, ElementRef, Inject, NgZone, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import * as moment from 'moment';

@Component({
  selector: 'app-dialog-copy-schedule',
  templateUrl: './dialog-copy-schedule.component.html',
  styleUrls: ['./dialog-copy-schedule.component.scss']
})
export class DialogCopyScheduleComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('chartElement') chartElement: ElementRef<HTMLElement>;

  public sourceScheduleDate: Date;
  public targetScheduleDate: Date;

  private chart: am4charts.XYChart;
  private sourceScheduleSlots: ScheduleSlot[];

  constructor(private dialogRef: MatDialogRef<DialogCopyScheduleComponent>,
              private zone: NgZone,
              private locationService: LocationService,
              private scheduleService: ScheduleService,
              @Inject(MAT_DIALOG_DATA) data) {
    if (!!data) {
      this.sourceScheduleDate = data.sourceDate;
    }
  }

  ngOnInit() {
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
      valueLabel.text = '';
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
      const rooms = this.locationService.getSelectedLocation().rooms;
      this.sourceScheduleSlots = [];
      const data = [];

      rooms.forEach(room => {
        // Only show rooms with a schedule
        if (room.scheduleId > 0) {
          const scheduleOfDay = room.schedule.movieSchedule.filter(x => this.checkDate(x.start));

          if (scheduleOfDay.length > 0) {
            scheduleOfDay.forEach(scheduleSlot => {
              scheduleSlot.scheduleId = room.scheduleId;
              scheduleSlot.room = room;
              this.sourceScheduleSlots.push(scheduleSlot);
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

      chart.data = data;
      const dateAxis: am4charts.DateAxis = chart.xAxes.values[0] as am4charts.DateAxis;
      const selectedDate: Date = this.sourceScheduleDate;
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
    const selectedDate = moment(this.sourceScheduleDate);

    return selectedDate.isSame(scheduleSlotDate, 'day');
  }

  public onConfirmClicked(): void {
    const scheduleSlotIds: number[] = [];
    const roomIds: number[] = [];

    this.sourceScheduleSlots.forEach(scheduleSlot => {
      scheduleSlotIds.push(scheduleSlot.id);
      roomIds.push(scheduleSlot.room.id);
    });

    this.scheduleService.copySchedule(new ScheduleCopyTarget(scheduleSlotIds, roomIds, this.targetScheduleDate)).subscribe(result => {
      if (!!result) {
        this.dialogRef.close(true);
      }
    });
  }

  public onAbortClicked(): void {
    this.dialogRef.close(false);
  }
}
