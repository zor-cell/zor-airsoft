import { AfterViewInit, Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChannelOptions } from '../../classes/channelOptions';
import { TimerComponent } from '../timer/timer.component';
import { Types } from 'ably';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrl: './channel.component.css'
})
export class ChannelComponent implements OnInit {
  readonly colors: string[] = ['rgba(200, 0, 0)', 'rgba(0, 200, 0)', 'rgba(0, 0, 240)'];
  private channel: Types.RealtimeChannelPromise | null = null;

  @ViewChildren(TimerComponent) timers!: QueryList<TimerComponent>;

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
    console.log(this.channel)
    this.channel.subscribe((msg : Types.Message) => {
      this.handleMessage(msg);
    });
  }

  updateActiveTimerEvent(activeTimerId: number) {
    //send a message to the server to update all clients
    if(!this.channel) return;
    this.channel.publish('update-active', { 
      activeTimerId: activeTimerId
    });
  }

  handleMessage(msg: Types.Message) {
    if(msg.name === 'update-active') {
      //stop all timer except for the active one
      let inactiveTimers = this.timers.filter((x, i) => i != msg.data.activeTimerId);
      for(let inactiveTimer of inactiveTimers) {
        inactiveTimer.isRunning = false;
      }

      //start the active timer
      let activeTimer = this.timers.get(msg.data.activeTimerId)!;      
      activeTimer.isRunning = true;
    } else if(msg.name === 'game-over') {

    } else if(msg.name === '') {
      
    }
  }
}
