import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/service/user.service';
import { PublicationService } from 'src/app/service/publication.service';
import { FriendService } from 'src/app/service/friend.service';

@Component({
  selector: 'app-news-feed',
  templateUrl: './news-feed.component.html',
  styleUrls: ['./news-feed.component.scss'],
})
export class NewsFeedComponent implements OnInit {

  // Publications
  publications: object;

  // Friends
  friends: object;

  constructor(private UserService: UserService, private PublicationService: PublicationService, private FriendService: FriendService) { }

  ngOnInit() {
    this.getPublications();
  }


  getPublications() {
    this.PublicationService.getAllPublications().subscribe(response => {
      this.publications = response;
      console.log(this.publications);
      return this.publications;
    });

  }

}
