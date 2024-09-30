import { Component } from '@angular/core';
import { TimerService } from '../../services/timer.service';
import { Types } from 'ably';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrl: './timer.component.css'
})
export class TimerComponent {
  private channel: Types.RealtimeChannelPromise | null = null;

  constructor(private timerService: TimerService) {}

  mouseClick(event: any) {
    console.log("request sent");
    this.timerService.getAllMessages().subscribe({
      next: result => {
        console.log(result);
      }
    });
  }

  init(event: any) {
    this.channel = this.timerService.init();

    console.log(`Subscribing to channel ${this.channel.name}`);
    this.channel.subscribe((msg: Types.Message) => {
      console.log("Ably message received", msg);
    });
  }

  publish() {
    if(!this.channel) return;

    this.channel.publish("hello-world-message", { message: "Hello world!" });
  }
}
