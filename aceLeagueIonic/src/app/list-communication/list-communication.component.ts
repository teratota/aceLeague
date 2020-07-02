import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ChatService } from '../service/chat.service';
import { Socket } from 'ngx-socket-io';
import { UserService } from '../service/user.service';
import { SecurityService } from '../service/security.service';


@Component({
  selector: 'app-list-communication',
  templateUrl: './list-communication.component.html',
  styleUrls: ['./list-communication.component.scss'],
})
export class ListCommunicationComponent implements OnInit {

  constructor(
    private router: Router,
    private chatService: ChatService,
    private activeRoute: ActivatedRoute,
    private socket: Socket,
    private UserService: UserService,
    private securityService: SecurityService) { }

  chat: object;
  userId: number = null;
  user = {
    username: null,
    bio: null
  };

  ngOnInit() {
    this.activeRoute.params.subscribe(routeParams => {
      this.getData();
    });
  }

  // Recuperation donnees liste chat
  getData() {
    this.chatService.getChat().subscribe(response => {
      this.chat = JSON.parse(this.securityService.decode(response))
      return this.chat;
    }, err => {
      if (err.error.error === 'wrong token') {
        this.securityService.presentToast();
      }
    });
    this.UserService.getInfosUser(this.userId).subscribe(response => {
      this.user = JSON.parse(this.securityService.decode(response))[0];
      return this.user;
    }, err => {
      if (err.error.error === 'wrong token') {
        this.securityService.presentToast();
      }
    });
  }

  // Creation salon chat
  addCom() {
    this.router.navigate(['editCommunication']);
  }

  // Rejoindre chat
  join(nom) {
     this.socket.connect();
     const token = this.securityService.getToken();
     this.socket.emit('join', {nom: nom, token: token});
     this.socket.emit('set-nickname', {nickname: this.user.username, room: nom, token: token});
     this.router.navigate(['chat'], {state: {data: this.user.username, room: nom}});
  }

}
