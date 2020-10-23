import { Component, OnInit } from '@angular/core';
import { EChartOption } from 'echarts';

@Component({
  selector: 'app-movie-revenue-chart',
  templateUrl: './movie-revenue-chart.component.html',
  styleUrls: ['./movie-revenue-chart.component.scss']
})
export class MovieRevenueChartComponent implements OnInit {
  public chartOptions: EChartOption = {
    textStyle: {
      color: '#fff'
    },
    legend: {
      data: [],
      align: 'left',
      left: 10
    },
    tooltip: {
      trigger: 'item',
      formatter(params: any, ticket, callback) {
        if (params.value >= 0) {
          return params.marker + params.seriesName + '<br/>' + params.name + ': € ' + (+params.value).toFixed(2).replace('.', ',');
        } else {
          return params.marker + params.seriesName + '<br/>' + params.name + ': -€ ' + (params.value * (-1)).toFixed(2).replace('.', ',');
        }
    }
    },
    xAxis: {
        name: 'Rechnungstag',
        type: 'category',
        data: [],
        axisLabel: {
          margin: 20
        },
        axisLine: {
          lineStyle: {
            color: '#ddd'
          }
        }
    },
    yAxis: {
        name: 'Einnahmen',
        nameLocation: 'middle',
        nameRotate: 90,
        nameGap: 10,
        type: 'value',
        axisLabel: {
          color: '#fff',
          formatter(params: number, ticket, callback) {
            if (params >= 0) {
              return '€ ' + params.toFixed(2).replace('.', ',');
            } else {
              return '-€ ' + (params * (-1)).toFixed(2).replace('.', ',');
            }
          }
        },
        axisLine: {
          lineStyle: {
            color: '#ddd'
          }
        },
        nameTextStyle: {
          color: '#fff'
        }
    },
    series: [
      {
        name: 'Einnahmen',
        data: [],
        type: 'bar',
        label: {
          color: '#fff',
          textBorderColor: '#424242',
          show: true,
          position: 'top',
          formatter(params: any, ticket, callback) {
            if (params.value > 0) {
              return '€ ' + (+params.value).toFixed(2).replace('.', ',');
          } else if (params.value < 0) {
              return '-€ ' + (+params.value).toFixed(2).replace('.', ',');
            } else {
              return '';
            }
          },
          textBorderWidth: 2
        }
      }/*,
      {
        name: 'Verluste',
        data: [],
        type: 'bar',
        barGap: '-100%',
        barCategoryGap: '8%',
        label: {
          color: '#fff',
          textBorderColor: '#424242',
          show: true,
          position: 'bottom',
          formatter(params: any, ticket, callback) {
            if (params.value > 0) {
              return '€ ' + (+params.value).toFixed(2).replace('.', ',');
            } else if (params.value < 0) {
              return '€ ' + (+params.value).toFixed(2).replace('.', ',');
            } else {
              return '';
            }
          },
          textBorderWidth: 2
        }
      }*/
    ],
    grid: {
        left: 32,
        right: 120,
        width: 'calc(100% - 120px)'
    }
  };

  public updatedOptions: EChartOption;

  constructor() { }

  ngOnInit() {
  }

}
