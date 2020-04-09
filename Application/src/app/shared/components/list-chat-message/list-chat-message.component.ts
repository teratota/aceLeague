

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


import { Component, OnInit, OnDestroy, Injectable } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ChatService } from './../../service/chat.service';
import * as fs from 'fs';
import { chatMessage } from '../../models/chat';

@Component({
  selector: 'app-chat-list',
  templateUrl: './list-chat-message.component.html',
  styleUrls: ['./list-chat-message.component.scss']
})
export class ListChatMessageComponent implements OnInit, OnDestroy {
  messages: Observable<string[]>;
  currentMess: string;
  discussion: object;
  tampon: object;
  private _messageSub: Subscription;

  constructor(private chatService: ChatService, private chatmessage: chatMessage) { }

  ngOnInit() {
    this.messages = this.chatService.messages;
    this._messageSub = this.chatService.currentMessage.subscribe(doc => this.currentMess = doc.id);
  }

  ngOnDestroy() {
    this._messageSub.unsubscribe();
  }
  
  loadMess(id: string) {
    this.chatService.getMessages(id);
    var contents = fs.readFileSync("./src/app/file/"+id+".json", 'utf8');
    console.log(contents);
    this.chatmessage = JSON.parse(contents);
  }

  newMess() {
    console.log("eeeeeee")
    this.chatService.newMessages();
  }

}