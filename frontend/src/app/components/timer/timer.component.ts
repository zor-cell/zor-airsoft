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
  private _isRunning: boolean = false;

  @Input() set isRunning(value: boolean) {
    this._isRunning = value;
    this.manageInterval();
  }
  get isRunning(): boolean {
    return this._isRunning;
  }

  @Input() channelId!: string;
  @Input() teamId!: number;
  @Input() options!: ChannelOptions;
  @Input() color!: string;
  @Output() runningEvent = new EventEmitter<number>();

  interval: NodeJS.Timeout | null = null;
  secondsPassed: number = 0;

  constructor(private toastr: ToastrService, private loginService: LoginService) {}

  ngOnInit(): void {}

  mouseClick(event: any) {
    this.runningEvent.emit(this.teamId);
  }

  manageInterval() {
    //delete interval if timer is stopped and interval exists
    if(!this.isRunning) {
      if(this.interval != null) {
        clearInterval(this.interval);
        this.interval = null;
      }
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
