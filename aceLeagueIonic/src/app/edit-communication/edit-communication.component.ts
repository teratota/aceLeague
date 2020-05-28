import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Socket } from 'ngx-socket-io';
import { Router } from '@angular/router';
import { FriendService } from '../service/friend.service';
import { ChatService } from '../service/chat.service';
import { SecurityService } from '../service/security.service';

@Component({
  selector: 'app-edit-communication',
  templateUrl: './edit-communication.component.html',
  styleUrls: ['./edit-communication.component.scss'],
})
export class EditCommunicationComponent implements OnInit {

  chatForm = new FormGroup({
    friend:new FormControl('',[
      Validators.required
    ])
  });
  user:number = null;
  friends : object;

  constructor( private router : Router, private socket: Socket,  private FriendService: FriendService, private chatService: ChatService,private securityService: SecurityService) { }

  ngOnInit() {
    this.FriendService.getFriendList(this.user).subscribe(response => {
      this.friends = JSON.parse(this.securityService.decode(response));
      return this.friends;
    },err => {
      if(err.error.error == "wrong token"){
        this.securityService.presentToast()
      }
    });
  }

  joinChat() {
    this.chatService.addChat(this.chatForm.value).subscribe(response => {
      this.router.navigate(['listCommunication']);
    },err => {
      if(err.error.error == "wrong token"){
        this.securityService.presentToast()
      }
    });
  }

}
