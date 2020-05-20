import { Injectable } from '@angular/core';
import { SecurityService } from './security.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private http: HttpClient, private securityService: SecurityService) { }

  configUrl = 'http://localhost:4444/api/';

  addChat(data){
    console.log('addchat')
    let token = this.securityService.getToken();
    return this.http.post(this.configUrl+"chat/add/",{token: token,data:data});
  }

  getChat(){
    let token = this.securityService.getToken();
    return this.http.post(this.configUrl+"chat/get/",{token: token});
  }
}
