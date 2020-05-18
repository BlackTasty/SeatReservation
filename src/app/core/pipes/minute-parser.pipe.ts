import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'minuteParser'
})
export class MinuteParserPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    const hours = Math.floor(value / 60);
    const minutes = value % 60;

    return String(hours).padStart(2, '0') + ':' + String(minutes).padStart(2, '0');
  }

}
