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

  constructor(private router : Router,  private chatService: ChatService, private activeRoute: ActivatedRoute, private socket: Socket, private UserService: UserService, private securityService: SecurityService) { }
  chat: object;
  user = {
    username: null,
    bio: null
  };
  userId: number = null;
  ngOnInit() {
    this.activeRoute.params.subscribe(routeParams => {
      this.getData();
    });
  }

  getData(){
    this.chatService.getChat().subscribe(response => {
      this.chat=response
      console.log(response);
      return this.chat;
    });
    this.UserService.getInfosUser(this.userId).subscribe(response => {
      this.user = response[0];
      console.log(this.user);
      return this.user;
    });
  }

  addCom(){
    this.router.navigate(['editCommunication']);
  }

  join(nom) {
     this.socket.connect();
     let token = this.securityService.getToken();
     this.socket.emit('join', {nom:nom,token:token});
     this.socket.emit('set-nickname', {nickname:this.user.username,room:nom,token:token});
     this.router.navigate(['chat'], {state: {data:this.user.username}});
  }

}
