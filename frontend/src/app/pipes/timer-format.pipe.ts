import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timerFormat'
})
export class TimerFormatPipe implements PipeTransform {

  transform(value: number): string {
    const minutes: number = Math.floor(value / 60);
    const seconds: number = value % 60;

    const formattedMinutes: string = minutes < 10 ? '0' + minutes : minutes.toString();
    const formattedSeconds: string = seconds < 10 ? '0' + seconds : seconds.toString();

    return `${formattedMinutes}:${formattedSeconds}`;
  }
}
