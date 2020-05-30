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

  isPC : boolean = false
  isMobile : boolean = false
  isImagePc :boolean = false
  isImageMobile :boolean = false

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

  constructor( private ProService: ProService,
    private router : Router, 
    private photoService: PhotoService,  
    public actionSheetController: ActionSheetController, 
    public platform: Platform, 
    private activeRoute: ActivatedRoute,
    private UserService: UserService,
    private GroupeService: GroupeService,
    private securityService : SecurityService,
    private location : Location,
    private modalCtrl: ModalController
    ) 
    {
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
    });
  }

  checkData() {
    let platform = this.platform.platforms()
    if(platform[0] == 'electron' || platform[0] == 'desktop' ){
      this.sendForElectron() 
    }else{
    if(this.param == 'pro'){
      this.ProService.updateProImage(this.data,this.cardImageBase64).subscribe(response => {
        let location = this.location.path()
        if(location == "/pro"){
          this.router.navigate(['proReload'], {state: {data:this.data}});
        }else if(location == "/proReload"){
          this.router.navigate(['pro'], {state: {data:this.data}});
        }
        this.modalCtrl.dismiss();
        return this.config;
      },err => {
        if(err.error.error == "wrong token"){
          this.securityService.presentToast()
        }
      });
    }else if(this.param == 'groupe'){
      this.GroupeService.updateGroupeImage(this.data,this.cardImageBase64).subscribe(response => {
        let location = this.location.path()
            if(location == "/groupe"){
              this.router.navigate(['groupeReload'], {state: {data:this.data}});
            }else if(location == "/groupe"){
              this.router.navigate(['groupe'], {state: {data:this.data}});
            }
            this.modalCtrl.dismiss();
        return this.config;
      },err => {
        if(err.error.error == "wrong token"){
          this.securityService.presentToast()
        }
      });
    }else if(this.param == 'user'){
      this.UserService.updateUserImage(this.cardImageBase64).subscribe(response => {
        let location = this.location.path()
            if(location == "/profile"){
              this.router.navigate(['profileReload']);
            }else if(location == "/profileReload"){
              this.router.navigate(['profile']);
            }
            this.modalCtrl.dismiss();
        return this.config;
      },err => {
        if(err.error.error == "wrong token"){
          this.securityService.presentToast()
        }
      });
    }
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
      reader.readAsDataURL(this.file);
     }
  }

  photo(){
    this.photoService.addNewToGallery()
  }

  sendForElectron(){
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
                    if(this.param == 'pro'){
                      this.ProService.updateProImage(this.data,this.cardImageBase64).subscribe(response => {
                        let location = this.location.path()
                        if(location == "/pro"){
                          this.router.navigate(['proReload'], {state: {data:this.data}});
                        }else if(location == "/proReload"){
                          this.router.navigate(['pro'], {state: {data:this.data}});
                        }
                        this.modalCtrl.dismiss();
                        return this.config;
                      },err => {
                        if(err.error.error == "wrong token"){
                          this.securityService.presentToast()
                        }
                      });
                    }else if(this.param == 'groupe'){
                      this.GroupeService.updateGroupeImage(this.data,this.cardImageBase64).subscribe(response => {
                        let location = this.location.path()
                        if(location == "/groupe"){
                          this.router.navigate(['groupeReload'], {state: {data:this.data}});
                        }else if(location == "/groupe"){
                          this.router.navigate(['groupe'], {state: {data:this.data}});
                        }
                        this.modalCtrl.dismiss();
                        return this.config;
                      },err => {
                        if(err.error.error == "wrong token"){
                          this.securityService.presentToast()
                        }
                      });
                    }else if(this.param == 'user'){
                      this.UserService.updateUserImage(this.cardImageBase64).subscribe(response => {
                        let location = this.location.path()
                        if(location == "/profile"){
                          this.router.navigate(['profileReload']);
                        }else if(location == "/profileReload"){
                          this.router.navigate(['profile']);
                        }
                        this.modalCtrl.dismiss();
                        return this.config;
                      },err => {
                        if(err.error.error == "wrong token"){
                          this.securityService.presentToast()
                        }
                      });
                    }
                  }
              };
          };

          reader.readAsDataURL(this.file);
      }else{
        //////////////////////////////////////////////////////
        if(this.param == 'pro'){
          this.ProService.updateProImage(this.data,this.cardImageBase64).subscribe(response => {
            let location = this.location.path()
            if(location == "/pro"){
              this.router.navigate(['proReload'], {state: {data:this.data}});
            }else if(location == "/proReload"){
              this.router.navigate(['pro'], {state: {data:this.data}});
            }
            this.modalCtrl.dismiss();
            return this.config;
          },err => {
            if(err.error.error == "wrong token"){
              this.securityService.presentToast()
            }
          });
        }else if(this.param == 'groupe'){
          this.GroupeService.updateGroupeImage(this.data,this.cardImageBase64).subscribe(response => {
            let location = this.location.path()
            if(location == "/groupe"){
              this.router.navigate(['groupeReload'], {state: {data:this.data}});
            }else if(location == "/groupe"){
              this.router.navigate(['groupe'], {state: {data:this.data}});
            }
            this.modalCtrl.dismiss();
            return this.config;
          },err => {
            if(err.error.error == "wrong token"){
              this.securityService.presentToast()
            }
          });
        }else if(this.param == 'user'){
          this.UserService.updateUserImage(this.cardImageBase64).subscribe(response => {
            let location = this.location.path()
            if(location == "/profile"){
              this.router.navigate(['profileReload']);
            }else if(location == "/profileReload"){
              this.router.navigate(['profile']);
            }
            this.modalCtrl.dismiss();
            return this.config;
          },err => {
            if(err.error.error == "wrong token"){
              this.securityService.presentToast()
            }
          });
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
