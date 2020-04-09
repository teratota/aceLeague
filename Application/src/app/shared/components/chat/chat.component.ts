

/*import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
*/

import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChatService } from './../../service/chat.service';
import { Subscription } from 'rxjs';
import { Message, Jsonformat, chatMessage } from './../../models/chat';
import { startWith } from 'rxjs/operators';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as fs from 'fs';
import { ListChatMessageComponent } from '../list-chat-message/list-chat-message.component';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {
  message: Message;
  loadmessage: object;
  discussion: object;
  jsonformat : Jsonformat;
  private _messageSub: Subscription;
  constructor(private chatService: ChatService, private chatmessage: chatMessage, private chatlist: ListChatMessageComponent) {this.jsonformat = new Jsonformat();}

  messageForm = new FormGroup({
    message:new FormControl('',[
      Validators.required
    ])
  });

  ngOnInit() {
    this._messageSub = this.chatService.currentMessage.pipe(
      startWith({ id: '', token: '', message: '',})
    ).subscribe(message => this.message = message);
  }

  ngOnDestroy() {
    this._messageSub.unsubscribe();
  }

  loadDisc(){
    
  }

  editMessage() {
    this.jsonformat.username = 'toto'
    this.jsonformat.message = this.messageForm.value.message
    this.message.message = JSON.stringify(this.jsonformat)
    console.log(this.message)
    this.chatService.editMessages(this.message);
    var data = fs.readFileSync("./src/app/file/"+this.message.id+".json",'utf8')
      console.log(data);
      data = data.slice(0, -1);
      console.log(data);
      let virgule = '';
      if(data != '['){
        virgule = ',';
      }
      try {
        fs.writeFileSync("./src/app/file/"+this.message.id+".json", data+virgule+this.message.message+"]", {flag: "w+"});
      } catch(err) {
        // An error occurred
        console.error(err);
      }
    var contents = fs.readFileSync("./src/app/file/"+this.message.id+".json", 'utf8');
    console.log(contents);
    this.chatmessage = JSON.parse(contents);
    console.log(this.chatmessage);
    this.chatlist.loadMess(this.message.id);
    }
}