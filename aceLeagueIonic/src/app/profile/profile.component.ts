import { Router, ActivatedRoute } from '@angular/router';
import { EditProfileComponent } from './../edit-profile/edit-profile.component';
import { Component, OnInit } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { UserService } from 'src/app/service/user.service';
import { PublicationService } from 'src/app/service/publication.service';
import { FriendService } from 'src/app/service/friend.service';
import { ModalController } from '@ionic/angular';
import { ProService } from '../service/pro.service';
import { UploadPictureComponent } from '../upload-picture/upload-picture.component';


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
  isNotFriend:boolean = true
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
    private ProService: ProService
    ) { }


  ngOnInit() {
    this.activeRoute.params.subscribe(routeParams => {
      this.userId = history.state.data;
      console.log(this.userId)
      if(this.userId != null){
        this.isOtherUser = false;
        this.checkFriend()
      }else{
        this.isOtherUser = true;
      }
      console.log(this.userId)
      this.getDataProfile();
    });
  }



  getDataProfile() {


    this.UserService.getInfosUser(this.userId).subscribe(response => {
      this.user = response[0];
      console.log(this.user,this.userId);
      return this.user;
    });

    this.PublicationService.getPublications(this.userId).subscribe(response => {
      this.publication = response;
      console.log(this.publication,this.userId);
      return this.publication;
    });

    this.FriendService.getFriendList(this.userId).subscribe(response => {
      this.friends = response;
      console.log(this.friends);
      this.friendsNumber = Object.keys(this.friends).length;
      return this.friends;
    });

    this.ProService.getNumberAbonnementUser(this.userId).subscribe(response => {
      this.abonnement = response[0]['COUNT(*)'];
      console.log(this.abonnement);
      return this.abonnement;
    });
  }

  checkFriend(){

  }

  addFriend(){

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

}
