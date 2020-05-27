import { Router, ActivatedRoute } from '@angular/router';
import { EditProfileComponent } from './../edit-profile/edit-profile.component';
import { Component, OnInit } from '@angular/core';
import { ActionSheetController, PopoverController } from '@ionic/angular';
import { UserService } from 'src/app/service/user.service';
import { PublicationService } from 'src/app/service/publication.service';
import { FriendService } from 'src/app/service/friend.service';
import { ModalController } from '@ionic/angular';
import { ProService } from '../service/pro.service';
import { UploadPictureComponent } from '../upload-picture/upload-picture.component';
import { RegisterComponent } from '../register/register.component';
import { CommentaireComponent } from '../commentaire/commentaire.component';
import { SecurityService } from '../service/security.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {

  // Header & NavBar
  displayHeader = false;
  displayNavbar = true;

  // Publications
  publication: object;

  // Friends
  friends: object;
  friendsNumber: number = 0;
  isNotFriend:boolean = false
  isFriendCours:boolean = false
  isFriend:boolean = false

  abonnement: number;
  // Infos
  user: object = {
    username: 'toto',
    bio: 'blablabla'
  };
  userPicture;
  userName;
  userBio;

  userId: number = null;
  isOtherUser: boolean = false;

  slideOpts = {
    initialSlide: 0,
    freeMode: false,
    slidesPerView: 3,
    effect: 'coverflow',
    pagination: '',
    breakpoints: {
      1366: {
        slidesPerView: 3,
      },
      1024: {
        slidesPerView: 2.5,
      },
      991: {
        slidesPerView: 1.5,
      },
      420: {
        slidesPerView: 1,
      }
    }
  };


  constructor(
    private UserService: UserService,
    private PublicationService: PublicationService,
    private FriendService: FriendService,
    public modalController: ModalController,
    public actionSheetController: ActionSheetController,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private ProService: ProService,
    public popoverController: PopoverController,
    private securityService: SecurityService
    ) { }


  ngOnInit() {
    this.activeRoute.params.subscribe(routeParams => {
      this.userId = history.state.data;
      if(this.userId != null){
        this.isOtherUser = false;
        this.checkFriend()
      }else{
        this.isNotFriend = false
        this.isFriendCours = false
        this.isFriend = false
        this.isOtherUser = true;
      }
      this.getDataProfile();
    });
  }



  getDataProfile() {
    this.UserService.getInfosUser(this.userId).subscribe(response => {
      this.user = JSON.parse(this.securityService.decode(response))[0];
      return this.user;
    },err => {
      if(err.error.error == "wrong token"){
        this.securityService.presentToast()
      }
    });

    this.PublicationService.getPublications(this.userId).subscribe(response => {
      this.publication = JSON.parse(this.securityService.decode(response));
      return this.publication;
    },err => {
      if(err.error.error == "wrong token"){
        this.securityService.presentToast()
      }
    });

    this.FriendService.getFriendList(this.userId).subscribe(response => {
      this.friends = JSON.parse(this.securityService.decode(response));
      this.friendsNumber = Object.keys(this.friends).length;
      return this.friends;
    },err => {
      if(err.error.error == "wrong token"){
        this.securityService.presentToast()
      }
    });

    this.ProService.getNumberAbonnementUser(this.userId).subscribe(response => {
      this.abonnement = JSON.parse(this.securityService.decode(response))[0]['COUNT(*)'];
      return this.abonnement;
    },err => {
      if(err.error.error == "wrong token"){
        this.securityService.presentToast()
      }
    });
  }


  async editing() {
    const modal = await this.modalController.create({
      component: EditProfileComponent,
      componentProps: {
        'user': this.user,
        'profilPic': 'noOneForMoment',
      }
    });
    return await modal.present();
  }

  async editingUserImage() {
    const modal = await this.modalController.create({
      component: UploadPictureComponent,
      componentProps: {
        'param': 'user',
        'profilPic': 'noOneForMoment',
      }
    });
    return await modal.present();
  }

  async choiceAction() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Modification',
      buttons: [{
        text: 'Modifié profil',
        icon: 'create-outline',
        handler: () => {
          this.editing();
        }
      },
      {
        text: "Modifié l'image profil",
        icon: 'create-outline',
        handler: () => {
          this.editingUserImage();
        }
      }, {
        text: 'Paramètres',
        icon: 'settings-outline',
        handler: () => {
          this.router.navigate(['settings']);
        }
      }, {
        text: 'Déconnexion',
        icon: 'exit-outline',
        handler: () => {
          localStorage.removeItem('token');
          this.router.navigate(['']);
        }
      }
    ]
    });
    await actionSheet.present();
  }

  publicationDislike(id){
    this.PublicationService.dislikePublication(id).subscribe(response => {
      this.PublicationService.getPublications(this.userId).subscribe(response => {
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
      this.PublicationService.getPublications(this.userId).subscribe(response => {
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

  checkFriend(){
    this.isNotFriend = false
    this.isFriendCours = false
    this.isFriend = false
      this.FriendService.checkFriend(this.userId).subscribe(response => {
        if(response == true){
          this.isNotFriend = false
          this.isFriendCours = false
          this.isFriend = true
        }else if(response == 'cour'){
          this.isNotFriend = false
          this.isFriendCours = true
          this.isFriend = false
        }else if(response == false){
          this.isNotFriend = true
          this.isFriendCours = false
          this.isFriend = false
        }
      });
  }
  addFriend(){
    this.FriendService.addFriend(this.userId).subscribe(response => {
      this.checkFriend()
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
      }
    });
    return await modal.present();
  }
}

