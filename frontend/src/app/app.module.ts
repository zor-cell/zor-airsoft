import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app.component';
import { TimerComponent } from './components/timer/timer.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { LoginComponent } from './components/login/login.component';
import { ChannelComponent } from './components/channel/channel.component'
import { FormsModule } from '@angular/forms';
import { TimerFormatPipe } from './pipes/timer-format.pipe';

@NgModule({
  declarations: [
    AppComponent,
    TimerComponent,
    LoginComponent,
    ChannelComponent,
    TimerFormatPipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NgbModule,
    AppRoutingModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
