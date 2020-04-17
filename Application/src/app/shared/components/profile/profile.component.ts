import { Component, OnInit, NgModule } from '@angular/core';
import { UserService } from '../../service/user.service';
import { PublicationService } from './../../service/publication.service';
import { FriendService } from './../../service/friend.service';
import {NgxTinySliderSettingsInterface, NgxTinySliderModule} from 'ngx-tiny-slider';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: [
    './profile.component.scss',
    './../../../app.component.scss'
  ]
})


export class ProfileComponent implements OnInit{

  //Tiny Slider
  tinySliderConfig: NgxTinySliderSettingsInterface;

  //Publications
  publication: any;
  
  // Friends
  friends: any;
  friendsNumber: any;

  // Infos
  user: any;
  userPicture;
  userName;
  userBio;



  constructor(private UserService: UserService, private PublicationService: PublicationService, private FriendService: FriendService) { }

  ngOnInit() {
    this.getDataProfile()

    this.tinySliderConfig = {
      arrowKeys: true,
      autoWidth: true,
      gutter: 10,
      controlsText: ['<', '>']
    };
  }

  getDataProfile() {
    let token = 1;

    this.UserService.getInfosUser(token).subscribe(response => {
      this.user = response[0];
      console.log(this.user);
      return this.user;
    });
    
    this.PublicationService.getPublications(token).subscribe(response => {
      this.publication = response;
      console.log(this.publication);
      return this.publication;
    });
    
    this.FriendService.getFriendList(token).subscribe(response => {
      this.friends = response;
      console.log(this.friends);
      this.friendsNumber = Object.keys(this.friends).length;
      return this.friends;
    });
  }

}
