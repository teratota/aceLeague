import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PublicationService } from 'src/app/service/publication.service';
import { PhotoService } from 'src/app/service/photo.service';
import { ActionSheetController, Platform} from '@ionic/angular';
import { ProService } from '../service/pro.service';
import { GroupeService } from '../service/groupe.service';
import { Router, ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import { SecurityService } from '../service/security.service';

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
  isPC : boolean = false
  isMobile : boolean = false
  isImagePc :boolean = false
  isImageMobile :boolean = false
  publicationForm = new FormGroup({
    description:new FormControl('',[
      Validators.required
    ]) ,    
    pro : new FormControl('',[
    ]) ,   
    groupe : new FormControl('',[
    ]) , 
    param : new FormControl('Moi',[
    ]) ,  
    image: new FormControl('',[
    ]) ,                                       
  });

  pro: object = {
    id : null,
    nom: null
  }
  proActivated : boolean = false;
  groupe: object = {
    id: null,
    nom: null
  }
  groupeActivated : boolean = false;

  imageError: string;
  isImageSaved: boolean;
  cardImageBase64: string;
  previewImagePath: any

  publication : any;

  file: File;

  imageUrl: string | ArrayBuffer =
    "https://bulma.io/images/placeholders/480x480.png";
  fileName: string = "No file selected";

  constructor(private router: Router, private PublicationService: PublicationService, private photoService: PhotoService,  public actionSheetController: ActionSheetController, private ProService : ProService, private GroupeService : GroupeService, public platform: Platform, private activeRoute: ActivatedRoute ,private securityService: SecurityService) { }

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
      this.publicationForm.setValue({
        description: '',
        pro:'',
        groupe:'',
        param:'Moi',
        image:''
      })
    });
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

  send(){
    console.log(this.platform.platforms())
    let platform = this.platform.platforms()
    if(platform[0] == 'electron' || platform[0] == 'desktop' ){
      this.sendForElectron() 
    }else{
      console.log('tgdsshbjhb')
    console.log(this.photoService.blob)
    console.log(this.photoService.base)
    console.log(this.publicationForm.value)
    if(this.publicationForm.value.param == "Moi"){
      this.PublicationService.uploadPublication(this.photoService.base, this.publicationForm.value).subscribe(response => {
        this.publication = response;
        console.log(this.publication);
        this.router.navigate(['profile']);
      },err => {
        if(err.error.error == "wrong token"){
          this.securityService.presentToast()
        }
      });
    }else if(this.publicationForm.value.param == "Pro"){
      this.PublicationService.uploadPublicationPro(this.photoService.base, this.publicationForm.value).subscribe(response => {
        this.publication = response;
        console.log(this.publication);
        this.router.navigate(['pro'], {state: {data:this.publicationForm.value.pro}});
      },err => {
        if(err.error.error == "wrong token"){
          this.securityService.presentToast()
        }
      });
    }else if(this.publicationForm.value.param == "Groupe"){
      this.PublicationService.uploadPlublicationGroupe(this.photoService.base, this.publicationForm.value).subscribe(response => {
        this.publication = response;
        console.log(this.publication);
        this.router.navigate(['groupe'], {state: {data:this.publicationForm.value.groupe}});
      },err => {
        if(err.error.error == "wrong token"){
          this.securityService.presentToast()
        }
      });
    }  
    }
  }

  sendForElectron(){
    console.log(this.publicationForm.value);
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
                      if(this.publicationForm.value.param == "Moi"){
                        this.PublicationService.uploadPublication(this.cardImageBase64, this.publicationForm.value).subscribe(response => {
                          this.publication = response;
                          console.log(this.publication);
                          this.router.navigate(['profile']);
                        },err => {
                          if(err.error.error == "wrong token"){
                            this.securityService.presentToast()
                          }
                        });
                      }else if(this.publicationForm.value.param == "Pro"){
                        this.PublicationService.uploadPublicationPro(this.cardImageBase64, this.publicationForm.value).subscribe(response => {
                          this.publication = response;
                          console.log(this.publication);
                          this.router.navigate(['pro'], {state: {data:this.publicationForm.value.pro}});
                        },err => {
                          if(err.error.error == "wrong token"){
                            this.securityService.presentToast()
                          }
                        });
                      }else if(this.publicationForm.value.param == "Groupe"){
                        this.PublicationService.uploadPlublicationGroupe(this.cardImageBase64, this.publicationForm.value).subscribe(response => {
                          this.publication = response;
                          console.log(this.publication);
                          this.router.navigate(['groupe'], {state: {data:this.publicationForm.value.groupe}});
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
        if(this.publicationForm.value.param == "Moi"){
          this.PublicationService.uploadPublication(this.cardImageBase64, this.publicationForm.value).subscribe(response => {
            this.publication = response;
            console.log(this.publication);
            this.router.navigate(['profile']);
          },err => {
            if(err.error.error == "wrong token"){
              this.securityService.presentToast()
            }
          });
        }else if(this.publicationForm.value.param == "Pro"){
          this.PublicationService.uploadPublicationPro(this.cardImageBase64, this.publicationForm.value).subscribe(response => {
            this.publication = response;
            console.log(this.publication);
            this.router.navigate(['pro'], {state: {data:this.publicationForm.value.pro}});
          },err => {
            if(err.error.error == "wrong token"){
              this.securityService.presentToast()
            }
          });
        }else if(this.publicationForm.value.param == "Groupe"){
          this.PublicationService.uploadPlublicationGroupe(this.cardImageBase64, this.publicationForm.value).subscribe(response => {
            this.publication = response;
            console.log(this.publication);
            this.router.navigate(['groupe'], {state: {data:this.publicationForm.value.groupe}});
          },err => {
            if(err.error.error == "wrong token"){
              this.securityService.presentToast()
            }
          });
        }  
      }
  }

  getList(value){
    console.log('test')
    if(value == 'Groupe'){
      this.GroupeService.groupe2UserGetList().subscribe(response => {
        this.groupe = JSON.parse(this.securityService.decode(response));
        this.groupeActivated = true;
        this.proActivated = false;
        console.log(this.groupe);
        return this.groupe;
      },err => {
        if(err.error.error == "wrong token"){
          this.securityService.presentToast()
        }
      });
    }else if(value == 'Pro'){
      this.ProService.getListMe().subscribe(response => {
        this.pro = JSON.parse(this.securityService.decode(response));
        this.proActivated = true;
        this.groupeActivated = false;
        console.log(this.pro);
        return this.pro;
      },err => {
        if(err.error.error == "wrong token"){
          this.securityService.presentToast()
        }
      });
    } else if(value == 'Moi'){
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
          this.file = null;
          this.publicationForm.patchValue({
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
}
