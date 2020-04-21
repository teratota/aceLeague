import { Component, OnInit, NgModule, ViewChildren, ViewChild, QueryList, ElementRef} from '@angular/core';
import { UserService } from '../../service/user.service';
import { PublicationService } from './../../service/publication.service';
import { FriendService } from './../../service/friend.service';
import {NgxTinySliderSettingsInterface, NgxTinySliderModule} from 'ngx-tiny-slider';
import { NgxTinySliderComponent } from 'ngx-tiny-slider/lib/ngx-tiny-slider.component';


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
  @ViewChildren('slideList') slideList: QueryList<any>;
  @ViewChild('ngxSlider', {static: false}) private ngxSlider: ElementRef<NgxTinySliderComponent>;

  tinySliderConfig: NgxTinySliderSettingsInterface;

  cards = [
    {
      img: 'https://images.unsplash.com/photo-1543248939-ff40856f65d4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=933&q=80'
    },
    {
      img: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=934&q=80'
    }
  ]

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
      waiteForDom: true,
      arrowKeys: true,
      autoWidth: true,
      gutter: 35,
      mouseDrag: true,
      touch: true,
      controls: false,
      nav: false,
      loop: false,
      rewind:true,
      // @ts-ignore
      center: true
    };
  }

  ngAfterViewInit() {
    // @ts-ignore
    this.slideList.changes.subscribe(() =>  this.ngxSlider.domReady.next());
    if (this.cards != null) {
      // @ts-ignore
      this.ngxSlider.domReady.next();
    }
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
