import { Component, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs/Observable';
import { ToastController } from '@ionic/angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SecurityService } from '../service/security.service';
import { ChatService } from '../service/chat.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {

  messages = [];
  nickname = '';
  message = '';

  chatForm = new FormGroup({
    message:new FormControl('',[
      Validators.required
    ])
  });
  chat : any;
  room : string;

  ngOnInit() { 
    this.activeRoute.params.subscribe(routeParams => {
      this.messages =[];
      this.ChatService.getChatMessage(this.room).subscribe(response => {
        this.chat =response;
        this.chat=JSON.parse(this.chat)
        if(this.chat != []){
          for (let index = 0; index < this.chat.length; index++) {
            this.chat[index].message = this.securityService.decode(this.chat[index].message)
          }
        }
        console.log(this.chat)
        return this.chat;
      },err => {
        if(err.error.error == "wrong token"){
          this.securityService.presentToast()
        }
      });
    });
  }

  constructor(private socket: Socket,  private toastCtrl: ToastController, private securityService: SecurityService, private ChatService: ChatService, private activeRoute: ActivatedRoute) { 
  this.nickname = history.state.data;
  this.room = history.state.room;

  

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
  this.socket.emit('add-message', { text: this.securityService.encode(this.chatForm.value.message) });
  this.message = '';
}

getMessages() {
  let observable = new Observable(observer => {
    this.socket.on('message', (data) => {
      let texte = this.securityService.decode(data.text)
      if(texte != ''){
        data.text = texte
      }
      observer.next(data);
    });
  })
  console.log(observable)
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
