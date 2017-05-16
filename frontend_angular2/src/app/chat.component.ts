import {Component} from '@angular/core';
import {ChatService} from "./chat.service";
import {ActivatedRoute, Params} from "@angular/router";
import { CookieService} from "ngx-cookie";
import { Location } from '@angular/common'
import {User} from "./user";
import {HttpService} from "./http.service";


export class ChatItem{
  text: string;
  author: string;
}



@Component({
  moduleId: module.id,
  selector: 'chat',
  templateUrl: 'chat.component.html'
})
export class ChatComponent {
  curText : string = "";

  recipient_loaded: boolean = false;

  recipient: User = {
    username: "",
    token: "",
    messages: []
  };

  sender: User = {
    username: "",
    token: "",
    messages: []
  };
  chat_messages: ChatItem[] = [];

  constructor(private chatService: ChatService,    private route: ActivatedRoute,
              private location: Location, private _cookieService: CookieService, private httpService: HttpService) {

    console.log("Chat constructor called");

    this.route.params
      .switchMap((params: Params) => this.httpService.getUser(params['token']))
      .subscribe(user => {
        this.recipient = user;
        console.log("Recipient: " + this.recipient);
        this.msgSubscribe();
      });

      this.httpService.getUser(this._cookieService.get("token")).then(user => this.sender = user);
  }

  msgSubscribe(): void {
    this.chatService.messages.subscribe(msg => {
      console.log(this.recipient.username + ": " +  msg.text);
      let chatMsg: ChatItem = {
        text: msg.text,
        author: this.recipient.username
      };
      this.chat_messages.push(chatMsg)
    });
  }

  sendMsg() {
    let message = {
      recipient: this.recipient.token,
      text: this.curText,
      sender: this.sender.token
    };
    console.log(message);
    let chatMsg: ChatItem = {
        text: message.text,
        author: this.sender.username
      };
    this.chatService.messages.next(message);
    this.chat_messages.push(chatMsg);
    this.curText = '';
  }
}
