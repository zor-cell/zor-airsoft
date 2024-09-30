import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Globals {
  readonly clientUri: string = this.findClientUrl();

  private findClientUrl(): string {
    return window.location.protocol;
  }
}