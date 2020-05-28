import { Component, OnInit } from '@angular/core';
import { PublicationService } from '../service/publication.service';
import { ModalController, ActionSheetController } from '@ionic/angular';
import { ProService } from '../service/pro.service';
import { Router, ActivatedRoute } from '@angular/router';
import { GroupeService } from '../service/groupe.service';
import { EditGroupeComponent } from '../edit-groupe/edit-groupe.component';
import { UploadPictureComponent } from '../upload-picture/upload-picture.component';
import { CommentaireComponent } from '../commentaire/commentaire.component';
import { EditUserGroupeComponent } from '../edit-user-groupe/edit-user-groupe.component';
import { SecurityService } from '../service/security.service';

@Component({
  selector: 'app-groupe',
  templateUrl: './groupe.component.html',
  styleUrls: ['./groupe.component.scss'],
})
export class GroupeComponent implements OnInit {

  constructor(
    private PublicationService: PublicationService,
    public modalController: ModalController,
    private GroupeService: GroupeService,
    public actionSheetController: ActionSheetController,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private securityService: SecurityService
    ) { }

    // Modal
  currentModal = null;

    groupe:object = {
      nom:'',
      image:'',
    };
    isJoin: boolean = false;
    isNotJoin: boolean = true;
    publication:object;
    abonnement:number;
    groupeId:number;
    isAuthor: boolean = false;

  ngOnInit() {
    this.activeRoute.params.subscribe(routeParams => {
      this.isAuthor = false;
      this.groupeId = history.state.data;
      this.getData();
    });
  }
  

  getData(){
    this.GroupeService.getGroupeInfo(this.groupeId).subscribe(response => {
      this.groupe = JSON.parse(this.securityService.decode(response))[0];
      return this.groupe;
    },err => {
      if(err.error.error == "wrong token"){
        this.securityService.presentToast()
      }
    });

    this.GroupeService.groupe2userNumberUser(this.groupeId).subscribe(response => {
      this.abonnement = JSON.parse(this.securityService.decode(response))[0]['COUNT(*)'];
      return this.abonnement;
    },err => {
      if(err.error.error == "wrong token"){
        this.securityService.presentToast()
      }
    });
    
    this.PublicationService.getGroupePublication(this.groupeId).subscribe(response => {
      this.publication = JSON.parse(this.securityService.decode(response));
      return this.publication;
    },err => {
      if(err.error.error == "wrong token"){
        this.securityService.presentToast()
      }
    });

    this.GroupeService.groupe2UserCheck(this.groupeId).subscribe(response => {
      if(response == true){
        this.isJoin = true;
        this.isNotJoin =false;
      }
    },err => {
      if(err.error.error == "wrong token"){
        this.securityService.presentToast()
      }
    });

    this.GroupeService.groupeCheckAuthor(this.groupeId).subscribe(response => {
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

  joinGroupe(){
    this.GroupeService.groupe2UserAdd(this.groupeId).subscribe(response => {
      if(response == true){
        this.isJoin = true;
        this.isNotJoin =false;
        this.GroupeService.groupe2userNumberUser(this.groupeId).subscribe(response => {
          this.abonnement = response[0]['COUNT(*)'];
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

  async editingGroupe() {
    const modal = await this.modalController.create({
      component: EditGroupeComponent,
      componentProps: {
        'data': this.groupeId,
        'profilPic': 'noOneForMoment',
      }
    });
    this.currentModal = modal;
    return await modal.present();
  }

  async editingGroupeImage() {
    const modal = await this.modalController.create({
      component: UploadPictureComponent,
      componentProps: {
        'param': 'groupe',
        'data': this.groupeId,
        'profilPic': 'noOneForMoment',
      }
    });
    this.currentModal = modal;
    await modal.present();
  }

  async editingUserGroupe() {
    const modal = await this.modalController.create({
      component: EditUserGroupeComponent,
      componentProps: {
        'data': this.groupeId,
        'profilPic': 'noOneForMoment',
      }
    });
    this.currentModal = modal;
    await modal.present();
  }

  async choiceAction() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Modification',
      buttons: [{
        text: 'Modifié profil du Groupe',
        icon: 'create-outline',
        handler: () => {
          this.editingGroupe();
        }
      }, {
        text: "Modifié l'image de profil du Groupe",
        icon: 'create-outline',
        handler: () => {
          this.editingGroupeImage();
        }
      },
      {
        text: "Gestion des Utilisateurs",
        icon: 'create-outline',
        handler: () => {
          this.editingUserGroupe();
        }
      }
    ]
    });
    await actionSheet.present();
  }

  publicationDislike(id){
    this.PublicationService.dislikePublication(id).subscribe(response => {
      this.PublicationService.getGroupePublication(this.groupeId).subscribe(response => {
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
      this.PublicationService.getGroupePublication(this.groupeId).subscribe(response => {
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

  async commentaireModal(id) {
    const modal = await this.modalController.create({
      component: CommentaireComponent,
      componentProps: {
        'param': id,
        'profilPic': 'noOneForMoment',
      },
    });
    this.currentModal = modal;
    return await modal.present();
  }

  dismissModal() {
    if (this.currentModal) {
      this.currentModal.dismiss().then(() => {
        this.getData()
         this.currentModal = null; 
        });
    }
  }
}
