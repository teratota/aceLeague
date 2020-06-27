import { Injectable } from '@angular/core';
import { SecurityService } from './security.service';
import { HttpClient } from '@angular/common/http';
import { api_path } from '../includes/api_path.js';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private http: HttpClient, private securityService: SecurityService) { }

  configUrl = api_path;

  addChat(data){
    let token = this.securityService.getToken();
    data = this.securityService.encode(JSON.stringify(data))
    return this.http.post(this.configUrl+"chat/add/",{token: token,data:data});
  }

  getChat(){
    let token = this.securityService.getToken();
    return this.http.post(this.configUrl+"chat/get/",{token: token});
  }

  getChatMessage(data){
    let token = this.securityService.getToken();
    let room = this.securityService.encode(data)
    return this.http.post(this.configUrl+"chat/get/message",{token: token, room: room});
  }
}
