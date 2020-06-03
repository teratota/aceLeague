import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UserService } from 'src/app/service/user.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { SecurityService } from '../service/security.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  config: any;

  constructor(private UserService: UserService, private router : Router, private socket: Socket, private securityService: SecurityService, private navBarComponent: NavbarComponent, private activeRoute: ActivatedRoute) { }

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
    this.activeRoute.params.subscribe(routeParams => {
      this.UserService.testConnection().subscribe(response => {
        if(response == true){
          this.router.navigate(['/profile']);
        }
      },err => {
      });
      console.log('login')
      this.navBarComponent.refreshNavbar()
     // this.headerComponent.refreshHeader()
      this.messageMail = false;
      this.messagePass = false
    });
  }

  connection() {
    this.UserService.connection(this.loginForm.value)
    .subscribe(response => {
      this.config = response;
      this.config.token = this.securityService.encode(this.config.token);
      localStorage.setItem('token',this.config.token);
      this.navBarComponent.refreshNavbar()
    //  this.headerComponent.refreshHeader()
      this.router.navigate(['/profile']);
      return this.config;
    },err => {
      console.log(err.error)
    });
  }

  register(){
    this.router.navigate(['/register']);
  }
  
}
