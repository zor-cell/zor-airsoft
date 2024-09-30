import { Component } from '@angular/core';
import { Types } from 'ably';
import { LoginService } from '../../services/login.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

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
    this.createOrJoinChannel(this.joinChannelId);
  }

  createChannel() {
    let id: string = Math.floor(Math.random() * 1000).toString();

    this.createOrJoinChannel(id);
  }

  private createOrJoinChannel(id: string) {
    this.channel = this.loginService.createChannel(id);
    this.channel.subscribe((msg: Types.Message) => {
      console.log("Ably message received", msg);
    });

    this.router.navigate(['/channels/', id]);
    this.toastr.success(`Connected to channel ${this.channel.name}`);
  }
}
