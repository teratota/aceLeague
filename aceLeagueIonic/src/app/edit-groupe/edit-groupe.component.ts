import { Component, OnInit, Input } from '@angular/core';
import { ValidationService } from 'src/app/service/validation.service';
import { UserService } from 'src/app/service/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PhotoService } from '../service/photo.service';
import { ActionSheetController, Platform, ModalController } from '@ionic/angular';
import * as _ from 'lodash';
import { GroupeService } from '../service/groupe.service';
import { SecurityService } from '../service/security.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-edit-groupe',
  templateUrl: './edit-groupe.component.html',
  styleUrls: ['./edit-groupe.component.scss'],
})
export class EditGroupeComponent implements OnInit {

  config: any;
  token: any;

  @Input() data: number;

  firstView : boolean = true ;
  secondView : boolean = false;
  addView : boolean = true;
  editView: boolean = false;

  isPC : boolean = false
  isMobile : boolean = false
  isImagePc :boolean = false
  isImageMobile :boolean = false

  groupeEdit: any;

  groupeForm = new FormGroup({
    nom:new FormControl('',[
      Validators.required,
      Validators.maxLength(255),
      Validators.minLength(1)
    ]),
    private:new FormControl('',[
      Validators.required,
    ]),
    description:new FormControl('',[
      Validators.required,
      Validators.minLength(1)
    ]),
    image:new FormControl('',[
    ]),                                                                          
  });

  groupeFormEdit = new FormGroup({
    nom:new FormControl('',[
      Validators.required,
      Validators.maxLength(255),
      Validators.minLength(1)
    ]),
    private:new FormControl('',[
      Validators.required,
    ]),
    description:new FormControl('',[
      Validators.required,
      Validators.minLength(1)
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

  constructor(private ValidationService: ValidationService, private GroupeService: GroupeService,private router : Router, private photoService: PhotoService,  public actionSheetController: ActionSheetController, public platform: Platform, private activeRoute: ActivatedRoute ,private securityService: SecurityService, private modalCtrl: ModalController, private location: Location) {
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
      if(this.data == null){
        this.groupeForm.setValue({
          nom: '',
          private:0,
          description:'',
          image:'',
        })
      }else{
        this.editView = true;
        this.addView = false;
        this.getData();
      }
    });
  }

  checkData() {
    let platform = this.platform.platforms()
    if(platform[0] == 'electron' || platform[0] == 'desktop' ){
      this.sendForElectron() 
    }else{
      this.GroupeService.newGroupe(this.groupeForm.value,this.photoService.base).subscribe(response => {
        this.firstView = true ;
        this.secondView = false;
        let location = this.location.path()
        if(location == "/profile"){
          this.router.navigate(['profileReload']);
        }else{
          this.router.navigate(['profile']);
        }
        return this.config;
      },err => {
        if(err.error.error == "wrong token"){
          this.securityService.presentToast()
        }
      });
    }
  }

  checkDataEdit() {
      this.GroupeService.updateGroupe(this.groupeFormEdit.value,this.data).subscribe(response => {
        this.firstView = true ;
        this.secondView = false;
        this.addView = true;
        this.editView = false;
        let location = this.location.path()
        if(location == "/groupe"){
          this.router.navigate(['groupeReload'], {state: {data:this.data}});
        }else{
          this.router.navigate(['groupe'], {state: {data:this.data}});
        }
        this.modalCtrl.dismiss();
        return this.config;
      },err => {
        if(err.error.error == "wrong token"){
          this.securityService.presentToast()
        }
      });
  }

  getData() {
    this.GroupeService.getGroupeInfo(this.data).subscribe(response => {
      this.groupeEdit = JSON.parse(this.securityService.decode(response))[0];
      this.groupeFormEdit.patchValue({
        nom: this.groupeEdit.nom,
        private: this.groupeEdit.private,
        description: this.groupeEdit.description,
      })
      return this.groupeEdit;
    },err => {
      if(err.error.error == "wrong token"){
        this.securityService.presentToast()
      }
    });
  }

  next()
  {
    this.firstView = false ;
    this.secondView = true;
  }

  last()
  {
    this.firstView = true ;
    this.secondView = false;
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
                        this.GroupeService.newGroupe(this.groupeForm.value,this.cardImageBase64).subscribe(response => {
                          this.firstView = true ;
                          this.secondView = false;
                          let location = this.location.path()
                          if(location == "/profile"){
                            this.router.navigate(['profileReload']);
                          }else{
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
              };
          };

          reader.readAsDataURL(this.file);
      }else{
        //////////////////////////////////////////////////////
          this.GroupeService.newGroupe(this.groupeForm.value,this.cardImageBase64).subscribe(response => {
            this.firstView = true ;
            this.secondView = false;
            let location = this.location.path()
            if(location == "/profile"){
              this.router.navigate(['profileReload']);
            }else{
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
          this.groupeForm.patchValue({
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

  public async closeModal() {
    await this.modalCtrl.dismiss();
  }

}
