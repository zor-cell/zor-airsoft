import { Component, OnInit } from '@angular/core';
import { TimerService } from '../../services/timer.service';
import { Types } from 'ably';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrl: './timer.component.css'
})
export class TimerComponent implements OnInit {
  private channel: Types.RealtimeChannelPromise | null = null;

  isRunning: boolean = false;
  interval: NodeJS.Timeout | null = null;
  time: number = 0;
  color: string = "#0000ff55";

  constructor(private toastr: ToastrService, private loginService: LoginService) {}

  ngOnInit(): void {
    //this.loginService.createChannel().subscribe()
  }

  publish() {
    if(!this.channel) return;

    this.channel.publish("hello-world-message", { message: "Hello world!" });
  }

  mouseClick(event: any) {
    console.log(event)

    this.isRunning = !this.isRunning;

    if(this.isRunning) {
      this.color = "#0000ffbb";
      this.interval = setInterval(() => {
          this.time++;
      }, 1000);
    } else {
      if(this.interval) {
        this.color = "#0000ff55";
        clearInterval(this.interval);
      }
    }
  }
}
