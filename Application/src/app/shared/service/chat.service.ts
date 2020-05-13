/*import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor() { }
}
*/

import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Message } from '../models/chat';
import * as fs from 'fs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  currentMessage = this.socket.fromEvent<Message>('message');
  loadMessage =this.socket.fromEvent<object>('loadmessage');
  messages = this.socket.fromEvent<string[]>('messages');

  constructor(private socket: Socket) { }

  getMessages(id: string) {
    //fonction pour changer de room 
    console.log(id)
    this.socket.emit('getMess', id);
    
  }

  newMessages() {
    //fonction pour créer une nouvelle discussion
    var newroom = this.docId();
    this.socket.emit('addMess', { id: newroom, token: "",message: ""});
    /*fs.writeFile("./src/app/file/"+newroom+".json", "[]", {flag: "a+"}, function(err) {
      if(err) {
          return console.log(err);
      }
      console.log("The file was saved!");
  }); */
    fs.writeFileSync("./src/app/file/"+newroom+".json", "[]")
  }

  editMessages(message: Message) {
    //fonction pour envoyer le message
    this.socket.emit('editMess', message);
    console.log(this.currentMessage);
  }

  private docId() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < 5; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
  }
}
