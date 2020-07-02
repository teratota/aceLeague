import { Component, OnInit } from '@angular/core';
import { PublicationService } from '../service/publication.service';
import { ModalController, ActionSheetController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
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

    pro: any = {
      nom: null,
      image: null,
      description: null
    };

    isJoin: boolean = false;
    isNotJoin: boolean = true;
    publication: object;
    abonnement: number;
    proId: number;
    isAuthor: boolean = false;
    profileTab: object;

  ngOnInit() {
    this.activeRoute.params.subscribe(routeParams => {
      this.isAuthor = false;
      this.proId = history.state.data;
      this.getData();
    });
  }

  // Recuperer infos sur professionnel
  getData() {
    this.ProService.getInfoPro(this.proId).subscribe(response => {
      this.pro = JSON.parse(this.securityService.decode(response))[0];
      return this.pro;
    }, err => {
      if (err.error.error === 'wrong token') {
        this.securityService.presentToast();
      }
    });

    this.ProService.getNumberAbonnement(this.proId).subscribe(response => {
      this.abonnement = JSON.parse(this.securityService.decode(response))[0]['COUNT(*)'];
      return this.abonnement;
    }, err => {
      if (err.error.error === 'wrong token') {
        this.securityService.presentToast();
      }
    });

    this.PublicationService.getProPublication(this.proId).subscribe(response => {
      this.publication = JSON.parse(this.securityService.decode(response));
      return this.publication;
    }, err => {
      if (err.error.error === 'wrong token') {
        this.securityService.presentToast();
      }
    });

    this.ProService.abonnementUserCheck(this.proId).subscribe(response => {
      if (response === true) {
        this.isJoin = true;
        this.isNotJoin = false;
      }
    }, err => {
    });

    this.ProService.checkProAuthor(this.proId).subscribe(response => {
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

  // Supprimer la publication du pro
  deletePublication(id) {
    this.PublicationService.deletePublication(id).subscribe(response => {
      this.PublicationService.getProPublication(this.proId).subscribe(response => {
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

  // Suivre un pro
  joinPro() {
    this.ProService.abonnementUserAdd(this.proId).subscribe(response => {
      if (response === true) {
        this.isJoin = true;
        this.isNotJoin = false;
        this.ProService.getNumberAbonnement(this.proId).subscribe(response => {
          this.abonnement = JSON.parse(this.securityService.decode(response))[0]['COUNT(*)'];
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

  // Editer profil pro
  async editingPro() {
    const modal = await this.modalController.create({
      component: EditProComponent,
      componentProps: {
        data: this.proId,
        profilPic: 'noOneForMoment',
      }
    });
    return await modal.present();
  }

  // Editer image de profil pro
  async editingProImage() {
    const modal = await this.modalController.create({
      component: UploadPictureComponent,
      componentProps: {
        param: 'pro',
        data: this.proId,
        profilPic: 'noOneForMoment',
      }
    });
    return await modal.present();
  }

  // Ouverture du popup parametres
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
        text: 'Modifier l\'image de profil du Pro',
        icon: 'image-outline',
        handler: () => {
          this.editingProImage();
        }
      },
      {
        text: 'Supression du pro',
        icon: 'trash-outline',
        handler: () => {
          this.ProService.deletePro(this.proId).subscribe(response => {
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

  // Fermer le modal
  dismissModal() {
    if (this.modalController) {
      this.modalController.dismiss().then(() => { this.modalController = null; });
    }
  }

  // Retirer son like sur publication
  publicationDislike(id) {
    this.PublicationService.dislikePublication(id).subscribe(response => {
      this.PublicationService.getProPublication(this.proId).subscribe(response => {
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

  // Ajouter like sur publication
  publicationLike(id) {
    this.PublicationService.likePublication(id).subscribe(response => {
      this.PublicationService.getProPublication(this.proId).subscribe(response => {
        this.publication = JSON.parse(this.securityService.decode(response));
        return this.publication;
      });
    });
  }

  // Ouvrir le modal de commentaire
  async commentaireModal(id) {
    const modal = await this.modalController.create({
      component: CommentaireComponent,
      componentProps: {
        param: id,
        data: this.proId,
        profilPic: 'noOneForMoment',
      }
    });
    return await modal.present();
  }
}
