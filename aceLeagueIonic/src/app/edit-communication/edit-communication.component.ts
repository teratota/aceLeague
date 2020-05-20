import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Socket } from 'ngx-socket-io';
import { Router } from '@angular/router';
import { FriendService } from '../service/friend.service';
import { ChatService } from '../service/chat.service';

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

  friends : object;

  constructor( private router : Router, private socket: Socket,  private FriendService: FriendService, private chatService: ChatService) { }

  ngOnInit() {
    this.FriendService.getFriendList().subscribe(response => {
      this.friends = response;
      console.log(this.friends);
      return this.friends;
    });
  }

  joinChat() {
    console.log(this.chatForm.value)
    this.chatService.addChat(this.chatForm.value).subscribe(response => {
      console.log(response);
      this.router.navigate(['listCommunication']);
    });
  }

}
