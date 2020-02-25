//import { UserService } from 'src/app/service/user.service';
import { Component, OnInit } from '@angular/core';
//import { ValidationService } from 'src/app/service/validation.service';
import { Validators, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  //constructor(private UserService: UserService, private ValidationService: ValidationService) { }

  MessageMail: boolean;
  MessagePass: boolean;

  registerForm = new FormGroup({
    mail:new FormControl('',[
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
    this.MessageMail = false;
    this.MessagePass = false;
  }

  connection() {
    // // let connectionResult = this.UserService.connection(this.registerForm.value.mail, this.registerForm.value.password);
    //   if (connectionResult !== false) {
    //     document.cookie = 'tokenValidation = ' + connectionResult + '; expires=Thu, 18 Dec 3000 12:00:00 UTC' ;
    //     window.location.href = '/';
    //   }
     }

}
