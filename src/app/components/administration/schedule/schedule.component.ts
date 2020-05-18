import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {
  public hours = ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00',
    '07:00', '08:00', '09:00', '10:00', '11:00',
    '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
    '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'];
  public rooms = ['01', '02', '03'];

  public data = [];

  public option = {
    tooltip: {
      position: 'top'
    },
    animation: false,
    grid: {
      height: '50%',
      top: '10%'
    },
    xAxis: {
      type: 'category',
      data: this.hours,
      splitArea: {
          show: true
      }
    },
    yAxis: {
      type: 'category',
      data: this.rooms,
      splitArea: {
          show: true
      }
    },
    visualMap: {
      min: 0,
      max: 10,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: '15%'
    },
    series: [{
      name: 'Punch Card',
      type: 'heatmap',
      data: this.data,
      label: {
          show: true
      },
      emphasis: {
          itemStyle: {
              shadowBlur: 10,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
      }
    }]
  };

  constructor() { }

  ngOnInit() {
  }

}
