import {Component, OnInit} from '@angular/core';
import {Http} from "@angular/http";
@Component({
  selector: 'my-app',
  template: `
    <router-outlet></router-outlet>
  `
})
export class AppComponent{
  constructor(private http: Http){
    this.http.get('http://localhost:8000', { withCredentials: true }).toPromise()
      .then();
  }

}
