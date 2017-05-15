import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Rx';
import { WebsocketService } from './websocket.service';
import {Message} from "./message";

const CHAT_URL = 'ws://localhost:8000/chat';


@Injectable()
export class ChatService {
  public messages: Subject<Message>;

  constructor(wsService: WebsocketService) {
    this.messages = <Subject<Message>>wsService
      .connect(CHAT_URL)
      .map((response: MessageEvent): Message => {
        let data = JSON.parse(response.data);
        console.log(data);
        return {
          sender: data.sender,
          recipient: data.recipient,
          text: data.text
        }
      });
  }
}
