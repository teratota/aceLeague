import { Component, OnInit, Input } from '@angular/core';
import { ValidationService } from 'src/app/service/validation.service';
import { UserService } from 'src/app/service/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PhotoService } from '../service/photo.service';
import { ActionSheetController, Platform, ModalController } from '@ionic/angular';
import * as _ from 'lodash';
import { ProService } from '../service/pro.service';
import { SecurityService } from '../service/security.service';
import { Location } from '@angular/common';
import { NgxImageCompressService } from 'ngx-image-compress';

@Component({
  selector: 'app-edit-pro',
  templateUrl: './edit-pro.component.html',
  styleUrls: ['./edit-pro.component.scss'],
})
export class EditProComponent implements OnInit {

  config: any;
  token: any;

  @Input() data: number;

  firstView: boolean = true;
  secondView: boolean = false;
  addView: boolean = true;
  editView: boolean = false;

  isPC: boolean = false
  isMobile: boolean = false
  isImagePc: boolean = false
  isImageMobile: boolean = false

  proForm = new FormGroup({
    nom: new FormControl('', [
      Validators.required,
      Validators.maxLength(255),
      Validators.minLength(1)
    ]),
    type: new FormControl('', [
      Validators.required,
      Validators.minLength(1)
    ]),
    description: new FormControl('', [
      Validators.required,
      Validators.minLength(1)
    ]),
    image: new FormControl('', []),
  });

  proFormEdit = new FormGroup({
    nom: new FormControl('', [
      Validators.required,
      Validators.maxLength(255),
      Validators.minLength(1)
    ]),
    type: new FormControl('', [
      Validators.required,
      Validators.minLength(1)
    ]),
    description: new FormControl('', [
      Validators.required,
      Validators.minLength(1)
    ]),
  });

  password: boolean;
  mail: boolean;
  confirmation: boolean;
  MsgConfirmation: boolean;

  imageError: string;
  isImageSaved: boolean;
  previewImagePath: any

  proEdit: any;

  publication: any;
  photo: any;
  position: any;


  imageUrl: string | ArrayBuffer =
    "https://bulma.io/images/placeholders/480x480.png";
  fileName: string = "No file selected";

  constructor(private ValidationService: ValidationService, private ProService: ProService, private router: Router, private photoService: PhotoService, public actionSheetController: ActionSheetController, public platform: Platform, private activeRoute: ActivatedRoute, private securityService: SecurityService, private modalCtrl: ModalController, private location: Location, private imageCompress: NgxImageCompressService) {
    this.confirmation = true;
  }


  ngOnInit() {
    this.activeRoute.params.subscribe(routeParams => {
      let platform = this.platform.platforms()
      this.photoService.base = null
      if (platform[0] == 'electron' || platform[0] == 'desktop') {
        this.isPC = true;
        this.isImagePc = false;
      } else {
        this.isMobile = true;
        this.isImageMobile = true;
      }
      if (this.data == null) {
        this.proForm.setValue({
          nom: '',
          type: '',
          description: '',
          image: '',
        })
      } else {
        this.editView = true;
        this.addView = false;
        this.getData();
      }
    });
  }

  checkData() {
    this.sendForElectron()
  }

  checkDataEdit() {
    this.ProService.updatePro(this.proFormEdit.value, this.data).subscribe(response => {
      this.firstView = true;
      this.secondView = false;
      this.addView = true;
      this.editView = false;
      let location = this.location.path()
      if (location == "/pro") {
        this.router.navigate(['/proReload'], {
          state: {
            data: this.data
          }
        });
      } else {
        this.router.navigate(['/pro'], {
          state: {
            data: this.data
          }
        });
      }

      this.modalCtrl.dismiss();
      return this.config;
    }, err => {
      if (err.error.error == "wrong token") {
        this.securityService.presentToast()
      }
    });
  }

  getData() {
    this.ProService.getInfoPro(this.data).subscribe(response => {
      this.proEdit = JSON.parse(this.securityService.decode(response))[0];
      this.proFormEdit.patchValue({
        nom: this.proEdit.nom,
        type: this.proEdit.type,
        description: this.proEdit.description,
      })
      return this.proEdit;
    }, err => {
      if (err.error.error == "wrong token") {
        this.securityService.presentToast()
      }
    });
  }

  next() {
    this.firstView = false;
    this.secondView = true;
  }

  last() {
    this.firstView = true;
    this.secondView = false;
  }

  onChange() {
    this.isImagePc = true
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
        this.previewImagePath = image
      }
    });
  }


  sendForElectron() {
    this.ProService.newPro(this.proForm.value, this.previewImagePath).subscribe(response => {
      this.firstView = true;
      this.secondView = false;
      let location = this.location.path()
      if (location == "/profile") {
        this.router.navigate(['profileReload']);
      } else {
        this.router.navigate(['profile']);
      }
      this.modalCtrl.dismiss();
      return this.config;
    });
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
          this.previewImagePath = "";
          this.proForm.patchValue({
            image: ''
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

  public async closeModal() {
    await this.modalCtrl.dismiss();
  }

}
