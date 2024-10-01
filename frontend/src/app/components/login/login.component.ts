import { Component, TemplateRef } from '@angular/core';
import { Types } from 'ably';
import { LoginService } from '../../services/login.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ChannelOptions } from '../../classes/channelOptions';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SettingsComponent } from '../settings/settings.component';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  joinChannelId: string = "";
  channelOptions: ChannelOptions = {
    teamCount: 2, 
    maxSeconds: 500
  };

  constructor(private toastr: ToastrService, 
    private modalService: NgbModal,
    private loginService: LoginService,
    private router: Router) {}

  joinChannel() {
    if(this.joinChannelId === '') {
      this.toastr.error(`Channel ID cannot be empty`);
      return;
    }

    let channel = this.loginService.getChannel(this.joinChannelId);

    //check if the host has posted presence data
    channel.presence.get()
    .then(messages => {
      let hostMessage = messages.find(x => x.clientId === 'host');

      if(hostMessage === undefined) {
        this.toastr.error(`Could not join channel ${channel.name}`);
      } else {
        this.router.navigate(['/channels/', this.joinChannelId], {queryParams: hostMessage.data});
        this.toastr.success(`Joined channel ${channel.name}`);
      }
    });
  }

  createChannel() {
    let id: string = Math.floor(Math.random() * 1000).toString();

    let channel = this.loginService.createChannel(id, this.channelOptions);

    this.router.navigate(['/channels/', id], {queryParams: this.channelOptions});
    this.toastr.success(`Created channel ${channel.name}`);
  }

  openSettingsModal(modal: TemplateRef<NgbModal>) {
    this.modalService.open(modal);
  }
}
