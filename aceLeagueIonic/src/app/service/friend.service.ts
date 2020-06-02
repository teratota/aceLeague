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
    user = this.securityService.encode(JSON.stringify(user))
    return this.http.post(this.configUrl+"users/friend/",{user:user, token: token});
  }
  addFriend(user){
    let token = this.securityService.getToken();
    user = this.securityService.encode(JSON.stringify(user))
    return this.http.post(this.configUrl+"users/newfriend/",{user:user, token: token});
  }
  ListUnvalidateFriend(){
    let token = this.securityService.getToken();
    return this.http.post(this.configUrl+"/users/listvalidatefriend/",{token: token});
  }
  ValidateFriend(validate,id){
    let token = this.securityService.getToken();
    id = this.securityService.encode(JSON.stringify(id))
    validate = this.securityService.encode(JSON.stringify(validate))
    return this.http.post(this.configUrl+"users/validatefriend/",{validate:validate,id:id,token: token});
  }
  checkFriend(user){
    let token = this.securityService.getToken();
    user = this.securityService.encode(JSON.stringify(user))
    return this.http.post(this.configUrl+"users/friend/check/",{user:user, token: token});
  }
}
