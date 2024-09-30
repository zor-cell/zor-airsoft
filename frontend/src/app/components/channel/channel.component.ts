import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChannelOptions } from '../../classes/channelOptions';

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrl: './channel.component.css'
})
export class ChannelComponent implements OnInit {
  readonly colors: string[] = ['rgba(200, 0, 0)', 'rgba(0, 200, 0)', 'rgba(0, 0, 240)'];

  channelId: string = "";
  options!: ChannelOptions;

  constructor(private route: ActivatedRoute) {}

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
  }

  runningEvent(teamId: number) {
    console.log(teamId);
  }
}
