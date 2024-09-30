import { Component } from '@angular/core';
import { Types } from 'ably';
import { LoginService } from '../../services/login.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ChannelOptions } from '../../classes/channelOptions';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  joinChannelId: string = "";
  channel: Types.RealtimeChannelPromise | null = null;

  constructor(private toastr: ToastrService, 
    private loginService: LoginService,
    private router: Router) {}

  joinChannel() {
    this.channel = this.loginService.getChannel(this.joinChannelId);
    this.channel.subscribe((msg: Types.Message) => {
      console.log("Ably message received", msg);
    });

    //check if the host has posted presence data
    //only then can the use join the channel
    this.channel.presence.subscribe(presence => {
      console.log(presence.data)
      /*if(presence.data === undefined) {
        this.toastr.error(`Could not join channel ${this.channel!.name}`);
        return;
      }*/

      this.router.navigate(['/channels/', this.joinChannelId], {queryParams: presence.data});
      this.toastr.success(`Joined channel ${this.channel!.name}`);
    });
  }

  createChannel() {
    let id: string = Math.floor(Math.random() * 1000).toString();
    let options: ChannelOptions = {
      teamCount: 2,
      maxSeconds: 6
    }

    this.channel = this.loginService.createChannel(id, options);
    this.channel.subscribe((msg: Types.Message) => {
      console.log("Ably message received", msg);
    });

    this.router.navigate(['/channels/', id], {queryParams: options});
    this.toastr.success(`Created channel ${this.channel.name}`);
  }
}
