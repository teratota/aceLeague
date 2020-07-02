import { Component, OnInit, ViewChild, AfterViewChecked } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs/Observable';
import { ToastController, IonContent } from '@ionic/angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SecurityService } from '../service/security.service';
import { ChatService } from '../service/chat.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit, AfterViewChecked {

@ViewChild(IonContent, {read: IonContent, static: true}) content: IonContent;

  messages = [];
  nickname = '';
  message = '';

  chatForm = new FormGroup({
    message: new FormControl('', [
      Validators.required
    ])
  });
  chat: any;
  room: string;

  ngOnInit() {
    this.activeRoute.params.subscribe(routeParams => {
      this.messages = [];
      this.chatService.getChatMessage(this.room).subscribe(response => {
        this.chat = response;
        this.chat = JSON.parse(this.chat);
        if (this.chat !== []) {
          for (let index = 0; index < this.chat.length; index++) {
            this.chat[index].message = this.securityService.decode(this.chat[index].message);
          }
        }
        return this.chat;
      }, err => {
        if (err.error.error === 'wrong token') {
          this.securityService.presentToast();
        }
      });
    });
  }

  ngAfterViewChecked()	{
    this.ScrollToBottom();
  }


  constructor(
    private socket: Socket,
    private toastCtrl: ToastController,
    private securityService: SecurityService,
    private chatService: ChatService,
    private activeRoute: ActivatedRoute) {
  this.nickname = history.state.data;
  this.room = history.state.room;
  this.getMessages().subscribe(message => {
    this.messages.push(message);
  });

  this.getUsers().subscribe(data => {
    const user = data['user'];
    if (data['event'] === 'left') {
      this.showToast('User left: ' + user);
    } else {
      this.showToast('User joined: ' + user);
    }
  });
}

// Fonction d'envoi de message
sendMessage() {
  if (this.chatForm.value.message !== '') {
    this.socket.emit('add-message', { text: this.securityService.encode(this.chatForm.value.message) });
    this.message = '';
    this.chatForm.patchValue({
      message: ''
    });

    this.ScrollToBottom();
  }
}

// Aller en bas de page
ScrollToBottom() {
  this.content.scrollToBottom(0);
}

// Recuperation des messages
getMessages() {
  const observable = new Observable(observer => {
    this.socket.on('message', (data) => {
      const texte = this.securityService.decode(data.text);
      if (texte !== ''){
        data.text = texte;
      }
      observer.next(data);
      this.ScrollToBottom();
    });
  });
  return observable;
}

// Recuperation des utilisateurs
getUsers() {
  const observable = new Observable(observer => {
    this.socket.on('users-changed', (data) => {
      observer.next(data);
    });
  });
  return observable;
}

// Deconnexion utlisateur
ionViewWillLeave() {
  this.socket.disconnect();
}

// Affichage du popup a la connexion / deconnexion
async showToast(msg) {
  const toast = await this.toastCtrl.create({
    message: msg,
    duration: 2000
  });
  toast.present();
}

}
