import {Component, OnInit} from '@angular/core';
import {HttpService} from "./http.service";
import {CookieService} from "ngx-cookie";
import {User} from "./user";
@Component({
  selector: 'my-app',
  template: `
    <router-outlet></router-outlet>
  `
})
export class AppComponent{

}
