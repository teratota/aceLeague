import { EditProfileComponent } from './../edit-profile/edit-profile.component';
import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/service/user.service';
import { PublicationService } from 'src/app/service/publication.service';
import { FriendService } from 'src/app/service/friend.service';
import { ModalController } from '@ionic/angular';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {

  // Publications
  publication: object;

  // Friends
  friends: object;
  friendsNumber: number = 0;

  // Infos
  user: object = {
    username: 'toto',
    bio: 'blablabla'
  };
  userPicture;
  userName;
  userBio;




  constructor(
    private UserService: UserService,
    private PublicationService: PublicationService,
    private FriendService: FriendService,
    public modalController: ModalController ) { }


  ngOnInit() {
    this.getDataProfile();
  }



  getDataProfile() {


    this.UserService.getInfosUser().subscribe(response => {
      this.user = response[0];
      console.log(this.user);
      return this.user;
    });

    this.PublicationService.getPublications().subscribe(response => {
      this.publication = response;
      console.log(this.publication);
      return this.publication;
    });

    this.FriendService.getFriendList().subscribe(response => {
      this.friends = response;
      console.log(this.friends);
      this.friendsNumber = Object.keys(this.friends).length;
      return this.friends;
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


}
