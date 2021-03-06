import { Component, OnInit } from '@angular/core';
import { ValidationService } from 'src/app/service/validation.service';
import { UserService } from 'src/app/service/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PhotoService } from '../service/photo.service';
import { ActionSheetController, Platform } from '@ionic/angular';
import * as _ from 'lodash';
import { SecurityService } from '../service/security.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { NgxImageCompressService } from 'ngx-image-compress';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {

  config: any;
  token: any;

  firstView: boolean = true;
  secondView: boolean = false;
  thirdView: boolean = false;
  foorView: boolean = false;
  fiveView: boolean = false;
  sportView: boolean = false;

  isPC: boolean = false
  isMobile: boolean = false
  isImagePc: boolean = false
  isImageMobile: boolean = false

  position: object;

  registerForm = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.maxLength(50),
      Validators.minLength(1)
    ]),
    bio: new FormControl('', [
      Validators.required
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.email,
      Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')
    ]),
    password2: new FormControl('', [
      Validators.required,
      Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')
    ]),
    question: new FormControl('', [
      Validators.required
    ]),
    ville: new FormControl('', [
      Validators.required
    ]),
    sport: new FormControl('', []),
    level: new FormControl('', []),
    image: new FormControl('', []),
    sportDescription: new FormControl('', []),
  });

  password: boolean;
  mail: boolean;
  confirmation: boolean;
  MsgConfirmation: boolean;

  imageError: string;
  isImageSaved: boolean;
  previewImagePath: any

  publication: any;
  photo: any;

  imageUrl: string | ArrayBuffer =
    'https://bulma.io/images/placeholders/480x480.png';
  fileName: string = 'No file selected';

  constructor(
    private validationService: ValidationService,
    private userService: UserService,
    private router: Router,
    private photoService: PhotoService,
    public actionSheetController: ActionSheetController,
    public platform: Platform,
    private activeRoute: ActivatedRoute,
    private securityService: SecurityService,
    private navBarComponent: NavbarComponent,
    private imageCompress: NgxImageCompressService) {
    this.confirmation = true;
  }


  ngOnInit() {
    this.activeRoute.params.subscribe(routeParams => {
      this.navBarComponent.refreshNavbar();
      const platform = this.platform.platforms();
      this.photoService.base = null;
      if (platform[0] === 'electron' || platform[0] === 'desktop') {
        this.isPC = true;
        this.isImagePc = false;
      } else {
        this.isMobile = true;
        this.isImageMobile = true;
      }
      this.registerForm.setValue({
        username: '',
        bio: '',
        email: '',
        password: '',
        password2: '',
        question: '',
        sport: '',
        level: '',
        image: '',
        sportDescription: '',
        ville: ''
      });
    });
  }

  // Envoi de l'utilisateur
  checkData() {
    this.sendForElectron();
  }

  // Initialisation section 1
  login() {
    this.firstView = true;
    this.secondView = false;
    this.thirdView = false;
    this.foorView = false;
    this.fiveView = false;
    this.router.navigate(['/']);
  }

  // Passage a la section 2
  next() {
    this.firstView = false;
    this.secondView = true;
    this.thirdView = false;
    this.foorView = false;
    this.fiveView = false;
  }

  // Passage a la section 3
  nextTwo() {
    this.firstView = false;
    this.secondView = false;
    this.thirdView = true;
    this.foorView = false;
    this.fiveView = false;
  }

  // Passage a la section 4
  nextThree() {
    if (this.sportView === true) {
      this.firstView = false;
      this.secondView = false;
      this.thirdView = false;
      this.foorView = true;
      this.fiveView = false;
    } else {
      this.firstView = false;
      this.secondView = false;
      this.thirdView = false;
      this.foorView = false;
      this.fiveView = true;
    }
  }

  // Passage a la section 5
  nextFour() {
    this.firstView = false;
    this.secondView = false;
    this.thirdView = false;
    this.foorView = false;
    this.fiveView = true;
  }

  // Retour a la section 1
  last() {
    this.firstView = true;
    this.secondView = false;
    this.thirdView = false;
    this.foorView = false;
    this.fiveView = false;
  }

  // Retour a la section 2
  lastTwo() {
    this.firstView = false;
    this.secondView = true;
    this.thirdView = false;
    this.foorView = false;
    this.fiveView = false;
  }

  // Retour a la section 3
  lastThree() {
    this.firstView = false;
    this.secondView = false;
    this.thirdView = true;
    this.foorView = false;
    this.fiveView = false;
  }

  // Retour a la section 4
  lastFour() {
    if (this.sportView === true) {
      this.firstView = false;
      this.secondView = false;
      this.thirdView = false;
      this.foorView = true;
      this.fiveView = false;
    } else {
      this.firstView = false;
      this.secondView = false;
      this.thirdView = true;
      this.foorView = false;
      this.fiveView = false;
    }
  }

  // Affichage de la page sport suivant le choix
  changeSport(data) {
    if (data === 'oui') {
      this.sportView = true;
    } else if (data === 'non') {
      this.sportView = false;
    }
  }

  // Apercu de l'image
  onChange() {
    this.isImagePc = true;
    this.imageCompress.uploadFile().then(({
      image,
      orientation
    }) => {
      console.warn('Size before:', this.imageCompress.byteCount(image));
      if (this.imageCompress.byteCount(image) > 1000000) {
        this.imageCompress.compressFile(image, orientation, 50, 50).then(
          result => this.previewImagePath = result
        );
      } else {
        this.previewImagePath = image;
      }
    });
  }

  // Envoi de l'utilisateur
  sendForElectron() {
    const mail = this.validationService.validationEmail(this.registerForm.value.email);
    if (mail === false) {
      this.mail = true;
    } else {
      this.mail = false;
      const result = this.validationService.validationIdentiquePassword(this.registerForm.value.password, this.registerForm.value.password2);
      if (result === false) {
        this.password = true;
      } else {
        this.password = false;
        this.userService.newUser(this.registerForm.value, this.previewImagePath).subscribe(response => {
          this.config = response;
          this.config.token = this.securityService.encode(this.config.token);
          localStorage.setItem('token', this.config.token);
          this.firstView = true;
          this.secondView = false;
          this.thirdView = false;
          this.foorView = false;
          this.fiveView = false;
          this.navBarComponent.refreshNavbar();
          this.router.navigate(['/profile']);
          return this.config;
        });
      }
    }
  }

  // Affichage popup photo
  public async showActionSheetElectron(photo, position) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Photos',
      buttons: [{
        text: 'Delete',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          this.isImagePc = false;
          this.previewImagePath = '';
          this.registerForm.patchValue({
            image: ''
          });
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
