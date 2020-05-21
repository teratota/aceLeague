import { Component, OnInit } from '@angular/core';
import { ValidationService } from 'src/app/service/validation.service';
import { UserService } from 'src/app/service/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PhotoService } from '../service/photo.service';
import { ActionSheetController, Platform } from '@ionic/angular';
import * as _ from 'lodash';

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
  foorView : boolean = false;
  fiveView : boolean = false;
  sportView : boolean = false;

  isPC : boolean = false
  isMobile : boolean = false
  isImagePc :boolean = false
  isImageMobile :boolean = false

  registerForm = new FormGroup({
    username:new FormControl('',[
      Validators.required,
      Validators.maxLength(50),
      Validators.minLength(1)
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
    image:new FormControl('',[
    ]),
    sportDescription:new FormControl('',[
      Validators.required
    ]),                                                                            
  });

  password:boolean;
  mail:boolean;
  confirmation: boolean;
  MsgConfirmation : boolean;

  imageError: string;
  isImageSaved: boolean;
  cardImageBase64: string;
  previewImagePath: any

  publication : any;

  file: File;

  imageUrl: string | ArrayBuffer =
    "https://bulma.io/images/placeholders/480x480.png";
  fileName: string = "No file selected";

  constructor(private ValidationService: ValidationService, private UserService: UserService,private router : Router, private photoService: PhotoService,  public actionSheetController: ActionSheetController, public platform: Platform, private activeRoute: ActivatedRoute) {
    this.confirmation = true;
  }
  

  ngOnInit() { 
    this.activeRoute.params.subscribe(routeParams => {
      let platform = this.platform.platforms()
      this.file = null;
      this.photoService.base = null
      if(platform[0] == 'electron' || platform[0] == 'desktop' ){
        this.isPC = true;
        this.isImagePc = false;
      }else{
        this.isMobile  = true;
        this.isImageMobile = true;
      }
      this.registerForm.setValue({
        username: '',
        bio:'',
        email:'',
        password:'',
        password2:'',
        question:'',
        sport:'',
        level:'',
        image:'',
        sportDescription:''
      })
    });
  }

  checkData() {
    console.log(this.platform.platforms())
    let platform = this.platform.platforms()
    if(platform[0] == 'electron' || platform[0] == 'desktop' ){
      this.sendForElectron() 
    }else{
      console.log('tgdsshbjhb')
    console.log(this.photoService.blob)
    console.log(this.photoService.base)
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
      this.UserService.newUser(this.registerForm.value,this.photoService.base).subscribe(response => {
        this.config = response;
        localStorage.setItem('token',this.config.token);
        this.firstView = true ;
        this.secondView = false;
        this.thirdView = false;
        this.foorView = false;
        this.fiveView = false;
        this.router.navigate(['/profile']);
        return this.config;
      });
    }
    }
    }
  }

  login(){
    this.firstView = true ;
    this.secondView = false;
    this.thirdView = false;
    this.foorView = false;
    this.fiveView = false;
    this.router.navigate(['/']);
  }

  next()
  {
    this.firstView = false ;
    this.secondView = true;
    this.thirdView = false;
    this.foorView = false;
    this.fiveView = false;
  }

  nextTwo()
  {
    this.firstView = false ;
    this.secondView = false;
    this.thirdView = true;
    this.foorView = false;
    this.fiveView = false;
  }
  nextThree()
  {
    if(this.sportView == true){
      this.firstView = false ;
      this.secondView = false;
      this.thirdView = false;
      this.foorView = true;
      this.fiveView = false;
    }else{
      this.firstView = false ;
      this.secondView = false;
      this.thirdView = false;
      this.foorView = false;
      this.fiveView = true;
    }
  }
  nextFour()
  {
    this.firstView = false ;
    this.secondView = false;
    this.thirdView = false;
    this.foorView = false;
    this.fiveView = true;
  }

  last()
  {
    this.firstView = true ;
    this.secondView = false;
    this.thirdView = false;
    this.foorView = false;
    this.fiveView = false;
  }

  lastTwo()
  {
    this.firstView = false ;
    this.secondView = true;
    this.thirdView = false;
    this.foorView = false;
    this.fiveView = false;
  }
  lastThree()
  {
    this.firstView = false ;
    this.secondView = false;
    this.thirdView = true;
    this.foorView = false;
    this.fiveView = false;
  }
  lastFour(){
    if(this.sportView == true){
      this.firstView = false ;
      this.secondView = false;
      this.thirdView = false;
      this.foorView = true;
      this.fiveView = false;
    }else{
      this.firstView = false ;
      this.secondView = false;
      this.thirdView = true;
      this.foorView = false;
      this.fiveView = false;
    }
  }

  changeSport(data) 
  {
    if(data == "oui"){
      this.sportView  = true;
    }else if(data == "non"){
      this.sportView  = false;
    }
  }

  onChange(file: File) {
    if (file) {
      this.fileName = file.name;
      this.file = file;
      this.isImagePc = true
      var reader = new FileReader();
      reader.onload = (e: any) => {
        const image = new Image();
              image.src = e.target.result;
              image.onload = rs => {
                const imgBase64Path = e.target.result;
                this.previewImagePath = imgBase64Path;
              };
      }
      console.log(this.file);
      reader.readAsDataURL(this.file);
     }
  }

  photo(){
    this.photoService.addNewToGallery()
  }

  sendForElectron(){
    console.log(this.registerForm.value);
      this.imageError = null;
      if (this.file) {
          // Size Filter Bytes
          const max_size = 2097152000000;
          const allowed_types = ['image/png', 'image/jpeg'];
          const max_height = 15200;
          const max_width = 25600;

         if (this.file.size > max_size) {
              this.imageError =
                  'Maximum size allowed is ' + max_size / 1000 + 'Mb';

              return false;
          }

          if (!_.includes(allowed_types, this.file.type)) {
              this.imageError = 'Only Images are allowed ( JPG | PNG )';
              return false;
          }
          const reader = new FileReader();
          reader.onload = (e: any) => {
              const image = new Image();
              image.src = e.target.result;
              image.onload = rs => {
                  const img_height = rs.currentTarget['height'];
                  const img_width = rs.currentTarget['width'];

                  console.log(img_height, img_width);


                  if (img_height > max_height && img_width > max_width) {
                      this.imageError =
                          'Maximum dimentions allowed ' +
                          max_height +
                          '*' +
                          max_width +
                          'px';
                      return false;
                  } else {
                      const imgBase64Path = e.target.result;
                      this.cardImageBase64 = imgBase64Path;
                      this.isImageSaved = true;
                    ///////////////////////////////////////////
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
                        this.UserService.newUser(this.registerForm.value,this.cardImageBase64).subscribe(response => {
                          this.config = response;
                          localStorage.setItem('token',this.config.token);
                          this.firstView = true ;
                          this.secondView = false;
                          this.thirdView = false;
                          this.foorView = false;
                          this.fiveView = false;
                          this.router.navigate(['/profile']);
                          return this.config;
                        });
                      }
                      }
                  }
              };
          };

          reader.readAsDataURL(this.file);
      }else{
        //////////////////////////////////////////////////////
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
          this.UserService.newUser(this.registerForm.value,this.cardImageBase64).subscribe(response => {
            this.config = response;
            localStorage.setItem('token',this.config.token);
            this.firstView = true ;
            this.secondView = false;
            this.thirdView = false;
            this.foorView = false;
            this.fiveView = false;
            this.router.navigate(['/profile']);
            return this.config;
          });
        }
        }
      }
  }

  public async showActionSheetElectron(photo, position) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Photos',
      buttons: [{
        text: 'Delete',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          this.isImagePc = false;
          this.file = null;
          this.registerForm.patchValue({
            image:''
          })
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {}
      }]
    });
    await actionSheet.present();
  }

  public async showActionSheet(photo, position) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Photos',
      buttons: [{
        text: 'Delete',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          this.photoService.deletePicture(photo, position);
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {}
      }]
    });
    await actionSheet.present();
  }

}
