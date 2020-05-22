import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SecurityService } from './security.service';

@Injectable({
  providedIn: 'root'
})
export class FriendService {

  constructor(private http: HttpClient, private securityService: SecurityService) { }

  configUrl = 'http://localhost:4444/api/';

  getFriendList(user) {
    let token = this.securityService.getToken();
    return this.http.post(this.configUrl+"users/friend/",{user:user, token: token});
  }
}
