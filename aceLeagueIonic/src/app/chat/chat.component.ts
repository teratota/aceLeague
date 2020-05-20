import { Component, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs/Observable';
import { ToastController } from '@ionic/angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent {

  messages = [];
  nickname = '';
  message = '';

  chatForm = new FormGroup({
    message:new FormControl('',[
      Validators.required
    ])
  });

  constructor(private socket: Socket,  private toastCtrl: ToastController) { 
  this.nickname = history.state.data;

  this.getMessages().subscribe(message => {
    this.messages.push(message);
  });

  this.getUsers().subscribe(data => {
    let user = data['user'];
    if (data['event'] === 'left') {
      this.showToast('User left: ' + user);
    } else {
      this.showToast('User joined: ' + user);
    }
  });
}

sendMessage() {
  this.socket.emit('add-message', { text: this.chatForm.value.message });
  this.message = '';
}

getMessages() {
  let observable = new Observable(observer => {
    this.socket.on('message', (data) => {
      observer.next(data);
    });
  })
  return observable;
}

getUsers() {
  let observable = new Observable(observer => {
    this.socket.on('users-changed', (data) => {
      observer.next(data);
    });
  });
  return observable;
}

ionViewWillLeave() {
  this.socket.disconnect();
}

  async showToast(msg) {
  let toast = await this.toastCtrl.create({
    message: msg,
    duration: 2000
  });
  toast.present();
}

}
