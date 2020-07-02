import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SecurityService } from './security.service';
import { api_path } from '../includes/api_path.js';

@Injectable({
  providedIn: 'root'
})
export class FriendService {

  constructor(private http: HttpClient, private securityService: SecurityService) { }

  configUrl = api_path;

  getFriendList(user) {
    const token = this.securityService.getToken();
    user = this.securityService.encode(JSON.stringify(user));
    return this.http.post(this.configUrl + 'users/friend/', {user, token});
  }

  addFriend(user) {
    const token = this.securityService.getToken();
    user = this.securityService.encode(JSON.stringify(user));
    return this.http.post(this.configUrl + 'users/newfriend/', {user, token});
  }

  ListUnvalidateFriend() {
    const token = this.securityService.getToken();
    return this.http.post(this.configUrl + '/users/listvalidatefriend/', {token});
  }

  ValidateFriend(validate, id) {
    const token = this.securityService.getToken();
    id = this.securityService.encode(JSON.stringify(id));
    validate = this.securityService.encode(JSON.stringify(validate));
    return this.http.post(this.configUrl + 'users/validatefriend/', {validate, id, token});
  }

  checkFriend(user) {
    const token = this.securityService.getToken();
    user = this.securityService.encode(JSON.stringify(user));
    return this.http.post(this.configUrl + 'users/friend/check/', {user, token});
  }

  deleteFriend(id) {
    const token = this.securityService.getToken();
    id = this.securityService.encode(JSON.stringify(id));
    return this.http.post(this.configUrl + 'users/friend/delete/', {id, token});
  }
}
