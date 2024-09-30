import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TimerService } from '../../services/timer.service';
import { Types } from 'ably';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from '../../services/login.service';
import { ChannelOptions } from '../../classes/channelOptions';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrl: './timer.component.css'
})
export class TimerComponent implements OnInit {
  private channel: Types.RealtimeChannelPromise | null = null;

  @Input() teamId!: number;
  @Input() options!: ChannelOptions;
  @Input() color!: string;
  @Input() isRunning: boolean = false;
  @Output() runningEvent = new EventEmitter<number>();
  
  interval: NodeJS.Timeout | null = null;
  secondsPassed: number = 0;

  constructor(private toastr: ToastrService, private loginService: LoginService) {}

  ngOnInit(): void {
    //this.loginService.createChannel().subscribe()
  }

  publish() {
    if(!this.channel) return;

    this.channel.publish("hello-world-message", { message: "Hello world!" });
  }

  mouseClick(event: any) {
    //console.log(event)

    this.isRunning = true;
    this.runningEvent.emit(this.teamId);

    //init interval when timer is running and it hasnt started yet
    this.manageInterval();
  }

  manageInterval() {
    //delete interval if timer is stopped and interval exists
    if(!this.isRunning && this.interval) {
      clearInterval(this.interval);
      return;
    }

    //create time if timer is running and interval does not exist
    if(!this.interval) {
      this.interval = setInterval(() => {
        //increase time until max time is reached
        if(this.secondsPassed < this.options.maxSeconds) this.secondsPassed++;
        else {
          //delete interval if max time is reached
          if(this.interval) clearInterval(this.interval);
        }
      }, 1000);
    }
  }
}
