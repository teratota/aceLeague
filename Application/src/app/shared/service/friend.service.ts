import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FriendService {

  constructor(private http: HttpClient) { }

  configUrl = 'http://localhost:4444/api/';

  getFriendList(token) {
    return this.http.get(this.configUrl+"users/friend/",token);
  }
}
