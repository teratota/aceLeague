

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
import { Message } from './../../models/chat';
import { startWith } from 'rxjs/operators';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {
  message: Message;
  private _messageSub: Subscription;
  constructor(private chatService: ChatService) { }

  ngOnInit() {
    this._messageSub = this.chatService.currentMessage.pipe(
      startWith({ id: '', token: '', username: '',doc: '',})
    ).subscribe(message => this.message = message);
  }

  ngOnDestroy() {
    this._messageSub.unsubscribe();
  }

  editMessage() {
    this.chatService.editMessages(this.message);
  }
}