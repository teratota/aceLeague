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

  json: string;
  jsonParsed: string;

  name: string;
  certified: boolean;
  profilePicture: string;
  description: string;
  //friends: any;
  friendsNumber: number;
  
  clubs: any;
  clubsNumber: number;

  publication: any;
  friends: any;
  user: any;

  config: any;

  constructor(private UserService: UserService, private PublicationService: PublicationService, private FriendService: FriendService) { 
    //this.json = '{"name":"myNameIs","profilePicture":"/picture/id/profile.png","certified":1,"pseudo":"UserName","description":"i\'m a user of AceLeague","friends":{"id1":["name1","desc1","url1"],"id2":["name2","desc2","url2"]},"clubs":{"id1":["name1","desc1","url1"],"id2":["name2","desc2","url2"]}}';

    //this.jsonParsed = JSON.parse(this.json)
    
    // this.name = this.jsonParsed['name']

    // this.certified = this.jsonParsed['certified']
    
    // this.profilePicture = this.jsonParsed['profilePicture']
    
    // this.description = this.jsonParsed['description']

    // this.friends = this.jsonParsed['friends']
    // let friends = this.friends
    // this.friends = Object.keys(friends).map(function(personNamedIndex){
    //   let person = friends[personNamedIndex];
    //   console.log(person);
    //   return person;
    // });
    // this.friendsNumber = Object.keys(friends).length
    
    // this.clubs = this.jsonParsed['friends']
    // let clubs = this.clubs
    // this.clubs = Object.keys(clubs).map(function(personNamedIndex){
    //   let club = clubs[personNamedIndex];
    //   console.log(club);
    //   return club;
    // });
    // this.clubsNumber = Object.keys(clubs).length
    
    

  }

  ngOnInit() {
    this.getDataProfile()
  }

  getDataProfile() {
    let token = 1;

    this.UserService.getInfosUser(token)
    .subscribe((data: any) => this.user = data);
    console.log(this.user);
    
    this.PublicationService.getPublications(token)
    .subscribe((data: any) => this.publication = data);
    
    this.FriendService.getFriendList(token)
    .subscribe((data: any) => this.friends = data);

    console.log(this.user)
    console.log(this.publication)
    console.log(this.friends)
  }

}
