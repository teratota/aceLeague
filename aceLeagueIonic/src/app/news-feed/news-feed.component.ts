import { PhotoService } from './../service/photo.service';
import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/service/user.service';
import { PublicationService } from 'src/app/service/publication.service';
import { FriendService } from 'src/app/service/friend.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-news-feed',
  templateUrl: './news-feed.component.html',
  styleUrls: ['./news-feed.component.scss'],
})
export class NewsFeedComponent implements OnInit {

  // Publications
  publications: object;

  constructor(private UserService: UserService, private PublicationService: PublicationService, private FriendService: FriendService, private PhotoService: PhotoService, private activeRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activeRoute.params.subscribe(routeParams => {
      this.getPublications();
    });
  }


  getPublications() {
    this.PublicationService.getAllPublications().subscribe(response => {
      this.publications = response;
      console.log(this.publications);
      return this.publications;
    });
  }

  publicationDislike(id){
    this.PublicationService.dislikePublication(id).subscribe(response => {
      this.PublicationService.getAllPublications().subscribe(response => {
        this.publications = response;
        console.log(this.publications);
        return this.publications;
      });
    });
  }

  publicationLike(id){
    this.PublicationService.likePublication(id).subscribe(response => {
      this.PublicationService.getAllPublications().subscribe(response => {
        this.publications = response;
        console.log(this.publications);
        return this.publications;
      });
    });
  }

  sharing() {
    console.log('share');
    
  }

  moreOptions() {
    console.log('more');
    
  }

}
