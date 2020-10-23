import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'minuteParser'
})
export class MinuteParserPipe implements PipeTransform {

  transform(value: any, args?: string): any {
    const hours = Math.floor(value / 60);
    const minutes = value % 60;

    if (!!args) {
      return args.replace('{h}', hours.toString())
                 .replace('{m}', minutes.toString().padStart(2, '0'));
    }

    return String(hours).padStart(2, '0') + ':' + String(minutes).padStart(2, '0');
  }

}
