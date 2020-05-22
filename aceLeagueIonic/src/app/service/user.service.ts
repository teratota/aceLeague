import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SecurityService } from './security.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private securityService: SecurityService) { }
  configUrl = 'http://localhost:4444/api/';

  connection(data) {
    console.log("connection");
    return this.http.post(this.configUrl+"users/login", data);
  }

  getInfosUser() {
    let token = this.securityService.getToken();
    return this.http.post(this.configUrl+"users/me/", {token: token});
  }

  newUser(data,file): any {
    console.log("newUser");
    return this.http.post(this.configUrl+"users/register/", {form:data, file:file});
  }

  testConnection() {
    let token = this.securityService.getToken();
    return this.http.post(this.configUrl+"users/test/", {token: token});
  }

  getlist(value) {
    let token = this.securityService.getToken();
    return this.http.post(this.configUrl+"users/getlist", {data: value, token: token});
  }

  userUpdate(value){
    let token = this.securityService.getToken();
    return this.http.post(this.configUrl+"users/update", {data: value, token: token});
  }
  updateUserImage(file){
    let token = this.securityService.getToken();
    return this.http.post(this.configUrl+"users/update/image",{file: file,token: token});
  }

}
