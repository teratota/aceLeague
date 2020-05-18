import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UserService } from 'src/app/service/user.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  config: any;

  constructor(private UserService: UserService, private router : Router, private socket: Socket) { }

  messageMail: boolean;
  messagePass: boolean;
  nickname = '';

  loginForm = new FormGroup({
    email:new FormControl('',[
      Validators.required,
      Validators.email,
      Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
    ]),
    password:new FormControl('',[
      Validators.required
     /// Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')
    ])
    
  });

  chatForm = new FormGroup({
    name:new FormControl('',[
      Validators.required
    ]),
    room:new FormControl('',[
      Validators.required
    ])
  });

  ngOnInit() {
    this.messageMail = false;
    this.messagePass = false;
  }

  connection() {
    console.log(this.loginForm.value);
    this.UserService.connection(this.loginForm.value)
    .subscribe(response => {
      this.config = response;
      localStorage.setItem('token',this.config.token);
      this.router.navigate(['/profile']);
      return this.config;
    });
  }

  register(){
    this.router.navigate(['/register']);
  }

  joinChat() {
    this.socket.connect();
    //this.socket.emit('join', this.chatForm.value.room);
    this.socket.emit('set-nickname', {nickname:this.chatForm.value.name,room:this.chatForm.value.room});
    this.router.navigate(['chat'], {state: {data: this.chatForm.value.name}});
  }
  
}
