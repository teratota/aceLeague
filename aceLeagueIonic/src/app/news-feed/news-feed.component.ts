import { Component, OnInit } from '@angular/core';
import { PublicationService } from 'src/app/service/publication.service';
import { ActivatedRoute } from '@angular/router';
import { CommentaireComponent } from '../commentaire/commentaire.component';
import { ModalController } from '@ionic/angular';
import { SecurityService } from '../service/security.service';

@Component({
  selector: 'app-news-feed',
  templateUrl: './news-feed.component.html',
  styleUrls: ['./news-feed.component.scss'],
})
export class NewsFeedComponent implements OnInit {

  // Publications
  publications: object;

  constructor(
    public modalController: ModalController,
    private publicationService: PublicationService,
    private activeRoute: ActivatedRoute,
    private securityService: SecurityService) { }

  ngOnInit() {
    this.activeRoute.params.subscribe(routeParams => {
      this.getPublications();
    }, err => {
      if (err.error.error === 'wrong token') {
        this.securityService.presentToast();
      }
    });
  }

  // Recuperation des publications
  getPublications() {
    this.publicationService.getAllPublications().subscribe(response => {
      this.publications = JSON.parse(this.securityService.decode(response));
      return this.publications;
    }, err => {
      if (err.error.error === 'wrong token') {
        this.securityService.presentToast();
      }
    });
  }

  // Retirer son like d'une publication
  publicationDislike(id) {
    this.publicationService.dislikePublication(id).subscribe(response => {
      this.publicationService.getAllPublications().subscribe(response => {
        this.publications = JSON.parse(this.securityService.decode(response));
        return this.publications;
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

  // Ajout du like d'une publication
  publicationLike(id) {
    this.publicationService.likePublication(id).subscribe(response => {
      this.publicationService.getAllPublications().subscribe(response => {
        this.publications = JSON.parse(this.securityService.decode(response));
        return this.publications;
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

  // Affichage du modal commentaire
  async commentaireModal(id) {
    const modal = await this.modalController.create({
      component: CommentaireComponent,
      componentProps: {
        param: id,
        profilPic: 'noOneForMoment',
      }
    });
    return await modal.present();
  }

}
