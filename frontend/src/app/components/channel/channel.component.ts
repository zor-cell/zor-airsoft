import { AfterViewInit, Component, OnInit, QueryList, ViewChildren, ChangeDetectorRef } from '@angular/core';
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
  winnerTeamId: number | null = null;

  constructor(private route: ActivatedRoute, 
    private cdr: ChangeDetectorRef, 
    private loginService: LoginService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(pathVariables => {
      this.channelId = pathVariables.get('id')!;
    });

    this.route.queryParams.subscribe(queryParams => {     
      this.options = {
        teamCount: Number(queryParams['teamCount']),
        maxSeconds: Number(queryParams['maxSeconds']),
        pressMilliseconds: Number(queryParams['pressMilliseconds'])
      }
    });

    this.channel = this.loginService.getChannel(this.channelId);
    this.channel.subscribe((msg : Types.Message) => {
      this.handleBroadcastMessage(msg);
    });
  }

  handleBroadcastMessage(msg: Types.Message) {
    //handles broadcasted messages
    //this gets executed on all clients
    if(msg.name === 'start-timer') {
      let timerId: number = msg.data.timerId!;
      let firstUpdate: boolean = msg.data.firstUpdate!;
      
      //manage total timers on all clients
      let currentTotalTimer = this.totalTimers.get(timerId);
      currentTotalTimer!.increment++;
      if(!firstUpdate) {
        this.totalTimers.filter((x, i) => i != timerId).forEach(timer => timer.increment = (timer.increment <= 0 ? 0 : timer.increment - 1));
      }

      if(!this.totalTimerInterval) {
        this.totalTimerInterval = setInterval(() => {
          this.totalTimers.forEach(timer => {
            timer.secondsPassed += timer.increment;
          });
        }, 1000);
      }
    } else if(msg.name === 'game-over') {
      let timerId: number = msg.data.fullTimerId;
      
      console.log(timerId);
    } else if(msg.name === '') {
      
    }
  }

  startTimerEvent(timerId: number) {
    //stop all inactive timers of the client where it was activated
    //only gets executed on the client, where a timer was started
    let activeTimer = this.localTimers.get(timerId);

    if(activeTimer!.isRunning === false) {
      //stop clients timers that have not been started
      let inactiveTimers = this.localTimers.filter((x, i) => i != timerId);
      for(let inactiveTimer of inactiveTimers) {
        inactiveTimer.isRunning = false;
      }

      //if all timers are on 0 (ie this is the first timer press)
      let firstUpdate: boolean = this.localTimers.filter(timer => timer.secondsPassed > 0).length === 0;

      //start clients timer that has been started
      activeTimer!.isRunning = true;

      //broadcast a message to the server to update all clients
      if(!this.channel) return;
      this.channel.publish('start-timer', { 
        timerId: timerId,
        firstUpdate: firstUpdate
      });
    }
  }

  //this event gets triggered when a total timer bar is full
  //this should always happen on all clients simultaniously
  timerFullEvent(totalTimerId: number) {
    if(this.winnerTeamId != null) return;

    if(this.totalTimerInterval) clearInterval(this.totalTimerInterval);

    this.localTimers.forEach(timer => timer.isRunning = false);
  
    this.winnerTeamId = totalTimerId;
    this.cdr.detectChanges();

    let audio = new Audio();
    audio.src = "../../assets/game-over.mp3";
    audio.load();
    audio.play();

    /*if(this.channel) {
      this.channel.publish('game-over', {
        fullTimerId: totalTimerId
      });
    }*/
  }
}
