import {Component, OnInit} from '@angular/core';
import 'rxjs/add/operator/toPromise';
import {HttpService} from "./http.service";
import {User} from "./user";
import {CookieService} from "ngx-cookie";

@Component({
  moduleId: module.id,
  selector: 'chats-list',
  templateUrl: `chats.component.html`,
  styleUrls: [ `chats.component.css`]
})
export class ChatsComponent implements OnInit {
  users : User[];
  chats : User[];
  user: User = {
    username: "",
    token: "",
    messages: []
  };

  constructor(
    private httpService: HttpService,
    private _cookieService: CookieService
  ){
  }

  ngOnInit(): void {
    this.getCurUser();
    this.getUsers();
    this.getChats();
  }

  getCurUser(): void{
    this.httpService.getUser(this._cookieService.get("token")).then(user => this.user = user)
  }

  getUsers(): void{
    this.httpService.getUsers().then(users => this.users = users)
  }

  getChats(): void {
    this.httpService.getChats().then(chats => this.chats = chats)
  }

  addChat(user: User){
    for(let i = 0; i < this.chats.length; i++){
      if(this.chats[i] == user){
        return;
      }
    }
    this.chats.push(user);
    this.httpService.addChat(user);
  }

}
