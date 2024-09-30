import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrl: './channel.component.css'
})
export class ChannelComponent {
  channelId: string = "";

  constructor(route: ActivatedRoute) {
    let id: string = route.snapshot.paramMap.get('id')!;

    this.channelId = id;
  }
}
