import { PhotoService } from './../service/photo.service';
import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/service/user.service';
import { PublicationService } from 'src/app/service/publication.service';
import { FriendService } from 'src/app/service/friend.service';
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

  constructor(private UserService: UserService, public modalController: ModalController,private PublicationService: PublicationService, private FriendService: FriendService, private PhotoService: PhotoService, private activeRoute: ActivatedRoute,private securityService: SecurityService) { }

  ngOnInit() {
    this.activeRoute.params.subscribe(routeParams => {
      this.getPublications();
    },err => {
      if(err.error.error == "wrong token"){
        this.securityService.presentToast()
      }
    });
  }


  getPublications() {
    this.PublicationService.getAllPublications().subscribe(response => {
      this.publications = JSON.parse(this.securityService.decode(response));
      console.log(this.publications);
      
      return this.publications;
    },err => {
      if(err.error.error == "wrong token"){
        this.securityService.presentToast()
      }
    });
  }

  publicationDislike(id){
    this.PublicationService.dislikePublication(id).subscribe(response => {
      this.PublicationService.getAllPublications().subscribe(response => {
        this.publications = JSON.parse(this.securityService.decode(response));
        return this.publications;
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
      this.PublicationService.getAllPublications().subscribe(response => {
        this.publications = JSON.parse(this.securityService.decode(response));
        return this.publications;
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

  sharing() {
    
  }

  moreOptions() {
    
  }

  async commentaireModal(id) {
    const modal = await this.modalController.create({
      component: CommentaireComponent,
      componentProps: {
        'param': id,
        'profilPic': 'noOneForMoment',
      }
    });
    return await modal.present();
  }

}
