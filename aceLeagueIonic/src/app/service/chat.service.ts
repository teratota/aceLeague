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

  addChat(data) {
    const token = this.securityService.getToken();
    data = this.securityService.encode(JSON.stringify(data));
    return this.http.post(this.configUrl + 'chat/add/', {token, data});
  }

  getChat() {
    const token = this.securityService.getToken();
    return this.http.post(this.configUrl + 'chat/get/', {token});
  }

  getChatMessage(data) {
    const token = this.securityService.getToken();
    const room = this.securityService.encode(data);
    return this.http.post(this.configUrl + 'chat/get/message', {token, room});
  }
}
