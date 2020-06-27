import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PublicationService } from 'src/app/service/publication.service';
import { PhotoService } from 'src/app/service/photo.service';
import { ActionSheetController, Platform, ModalController } from '@ionic/angular';
import { ProService } from '../service/pro.service';
import { GroupeService } from '../service/groupe.service';
import { Router, ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import { SecurityService } from '../service/security.service';
import { Location } from '@angular/common';
import { NgxImageCompressService } from 'ngx-image-compress';

@Component({
  selector: 'app-publication',
  templateUrl: './publication.component.html',
  styleUrls: ['./publication.component.scss']
})
export class PublicationComponent implements OnInit {

  slideOpts = {
    initialSlide: 1,
    speed: 400
  };
  isPC: boolean = false
  isMobile: boolean = false
  isImagePc: boolean = false
  isImageMobile: boolean = false
  publicationForm = new FormGroup({
    description: new FormControl('', [
      Validators.required
    ]),
    pro: new FormControl('', []),
    groupe: new FormControl('', []),
    param: new FormControl('Moi', []),
    image: new FormControl('', []),
  });

  pro: object = {
    id: null,
    nom: null
  }
  proActivated: boolean = false;
  groupe: object = {
    id: null,
    nom: null
  }
  groupeActivated: boolean = false;

  imageError: string;
  isImageSaved: boolean;
  previewImagePath: any

  publication: any;

  imageUrl: string | ArrayBuffer =
    "https://bulma.io/images/placeholders/480x480.png";
  fileName: string = "No file selected";

  constructor(private router: Router, private PublicationService: PublicationService, private photoService: PhotoService, public actionSheetController: ActionSheetController, private ProService: ProService, private GroupeService: GroupeService, public platform: Platform, private activeRoute: ActivatedRoute, private securityService: SecurityService, private modalCtrl: ModalController, private location: Location, private imageCompress: NgxImageCompressService) {}

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
      this.publicationForm.setValue({
        description: '',
        pro: '',
        groupe: '',
        param: 'Moi',
        image: ''
      })
    });
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

  photo() {
    this.photoService.addNewToGallery()
  }

  send() {
    this.sendForElectron()
  }

  sendForElectron() {
    if (this.publicationForm.value.param == "Moi") {
      this.PublicationService.uploadPublication(this.previewImagePath, this.publicationForm.value).subscribe(response => {
        this.publication = response;
        let location = this.location.path()
        if (location == "/profile") {
          this.router.navigate(['profileReload']);
        } else {
          this.router.navigate(['profile']);
        }
        this.modalCtrl.dismiss();
      }, err => {
        if (err.error.error == "wrong token") {
          this.securityService.presentToast()
        }
      });
    } else if (this.publicationForm.value.param == "Pro") {
      this.PublicationService.uploadPublicationPro(this.previewImagePath, this.publicationForm.value).subscribe(response => {
        this.publication = response;
        let location = this.location.path()
        if (location == "/pro") {
          this.router.navigate(['proReload'], {
            state: {
              data: this.publicationForm.value.pro
            }
          });
        } else {
          this.router.navigate(['pro'], {
            state: {
              data: this.publicationForm.value.pro
            }
          });
        }
        this.modalCtrl.dismiss();
      }, err => {
        if (err.error.error == "wrong token") {
          this.securityService.presentToast()
        }
      });
    } else if (this.publicationForm.value.param == "Groupe") {
      this.PublicationService.uploadPlublicationGroupe(this.previewImagePath, this.publicationForm.value).subscribe(response => {
        this.publication = response;
        let location = this.location.path()
        if (location == "/groupe") {
          this.router.navigate(['groupeReload'], {
            state: {
              data: this.publicationForm.value.groupe
            }
          });
        } else {
          this.router.navigate(['groupe'], {
            state: {
              data: this.publicationForm.value.groupe
            }
          });
        }
        this.modalCtrl.dismiss();
      }, err => {
        if (err.error.error == "wrong token") {
          this.securityService.presentToast()
        }
      });
    }
  }

  getList(value) {
    if (value == 'Groupe') {
      this.GroupeService.groupe2UserGetList().subscribe(response => {
        this.groupe = JSON.parse(this.securityService.decode(response));
        this.groupeActivated = true;
        this.proActivated = false;
        return this.groupe;
      }, err => {
        if (err.error.error == "wrong token") {
          this.securityService.presentToast()
        }
      });
    } else if (value == 'Pro') {
      this.ProService.getListMe().subscribe(response => {
        this.pro = JSON.parse(this.securityService.decode(response));
        this.proActivated = true;
        this.groupeActivated = false;
        return this.pro;
      }, err => {
        if (err.error.error == "wrong token") {
          this.securityService.presentToast()
        }
      });
    } else if (value == 'Moi') {
      this.proActivated = false;
      this.groupeActivated = false;
    }
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
          this.publicationForm.patchValue({
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

  public async closeModal() {
    await this.modalCtrl.dismiss();
  }

}
