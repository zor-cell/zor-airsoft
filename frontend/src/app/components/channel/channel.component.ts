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
export class ChannelComponent implements OnInit, AfterViewInit {
  readonly colors: string[] = ['rgba(200, 0, 0)', 'rgba(0, 200, 0)', 'rgba(0, 0, 240)'];
  private channel: Types.RealtimeChannelPromise | null = null;

  @ViewChildren(TimerComponent) timers!: QueryList<TimerComponent>;
  @ViewChildren(TotalTimerComponent) totalTimers!: QueryList<TotalTimerComponent>;
  totalTimerInterval: NodeJS.Timeout | null = null;

  channelId: string = "";
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
      this.handleMessage(msg);
    });
  }

  ngAfterViewInit(): void {
    //this.timerSums = Array<number>(this.timers.length).fill(0);
    //this.timerIntervals = Array<NodeJS.Timeout>(this.timers.length);
  }

  updateActiveTimerEvent(timerId: number) {
    //CLIENT HANDLING
    //stop all inactive timers of the client where it was activated
    let inactiveTimers = this.timers.filter((x, i) => i != timerId);
    for(let inactiveTimer of inactiveTimers) {
      inactiveTimer.isRunning = false;
    }

    //start the active timer of the client
    let activeTimer = this.timers.get(timerId);
    activeTimer!.isRunning = true;


  
    //SERVER HANDLING
    //send a message to the server to update all clients
    if(!this.channel) return;
    this.channel.publish('start-timer', { 
      timerId: timerId,
      secondsPassed: activeTimer!.secondsPassed
    });
  }

  handleMessage(msg: Types.Message) {
    if(msg.name === 'start-timer') {
      let timerId: number = msg.data.timerId!;
      let secondsPassed: number = msg.data.secondsPassed!;
      
      console.log(this.totalTimers)

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

    } else if(msg.name === '') {
      
    }
  }
}
