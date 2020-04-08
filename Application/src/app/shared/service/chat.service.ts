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

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  currentMessage = this.socket.fromEvent<Message>('message');
  messages = this.socket.fromEvent<string[]>('messages');

  constructor(private socket: Socket) { }

  getMessages(id: string) {
    //fonction pour changer de room 
    console.log(id)
    this.socket.emit('getMess', id);
  }

  newMessages() {
    //fonction pour créer une nouvelle discussion
    this.socket.emit('addMess', { id: this.docId(), doc: '' });
  }

  editMessages(message: Message) {
    //fonction pour envoyer de mesage
    this.socket.emit('editMess', message);
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
