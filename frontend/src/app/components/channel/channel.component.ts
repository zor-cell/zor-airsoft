import { AfterViewInit, Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChannelOptions } from '../../classes/channelOptions';
import { TimerComponent } from '../timer/timer.component';
import { Types } from 'ably';
import { LoginService } from '../../services/login.service';
import { TotalTimerComponent } from '../total-timer/total-timer.component';

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrl: './channel.component.css'
})
export class ChannelComponent implements OnInit {
  //the available team colors
  readonly colors: string[] = ['rgba(225, 25, 25)', 'rgba(50, 150, 255)', 'rgba(150, 200, 0)', 'rgba(250, 100, 0)'];
  //the channel to be handled
  private channel: Types.RealtimeChannelPromise | null = null;

  //all simple timer components (local timer for a team)
  @ViewChildren(TimerComponent) localTimers!: QueryList<TimerComponent>;
  //all total timer components (timer bars accumulating all times of a team)
  @ViewChildren(TotalTimerComponent) totalTimers!: QueryList<TotalTimerComponent>;

  //the repeating time interval to update all total timers on all clients
  totalTimerInterval: NodeJS.Timeout | null = null;

  //the handled channels channel id
  channelId: string = "";
  //the handled channels channel options
  options!: ChannelOptions;

  constructor(private route: ActivatedRoute, private loginService: LoginService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(pathVariables => {
      this.channelId = pathVariables.get('id')!;
    });

    this.route.queryParams.subscribe(queryParams => {     
      this.options = {
        teamCount: Number(queryParams['teamCount']),
        maxSeconds: Number(queryParams['maxSeconds'])
      }
    });

    this.channel = this.loginService.getChannel(this.channelId);
    this.channel.subscribe((msg : Types.Message) => {
      this.handleBroadcastMessage(msg);
    });
  }

  startTimerEvent(timerId: number) {
    //stop all inactive timers of the client where it was activated
    let inactiveTimers = this.localTimers.filter((x, i) => i != timerId);
    for(let inactiveTimer of inactiveTimers) {
      inactiveTimer.isRunning = false;
    }

    let activeTimer = this.localTimers.get(timerId);

    //start the clients timer if it is not running
    if(activeTimer!.isRunning === false) {
      activeTimer!.isRunning = true;

      //broadcast a message to the server to update all clients
      if(!this.channel) return;
      this.channel.publish('start-timer', { 
        timerId: timerId,
        secondsPassed: activeTimer!.secondsPassed
      });
    }
  }

  handleBroadcastMessage(msg: Types.Message) {
    if(msg.name === 'start-timer') {
      let timerId: number = msg.data.timerId!;
      let secondsPassed: number = msg.data.secondsPassed!;
      
      let currentTotalTimer = this.totalTimers.get(timerId);
      currentTotalTimer!.increment++;

      this.totalTimers.filter((x, i) => i != timerId).forEach(timer => timer.increment = (timer.increment <= 0 ? 0 : timer.increment - 1));

      if(!this.totalTimerInterval) {
        this.totalTimerInterval = setInterval(() => {
          this.totalTimers.forEach(timer => {
            timer.secondsPassed += timer.increment;
          });
        }, 1000);
      }

      //interval needs to be started for correct timerSum
      /*let interval = setInterval(() => {
        this.timerSums[activeTimerId]++;
      }, 1000);
      this.timerIntervals[activeTimerId] = interval;*/
    } else if(msg.name === 'game-over') {
      let timerId: number = msg.data.fullTimerId;
      
      console.log(timerId);
    } else if(msg.name === '') {
      
    }
  }

  timerFullEvent(totalTimerId: number) {
    if(this.totalTimerInterval) clearInterval(this.totalTimerInterval);

    if(this.channel) {
      this.channel.publish('game-over', {
        fullTimerId: totalTimerId
      });
    }
  }
}
