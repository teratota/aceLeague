import { Component, OnInit } from '@angular/core';
//import { ValidationService } from 'src/app/service/validation.service';
import { Validators, FormControl, FormGroup } from '@angular/forms';
import { UserService } from '../../service/user.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  config: any;

  constructor(private UserService: UserService) { }

  messageMail: boolean;
  messagePass: boolean;

  registerForm = new FormGroup({
    email:new FormControl('',[
      Validators.required,
      Validators.email,
      Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
    ]),
    password:new FormControl('',[
      Validators.required,
      Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')
    ])
    
  });

  ngOnInit() {
    this.request();
    this.messageMail = false;
    this.messagePass = false;
  }

  connection() {
    console.log(this.registerForm.value);
    this.request();
    console.log(this.config);
   // let connectionResult = this.UserService.connection(this.registerForm.value);
    // // let connectionResult = this.UserService.connection(this.registerForm.value.mail, this.registerForm.value.password);
    //   if (connectionResult !== false) {
    //     document.cookie = 'tokenValidation = ' + connectionResult + '; expires=Thu, 18 Dec 3000 12:00:00 UTC' ;
    //     window.location.href = '/';
    //   }
     }

  request(){
    this.UserService.connection(this.registerForm.value)
    .subscribe((data: any) => this.config = data);
  }

}
