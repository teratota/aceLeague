import { Component, OnInit } from '@angular/core';
import { PublicationService } from '../service/publication.service';
import { ModalController, ActionSheetController } from '@ionic/angular';
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
    private publicationService: PublicationService,
    public modalController: ModalController,
    private groupeService: GroupeService,
    public actionSheetController: ActionSheetController,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private securityService: SecurityService
  ) { }

  currentModal = null;

  groupe: any = {
    nom: null,
    image: null,
    description: null,
  };

  isJoin: boolean = false;
  isNotJoin: boolean = true;
  publication: object;
  abonnement: number;
  groupeId: number;
  isAuthor: boolean = false;
  profileTab: object;

  ngOnInit() {
    this.activeRoute.params.subscribe(routeParams => {
      this.isAuthor = false;
      this.groupeId = history.state.data;
      this.getData();
    });
  }

  // Recupération des donnees
  getData() {
    this.groupeService.getGroupeInfo(this.groupeId).subscribe(response => {
      this.groupe = JSON.parse(this.securityService.decode(response))[0];
      return this.groupe;
    }, err => {
      if (err.error.error === 'wrong token') {
        this.securityService.presentToast();
      }
    });

    this.groupeService.groupe2userNumberUser(this.groupeId).subscribe(response => {
      this.abonnement = JSON.parse(this.securityService.decode(response))[0]['COUNT(*)'];
      return this.abonnement;
    }, err => {
      if (err.error.error === 'wrong token') {
        this.securityService.presentToast();
      }
    });

    this.publicationService.getGroupePublication(this.groupeId).subscribe(response => {
      this.publication = JSON.parse(this.securityService.decode(response));
      return this.publication;
    }, err => {
      if (err.error.error === 'wrong token') {
        this.securityService.presentToast();
      }
    });

    this.groupeService.groupe2UserCheck(this.groupeId).subscribe(response => {
      if (response === true) {
        this.isJoin = true;
        this.isNotJoin = false;
      }
    }, err => {
      if (err.error.error === 'wrong token') {
        this.securityService.presentToast();
      }
    });

    this.groupeService.groupeCheckAuthor(this.groupeId).subscribe(response => {
      if (response === true) {
        this.isAuthor = true;
      } else {
        this.isAuthor = false;
      }
      return this.isAuthor;
    }, err => {
      if (err.error.error === 'wrong token') {
        this.securityService.presentToast();
      }
    });
  }

  // Suppresion des publications
  deletePublication(id) {
    this.publicationService.deletePublication(id).subscribe(response => {
      this.publicationService.getGroupePublication(this.groupeId).subscribe(response => {
        this.publication = JSON.parse(this.securityService.decode(response));
        return this.publication;
      }, err => {
        if (err.error.error === 'wrong token') {
          this.securityService.presentToast();
        }
      });
    }, err => {
      if (err.error.error === 'wrong token') {
        this.securityService.presentToast();
      }
    });
  }


  // Rejoindre groupe
  joinGroupe() {
    this.groupeService.groupe2UserAdd(this.groupeId).subscribe(response => {
      if (response === true) {
        this.isJoin = true;
        this.isNotJoin = false;
        this.groupeService.groupe2userNumberUser(this.groupeId).subscribe(response => {
          this.abonnement = response[0]['COUNT(*)'];
          return this.abonnement;
        }, err => {
          if (err.error.error === 'wrong token') {
            this.securityService.presentToast();
          }
        });
      }
    }, err => {
      if (err.error.error === 'wrong token') {
        this.securityService.presentToast();
      }
    });
  }

  // Modification du groupe
  async editingGroupe() {
    const modal = await this.modalController.create({
      component: EditGroupeComponent,
      componentProps: {
        data: this.groupeId,
        profilPic: 'noOneForMoment',
      }
    });
    this.currentModal = modal;
    return await modal.present();
  }

  // Modification image du groupe
  async editingGroupeImage() {
    const modal = await this.modalController.create({
      component: UploadPictureComponent,
      componentProps: {
        param: 'groupe',
        data: this.groupeId,
        profilPic: 'noOneForMoment',
      }
    });
    this.currentModal = modal;
    await modal.present();
  }

  // Gestion utilisateurs du groupe
  async editingUserGroupe() {
    const modal = await this.modalController.create({
      component: EditUserGroupeComponent,
      componentProps: {
        data: this.groupeId,
        profilPic: 'noOneForMoment',
      }
    });
    this.currentModal = modal;
    await modal.present();
  }

  // Popup paramètres
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
        text: 'Modifié l\'image de profil du Groupe',
        icon: 'image-outline',
        handler: () => {
          this.editingGroupeImage();
        }
      },
      {
        text: 'Gestion des Utilisateurs',
        icon: 'people-outline',
        handler: () => {
          this.editingUserGroupe();
        }
      },
      {
        text: 'Supression du Groupe',
        icon: 'trash-outline',
        handler: () => {
          this.groupeService.deleteGroupe(this.groupeId).subscribe(response => {
            this.router.navigate(['profile']);
          }, err => {
            if (err.error.error === 'wrong token') {
              this.securityService.presentToast();
            }
          });
        }
      }
    ]
    });
    await actionSheet.present();
  }

  // Suppression de like
  publicationDislike(id) {
    this.publicationService.dislikePublication(id).subscribe(response => {
      this.publicationService.getGroupePublication(this.groupeId).subscribe(response => {
        this.publication = JSON.parse(this.securityService.decode(response));
        return this.publication;
      }, err => {
        if (err.error.error === 'wrong token') {
          this.securityService.presentToast();
        }
      });
    }, err => {
      if (err.error.error === 'wrong token') {
        this.securityService.presentToast();
      }
    });
  }

  // Ajout de like
  publicationLike(id) {
    this.publicationService.likePublication(id).subscribe(response => {
      this.publicationService.getGroupePublication(this.groupeId).subscribe(response => {
        this.publication = JSON.parse(this.securityService.decode(response));
        return this.publication;
      }, err => {
        if (err.error.error === 'wrong token') {
          this.securityService.presentToast();
        }
      });
    }, err => {
      if (err.error.error === 'wrong token') {
        this.securityService.presentToast();
      }
    });
  }

  // Ajout de commentaire
  async commentaireModal(id) {
    const modal = await this.modalController.create({
      component: CommentaireComponent,
      componentProps: {
        param: id,
        data: this.groupeId,
        profilPic: 'noOneForMoment',
      },
    });
    this.currentModal = modal;
    return await modal.present();
  }

  // Fermeture du modal
  dismissModal() {
    if (this.currentModal) {
      this.currentModal.dismiss().then(() => {
        this.getData();
        this.currentModal = null;
      });
    }
  }
}
