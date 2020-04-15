import { Component, OnInit } from '@angular/core';
import { UserService } from '../../service/user.service';
import { PublicationService } from './../../service/publication.service';
import { FriendService } from './../../service/friend.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  publication: any;
  friends: any;
  user: any;


  constructor(private UserService: UserService, private PublicationService: PublicationService, private FriendService: FriendService) { }

  ngOnInit() {
    this.getDataProfile()
  }

  getDataProfile() {
    let token = 1;

    this.UserService.getInfosUser(token).subscribe(response => {
      this.user = response;
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
      return this.friends;
    });


  }

}
