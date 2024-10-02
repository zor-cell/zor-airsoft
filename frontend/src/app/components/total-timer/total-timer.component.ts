import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-total-timer',
  templateUrl: './total-timer.component.html',
  styleUrl: './total-timer.component.css'
})
export class TotalTimerComponent {
  //the percentage of the timer bar that is always shown
  readonly offset: number = 10;

  @Input() totalTimerId!: number;
  @Input() color!: string;
  @Input() maxSeconds!: number;
  @Output() timerFullEvent = new EventEmitter<number>;

  timerIsFull: boolean = false;
  secondsPassed: number = 0;
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
