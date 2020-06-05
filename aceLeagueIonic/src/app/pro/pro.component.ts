import { Component, OnInit } from '@angular/core';
import { PublicationService } from '../service/publication.service';
import { ModalController, ActionSheetController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { getLocaleDateFormat } from '@angular/common';
import { ProService } from '../service/pro.service';
import { EditProComponent } from '../edit-pro/edit-pro.component';
import { UploadPictureComponent } from '../upload-picture/upload-picture.component';
import { CommentaireComponent } from '../commentaire/commentaire.component';
import { SecurityService } from '../service/security.service';

@Component({
  selector: 'app-pro',
  templateUrl: './pro.component.html',
  styleUrls: ['./pro.component.scss'],
})
export class ProComponent implements OnInit {

  constructor(
    private PublicationService: PublicationService,
    public modalController: ModalController,
    private ProService: ProService,
    public actionSheetController: ActionSheetController,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private securityService: SecurityService
    ) { }

    pro:object = {
      nom:'',
      image:'',
    };

    isJoin: boolean = false;
    isNotJoin: boolean = true;
    publication:object;
    abonnement:number;
    proId:number;
    isAuthor: boolean = false;

  ngOnInit() {
    this.activeRoute.params.subscribe(routeParams => {
      this.isAuthor = false;
      this.proId = history.state.data;
      console.log(this.proId);
      this.getData();
    });
  }
  

  getData(){
    console.log(this.proId)
    this.ProService.getInfoPro(this.proId).subscribe(response => {
      this.pro = JSON.parse(this.securityService.decode(response))[0];
      return this.pro;
    },err => {
      if(err.error.error == "wrong token"){
        this.securityService.presentToast()
      }
    });

    this.ProService.getNumberAbonnement(this.proId).subscribe(response => {
      this.abonnement = JSON.parse(this.securityService.decode(response))[0]['COUNT(*)'];
      return this.abonnement;
    },err => {
      if(err.error.error == "wrong token"){
        this.securityService.presentToast()
      }
    });
    
    this.PublicationService.getProPublication(this.proId).subscribe(response => {
      this.publication = JSON.parse(this.securityService.decode(response));
      return this.publication;
    },err => {
      if(err.error.error == "wrong token"){
        this.securityService.presentToast()
      }
    });

    this.ProService.abonnementUserCheck(this.proId).subscribe(response => {
      if(response == true){
        this.isJoin = true;
        this.isNotJoin = false;
      }
    },err => {
      // if(err.error.error == "wrong token"){
      //   this.securityService.presentToast()
      // }
    });

    this.ProService.checkProAuthor(this.proId).subscribe(response => {
      if(response == true){
        this.isAuthor = true;
      }else{
        this.isAuthor = false;
      }
      return this.isAuthor;
    },err => {
      if(err.error.error == "wrong token"){
        this.securityService.presentToast()
      }
    });
  }

  joinPro(){
    this.ProService.abonnementUserAdd(this.proId).subscribe(response => {
      if(response == true){
        this.isJoin = true;
        this.isNotJoin = false;
        this.ProService.getNumberAbonnement(this.proId).subscribe(response => {
          this.abonnement = JSON.parse(this.securityService.decode(response))[0]['COUNT(*)'];
          return this.abonnement;
        },err => {
          if(err.error.error == "wrong token"){
            this.securityService.presentToast()
          }
        });
      }
    },err => {
      if(err.error.error == "wrong token"){
        this.securityService.presentToast()
      }
    });
  }

  async editingPro() {
    const modal = await this.modalController.create({
      component: EditProComponent,
      componentProps: {
        'data': this.proId,
        'profilPic': 'noOneForMoment',
      }
    });
    return await modal.present();
  }

  async editingProImage() {
    const modal = await this.modalController.create({
      component: UploadPictureComponent,
      componentProps: {
        'param': 'pro',
        'data': this.proId,
        'profilPic': 'noOneForMoment',
      }
    });
    return await modal.present();
  }

  async choiceAction() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Modification',
      buttons: [{
        text: 'Modifier profil du Pro',
        icon: 'create-outline',
        handler: () => {
          this.editingPro();
        }
      }, {
        text: "Modifier l'image de profil du Pro",
        icon: 'image-outline',
        handler: () => {
          this.editingProImage();
        }
      }
    ]
    });
    await actionSheet.present();
  }

  dismissModal() {
    if (this.modalController) {
      this.modalController.dismiss().then(() => { this.modalController = null; });
    }
  }

  publicationDislike(id){
    this.PublicationService.dislikePublication(id).subscribe(response => {
      this.PublicationService.getProPublication(this.proId).subscribe(response => {
      this.publication = JSON.parse(this.securityService.decode(response));
      return this.publication;
    },err => {
      if(err.error.error == "wrong token"){
        this.securityService.presentToast()
      }
    });
    },err => {
      if(err.error.error == "wrong token"){
        this.securityService.presentToast()
      }
    });
  }

  publicationLike(id){
    this.PublicationService.likePublication(id).subscribe(response => {
      this.PublicationService.getProPublication(this.proId).subscribe(response => {
        this.publication = JSON.parse(this.securityService.decode(response));
        return this.publication;
      });
    });
  }

  async commentaireModal(id) {
    const modal = await this.modalController.create({
      component: CommentaireComponent,
      componentProps: {
        'param': id,
        'data':this.proId,
        'profilPic': 'noOneForMoment',
      }
    });
    return await modal.present();
  }
}
