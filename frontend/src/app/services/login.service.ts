import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import {Globals} from '../global/globals';
import { Types } from "ably";
import * as Ably from "ably/promises";
import { ChannelOptions } from '../classes/channelOptions';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor() { }

  getChannel(id: string) {
    //connect to socket connection
    const connection: Types.RealtimePromise = new Ably.Realtime.Promise({ authUrl: `/.netlify/functions/ably-token-request` });
    const channel: Types.RealtimeChannelPromise = connection.channels.get(id);  
    
    return channel;
  }

  createChannel(id: string, options: ChannelOptions) {
    //create socket connection
    const clientId = "host"; 
    const connection: Types.RealtimePromise = new Ably.Realtime.Promise({ authUrl: `/.netlify/functions/ably-token-request?clientId=${clientId}`});
    const channel: Types.RealtimeChannelPromise = connection.channels.get(id);

    //enter host game options to be applied to all clients
    channel.presence.enterClient(clientId, options);

    return channel;
  }
}
