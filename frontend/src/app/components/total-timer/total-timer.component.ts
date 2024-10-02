import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-total-timer',
  templateUrl: './total-timer.component.html',
  styleUrl: './total-timer.component.css'
})
export class TotalTimerComponent {
  //the percentage of the timer bar that is always shown
  readonly offset: number = 10;

  private _color: string = 'rgba(0, 0, 0, 0)';
  @Input() set color(value: string) {
    this._color = value;
  }
  get color(): string {
    if(this.increment === 0) {
      const rgbaMatch = this._color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);
      if (rgbaMatch) {
        const [_, r, g, b] = rgbaMatch;
        return `rgba(${r}, ${g}, ${b}, ${0.7})`;
      }
    }

    return this._color;
  }

  @Input() totalTimerId!: number;
  @Input() maxSeconds!: number;
  @Output() timerFullEvent = new EventEmitter<number>;

  timerIsFull: boolean = false;
  secondsPassed: number = 0;

  //can be seen as shared variable
  //increment 
  increment: number = 0;

  get currentPercent() {
    if(!this.maxSeconds) return 0;

    if(!this.timerIsFull && this.secondsPassed >= this.maxSeconds) {
      this.timerFullEvent.emit(this.totalTimerId);
      this.timerIsFull = true;
    }

    return this.offset + Math.min(this.secondsPassed / this.maxSeconds, 1) * (100 - this.offset);
  }
  
  constructor() {}


}
