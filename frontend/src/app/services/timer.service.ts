import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import {Globals} from '../global/globals';
import { Types } from "ably";
import * as Ably from "ably/promises";

@Injectable({
  providedIn: 'root'
})
export class TimerService {
  private messageBaseUri: string = this.globals.clientUri + '/hello';

  constructor(private httpClient: HttpClient, private globals: Globals) { }

  getAllMessages(): Observable<string> {  
    return this.httpClient.get<string>(this.messageBaseUri);
  }

 init() {
    const optionalClientId = "optionalClientId"; 
    // When not provided in authUrl, a default will be used.
    const connection: Types.RealtimePromise = new Ably.Realtime.Promise({ authUrl: `/.netlify/functions/ably-token-request?clientId=${optionalClientId}` });
    const channel: Types.RealtimeChannelPromise = connection.channels.get("some-channel-name");
  
    return channel;
  }
}
