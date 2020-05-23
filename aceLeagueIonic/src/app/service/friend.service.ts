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
  addFriend(user){
    let token = this.securityService.getToken();
    return this.http.post(this.configUrl+"users/newfriend/",{user:user, token: token});
  }
  ListUnvalidateFriend(){
    let token = this.securityService.getToken();
    return this.http.post(this.configUrl+"/users/listvalidatefriend/",{token: token});
  }
  ValidateFriend(){
    let token = this.securityService.getToken();
    return this.http.post(this.configUrl+"users/validatefriend/",{token: token});
  }
  checkFriend(user){
    let token = this.securityService.getToken();
    return this.http.post(this.configUrl+"users/friend/check/",{user:user, token: token});
  }
}
