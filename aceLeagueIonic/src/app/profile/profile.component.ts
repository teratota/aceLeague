import { EditGroupeComponent } from './../edit-groupe/edit-groupe.component';
import { EditProComponent } from './../edit-pro/edit-pro.component';
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

  // Tabs
  friendsTab = false;
  groupsTab = false;
  prosTab = false;
  profileTab = true;


  constructor(
    private UserService: UserService,
    private PublicationService: PublicationService,
    private FriendService: FriendService,
    public modalController: ModalController,
    public actionSheetController: ActionSheetController,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private ProService: ProService,
    public popoverController: PopoverController
    ) { }


  ngOnInit() {
    this.activeRoute.params.subscribe(routeParams => {
      this.userId = history.state.data;
      console.log(this.userId)
      if(this.userId != null){
        this.isOtherUser = false;
        this.checkFriend()
      }else{
        this.isNotFriend = false
        this.isFriendCours = false
        this.isFriend = false
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

  async createNewPro() {
    const modal = await this.modalController.create({
      component: EditProComponent,
      componentProps: {
      }
    });
    return await modal.present();
  }
  
  async createNewGroup() {
    const modal = await this.modalController.create({
      component: EditGroupeComponent,
      componentProps: {
      }
    });
    return await modal.present();
  }

  async choiceAction() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Modification',
      buttons: [{
        text: 'Modifier profil',
        icon: 'create-outline',
        handler: () => {
          this.editing();
        }
      },
      {
        text: 'Creer un groupe',
        icon: 'people-outline',
        handler: () => {
          this.createNewGroup();
        }
      },
      {
        text: 'Creer un pro',
        icon: 'pie-chart-outline',
        handler: () => {
          this.createNewPro();
        }
      },
      {
        text: 'Modifier l\'image profil',
        icon: 'image-outline',
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
        this.publication = response;
        console.log(this.publication,this.userId);
        return this.publication;
      });
    });
  }

  publicationLike(id){
    this.PublicationService.likePublication(id).subscribe(response => {
      this.PublicationService.getPublications(this.userId).subscribe(response => {
        this.publication = response;
        console.log(this.publication,this.userId);
        return this.publication;
      });
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

  goTo(link, event) {
    console.log(link);
    console.log();

    const Mytabs = document.getElementsByClassName('profileTab');

    for (let index = 0; index < Mytabs.length; index++) {
      Mytabs[index].className = Mytabs[index].className.replace(' active', '');
    }

    this.friendsTab = false;
    this.groupsTab = false;
    this.prosTab = false;
    this.profileTab = false;

    switch (link) {
      case 'profile':
        this.profileTab = true;
        event.target.classList.add('active');
        break;

      case 'friends':
        this.friendsTab = true;
        event.target.classList.add('active');
        break;

      case 'groups':
        this.groupsTab = true;
        event.target.classList.add('active');
        break;

      case 'pros':
        this.prosTab = true;
        event.target.classList.add('active');
        break;
    }
  }

}
