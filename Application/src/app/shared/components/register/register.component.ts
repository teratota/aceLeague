import { Component, OnInit } from '@angular/core';
import { Validators, FormControl, FormGroup } from '@angular/forms';
import { ValidationService } from '../../service/validation.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm = new FormGroup({
    pseudo:new FormControl('',[
      Validators.required,
      Validators.maxLength(50),
      Validators.minLength(1),
      Validators.pattern('^[a-zA-Z]+(([ -][a-zA-Z ])?[a-zA-Z]*)*$')
    ]),
    birthday:new FormControl('',[
      Validators.required
    ]),
    mail:new FormControl('',[
      Validators.required,
      Validators.email,
      Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
    ]),
    password1:new FormControl('',[
      Validators.required,
      Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')
    ]),
    password2:new FormControl('',[
      Validators.required,
      Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')
    ]),
                                                                                 
  });

  password:boolean;
  mail:boolean;
  confirmation: boolean;
  MsgConfirmation : boolean;

  constructor(private ValidationService: ValidationService, private UserService: UserService) {
    this.confirmation = true;
  }
  

  ngOnInit() { }

  checkData() {
    var mail = this.ValidationService.validationEmail(this.registerForm.value.mail)
    if(mail=false){
      this.mail = true;
    }else{
      this.mail = false;
      var result = this.ValidationService.validationIdentiquePassword(this.registerForm.value.password1,this.registerForm.value.password2);
    if(result == false){
      this.password=true;
    }else{
      this.password=false;
      var user = JSON.stringify(this.registerForm.value)
      var info = this.UserService.insertUser(user);
      if(info==true){
        this.confirmation = false;
        this.MsgConfirmation = true;
      }
    }
    }
  }

}
