import {NgModule}      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { ChatsComponent}  from './chats.component';


import { HttpModule } from "@angular/http";
import { HttpService } from "./http.service";
import { AppRoutingModule } from "./app-routing.module";
import { CookieModule } from 'ngx-cookie';
import { ChatComponent } from "./chat.component";
import { AppComponent } from "./app.component";
import {ChatService} from "./chat.service";
import {WebsocketService} from "./websocket.service";
import {FormsModule} from "@angular/forms";

@NgModule({
  imports:      [ BrowserModule,
    HttpModule,
    AppRoutingModule,
    CookieModule.forRoot(),
    FormsModule
  ],
  declarations: [ AppComponent,
    ChatComponent,
    ChatsComponent
  ],
  bootstrap:    [AppComponent],
  providers: [HttpService, ChatService, WebsocketService]
})
export class AppModule{
}
