

/*import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-list-chat-message',
  templateUrl: './list-chat-message.component.html',
  styleUrls: ['./list-chat-message.component.scss']
})
export class ListChatMessageComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}*/


import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ChatService } from './../../service/chat.service';

@Component({
  selector: 'app-chat-list',
  templateUrl: './list-chat-message.component.html',
  styleUrls: ['./list-chat-message.component.scss']
})
export class ListChatMessageComponent implements OnInit, OnDestroy {
  messages: Observable<string[]>;
  currentMess: string;
  private _messageSub: Subscription;

  constructor(private chatService: ChatService) { }

  ngOnInit() {
    this.messages = this.chatService.messages;
    this._messageSub = this.chatService.currentMessage.subscribe(doc => this.currentMess = doc.id);
  }

  ngOnDestroy() {
    this._messageSub.unsubscribe();
  }

  loadMess(id: string) {
    this.chatService.getMessages(id);
  }

  newMess() {
    console.log("eeeeeee")
    this.chatService.newMessages();
    console.log(this.messages)
  }

}