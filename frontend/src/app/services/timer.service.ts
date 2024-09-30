import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import {Globals} from '../global/globals';

@Injectable({
  providedIn: 'root'
})
export class TimerService {
  private messageBaseUri: string = this.globals.clientUri + '/hello';

  constructor(private httpClient: HttpClient, private globals: Globals) { }

  getAllMessages(): Observable<string> {  
    return this.httpClient.get<string>(this.messageBaseUri);
  }
}
