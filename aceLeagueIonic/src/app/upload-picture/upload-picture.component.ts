import { Component, OnInit, Input } from '@angular/core';
import { ProService } from '../service/pro.service';
import { Router, ActivatedRoute } from '@angular/router';
import { PhotoService } from '../service/photo.service';
import { ActionSheetController, Platform, ModalController } from '@ionic/angular';
import { UserService } from '../service/user.service';
import { GroupeService } from '../service/groupe.service';
import * as _ from 'lodash';
import { SecurityService } from '../service/security.service';
import { Location } from '@angular/common';
import {NgxImageCompressService} from 'ngx-image-compress';

@Component({
  selector: 'app-upload-picture',
  templateUrl: './upload-picture.component.html',
  styleUrls: ['./upload-picture.component.scss'],
})
export class UploadPictureComponent implements OnInit {

  @Input() param: string;
  @Input() data: number;

  config: any;
  token: any;

  isPC: boolean = false;
  isMobile: boolean = false;
  isImagePc: boolean = false;
  isImageMobile: boolean = false;

  confirmation: boolean;
  MsgConfirmation: boolean;

  imageError: string;
  isImageSaved: boolean;
  cardImageBase64: string;
  previewImagePath: any;

  publication: any;

  file: File;

  position: any;

  imageUrl: string | ArrayBuffer =
    'https://bulma.io/images/placeholders/480x480.png';
  fileName: string = 'No file selected';

  constructor(
    private proService: ProService,
    private router: Router,
    private photoService: PhotoService,
    public actionSheetController: ActionSheetController,
    public platform: Platform,
    private activeRoute: ActivatedRoute,
    private userService: UserService,
    private groupeService: GroupeService,
    private securityService: SecurityService,
    private location: Location,
    private modalCtrl: ModalController,
    private imageCompress: NgxImageCompressService
  ) {
    this.confirmation = true;
  }


  ngOnInit() {
    this.activeRoute.params.subscribe(routeParams => {
      const platform = this.platform.platforms();
      this.file = null;
      this.photoService.base = null;
      if (platform[0] === 'electron' || platform[0] === 'desktop' ) {
        this.isPC = true;
        this.isImagePc = false;
      } else {
        this.isMobile  = true;
        this.isImageMobile = true;
      }
    });
  }

  // Envoi de la photo
  checkData() {
    this.sendForElectron();
  }

  // Affichage de la photo
  onChange() {
    this.isImagePc = true;
    this.imageCompress.uploadFile().then(({image, orientation}) => {
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

  // Envoi de la photo
  sendForElectron() {
  if (this.param === 'pro') {
    this.proService.updateProImage(this.data, this.previewImagePath).subscribe(response => {
      const location = this.location.path();
      if (location === '/pro') {
        this.router.navigate(['proReload'], {state: {data: this.data}});
      } else if (location === '/proReload') {
        this.router.navigate(['pro'], {state: {data: this.data}});
      }
      this.modalCtrl.dismiss();
    }, err => {
      if (err.error.error === 'wrong token') {
        this.securityService.presentToast();
      }
    });
  } else if (this.param === 'groupe') {
    this.groupeService.updateGroupeImage(this.data, this.previewImagePath).subscribe(response => {
      const location = this.location.path();
      if (location === '/groupe') {
        this.router.navigate(['groupeReload'], {state: {data: this.data}});
      } else if (location === '/groupe') {
        this.router.navigate(['groupe'], {state: {data: this.data}});
      }
      this.modalCtrl.dismiss();
    }, err => {
      if (err.error.error === 'wrong token') {
        this.securityService.presentToast();
      }
    });
  } else if (this.param === 'user') {
    this.userService.updateUserImage(this.previewImagePath).subscribe(response => {
      const location = this.location.path();
      if (location === '/profile') {
        this.router.navigate(['profileReload']);
      } else if (location === '/profileReload') {
        this.router.navigate(['profile']);
      }
      this.modalCtrl.dismiss();
      return this.config;
    }, err => {
      if (err.error.error === 'wrong token') {
        this.securityService.presentToast();
      }
    });
   }
  }

  // Affichage popup action pour la photo
  public async showActionSheetElectron(photo, position) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Photos',
      buttons: [{
        text: 'Delete',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          this.isImagePc = false;
          this.previewImagePath = null;
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

  public async closeModal() {
    await this.modalCtrl.dismiss();
  }
}
