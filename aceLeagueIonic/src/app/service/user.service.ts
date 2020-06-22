import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SecurityService } from './security.service';
import { api_path } from '../includes/api_path.js';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private securityService: SecurityService) { }
  configUrl = api_path;
  

  connection(data) {
    data = this.securityService.encode(JSON.stringify(data))
    return this.http.post(this.configUrl+"users/login", {data: data});
  }

  getInfosUser(user) {
    let token = this.securityService.getToken();
    user = this.securityService.encode(JSON.stringify(user))
    return this.http.post(this.configUrl+"users/me/", {user:user,token: token});
  }

  newUser(data,file): any {
    data = this.securityService.encode(JSON.stringify(data))
    file = this.securityService.encode(JSON.stringify(file))
    return this.http.post(this.configUrl+"users/register/", {form:data, file:file});
  }

  testConnection() {
    let token = this.securityService.getToken();
    return this.http.post(this.configUrl+"users/test/", {token: token});
  }

  getlist(value) {
    let token = this.securityService.getToken();
    value = this.securityService.encode(JSON.stringify(value))
    return this.http.post(this.configUrl+"users/getlist", {data: value, token: token});
  }

  userUpdate(value){
    let token = this.securityService.getToken();
    value = this.securityService.encode(JSON.stringify(value))
    return this.http.post(this.configUrl+"users/update", {data: value, token: token});
  }
  updateUserImage(file){
    let token = this.securityService.getToken();
    file = this.securityService.encode(JSON.stringify(file))
    return this.http.post(this.configUrl+"users/update/image",{file: file,token: token});
  }

  isCurrentUser(user){
    let token = this.securityService.getToken();
    user = this.securityService.encode(JSON.stringify(user))
    return this.http.post(this.configUrl+"users/isCurrentUser",{user: user,token: token});
  }
}
