import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
  //is running
  private _isRunning: boolean = false;
  @Input() set isRunning(value: boolean) {
    this._isRunning = value;
    this.manageInterval();
  }
  get isRunning(): boolean {
    return this._isRunning;
  }

  //color
  private _color: string = 'rgba(0, 0, 0, 0)';
  @Input() set color(value: string) {
    this._color = value;
  }
  get color(): string {
    if(!this.isRunning) {
      const rgbaMatch = this._color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);
      if (rgbaMatch) {
        const [_, r, g, b] = rgbaMatch;
        return `rgba(${r}, ${g}, ${b}, ${0.7})`;
      }
    }

    return this._color;
  }

  get activeColor(): string {
    const rgbaMatch = this._color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);
    if (rgbaMatch) {
      const [_, r, g, b] = rgbaMatch;
      return `rgb(${r}, ${g}, ${b})`;
    }

    return this._color;
  }

  @Input() timerId!: number;
  @Input() options!: ChannelOptions;
  @Output() activeTimerEvent = new EventEmitter<number>();

  interval: NodeJS.Timeout | null = null;
  pressTimer: NodeJS.Timeout | null = null;
  secondsPassed: number = 0;

  backgroundSize = '100% 0%';
  transitionEnabled = true;

  constructor(private toastr: ToastrService) {}

  ngOnInit(): void {}

  private startPressTransition() {
    if(!this.isRunning) {
      this.transitionEnabled = true;
      this.backgroundSize = '100% 100%';
    }
  }

  private resetPressTransition() {
    this.transitionEnabled = false;
    this.backgroundSize = '100% 0%';
  }

  onPressStart() {
    this.startPressTransition();

    this.pressTimer = setTimeout(() => {
      this.resetPressTransition();
      this.longPress();
    }, this.options.pressMilliseconds);
  }

  onPressEnd() {
    this.resetPressTransition();

    if(this.pressTimer) clearTimeout(this.pressTimer);
  }

  longPress() {
    this.activeTimerEvent.emit(this.timerId);
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
