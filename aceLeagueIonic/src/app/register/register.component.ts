import { Component, OnInit } from '@angular/core';
import { ValidationService } from 'src/app/service/validation.service';
import { UserService } from 'src/app/service/user.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {

  config: any;
  token: any;

  firstView : boolean = true ;
  secondView : boolean = false;
  thirdView : boolean = false;
  sportView : boolean = false;

  registerForm = new FormGroup({
    username:new FormControl('',[
      Validators.required,
      Validators.maxLength(50),
      Validators.minLength(1),
      Validators.pattern('^[a-zA-Z]+(([ -][a-zA-Z ])?[a-zA-Z]*)*$')
    ]),
    bio:new FormControl('',[
      Validators.required
    ]),
    email:new FormControl('',[
      Validators.required,
      Validators.email,
      Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
    ]),
    password:new FormControl('',[
      Validators.required,
      Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')
    ]),
    password2:new FormControl('',[
      Validators.required,
      Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')
    ]),
    question:new FormControl('',[
      Validators.required
    ]),
    sport:new FormControl('',[
    ]),
    level:new FormControl('',[
    ]),
    sportDescription:new FormControl('',[
      Validators.required
    ]),                                                                            
  });

  password:boolean;
  mail:boolean;
  confirmation: boolean;
  MsgConfirmation : boolean;

  constructor(private ValidationService: ValidationService, private UserService: UserService,private router : Router) {
    this.confirmation = true;
  }
  

  ngOnInit() { 
  }

  checkData() {
    var mail = this.ValidationService.validationEmail(this.registerForm.value.email)
    if(mail=false){
      this.mail = true;
    }else{
      this.mail = false;
      var result = this.ValidationService.validationIdentiquePassword(this.registerForm.value.password,this.registerForm.value.password2);
    if(result == false){
      this.password=true;
    }else{
      this.password=false;
      var user = JSON.stringify(this.registerForm.value)
      this.UserService.newUser(this.registerForm.value)
      .subscribe(response => {
        this.config = response;
        document.cookie = 'tokenValidation = ' + this.config + '; expires=Thu, 18 Dec 3000 12:00:00 UTC' ;
        this.router.navigate(['/profile']);
        return this.config;
      });
    }
    }
  }

  login(){
    this.router.navigate(['/']);
  }

  next()
  {
    this.firstView = false ;
    this.secondView = true;
    this.thirdView = false;
  }

  nextTwo()
  {
    this.firstView = false ;
    this.secondView = false;
    this.thirdView = true;
  }

  last()
  {
    this.firstView = true ;
    this.secondView = false;
    this.thirdView = false;
  }

  lastTwo()
  {
    this.firstView = false ;
    this.secondView = true;
    this.thirdView = false;
  }

  changeSport(data) 
  {
    if(data == "oui"){
      this.sportView  = true;
    }else if(data == "non"){
      this.sportView  = false;
    }
  }
}
