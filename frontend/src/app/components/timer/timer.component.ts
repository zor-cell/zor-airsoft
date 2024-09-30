import { Component } from '@angular/core';
import { TimerService } from '../../services/timer.service';
import { Types } from 'ably';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrl: './timer.component.css'
})
export class TimerComponent {
  private channel: Types.RealtimeChannelPromise | null = null;

  constructor(private toastr: ToastrService, private timerService: TimerService) {}

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

    this.channel.subscribe((msg: Types.Message) => {
      console.log("Ably message received", msg);
    });
    this.toastr.success(`Connected to channel ${this.channel.name}`);    
  }

  publish() {
    if(!this.channel) return;

    this.channel.publish("hello-world-message", { message: "Hello world!" });
  }
}
