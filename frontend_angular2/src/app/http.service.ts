import {Injectable} from "@angular/core";
import {User} from "./user";
import {Http, RequestOptions, URLSearchParams} from "@angular/http";
import 'rxjs/add/operator/toPromise';


@Injectable()
export class HttpService {
  private users_url = 'http://localhost:8000/users';
  private chats_url = 'http://localhost:8000/chats';
  private user_url = 'http://localhost:8000/user';

  constructor(private http: Http){}

  getChats(): Promise<User[]>{
    console.log("HttpService.getChats()");
    return this.http.get(this.chats_url, { withCredentials: true })
      .toPromise()
      .then(response => response.json() as User[])
      .catch(this.handleError);
  }

  getUser(token: string): Promise<User>{
    console.log("HttpService.getUser()");
    let params: URLSearchParams = new URLSearchParams();
    params.set('token', token);

    return this.http.get(this.user_url, {
      search: params
    }).toPromise()
      .then(response => response.json() as User)
      .catch(this.handleError);
  }

  getUsers(): Promise<User[]>{
    console.log("HttpService.getUsers()");
    return this.http.get(this.users_url)
      .toPromise()
      .then(response => response.json() as User[])
      .catch(this.handleError);
  }

  addChat(user: User) {
    console.log("HttpService.addChat()");
    let body = "recipient="+user.token;
    let options = new RequestOptions({
      withCredentials: true
    });

    return this.http.post(this.chats_url, JSON.stringify({"recipient": user.token}), options)
      .subscribe()
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
