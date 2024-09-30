import { Component } from '@angular/core';
import { TimerService } from '../../services/timer.service';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrl: './timer.component.css'
})
export class TimerComponent {
  constructor(private timerService: TimerService) {}

  mouseClick(event: any) {
    console.log("request sent");
    this.timerService.getAllMessages().subscribe({
      next: result => {
        console.log(result);
      }
    });
  }
}
