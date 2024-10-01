import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-total-timer',
  templateUrl: './total-timer.component.html',
  styleUrl: './total-timer.component.css'
})
export class TotalTimerComponent {
  @Input() totalTimerId!: number;
  @Input() color!: string;
  @Input() maxSeconds!: number;

  secondsPassed: number = 0;
  increment: number = 0;
  
  constructor() {}


}
