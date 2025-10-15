import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeFormat'
})
export class TimeFormatPipe implements PipeTransform {

  // Format time from mySQLs "HH:mm:ss" to "h:mm am/pm"
  transform(time?: string): string {
    if (!time) return '';
    const [hour, minute] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(hour, minute);
    return date.toLocaleTimeString('en-AU', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).toLowerCase();  // e.g. 8:00 am
  }
}