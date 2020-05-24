import { Component, OnInit } from '@angular/core';
import { FriendService } from '../service/friend.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-list-unvalidate-friend',
  templateUrl: './list-unvalidate-friend.component.html',
  styleUrls: ['./list-unvalidate-friend.component.scss'],
})
export class ListUnvalidateFriendComponent implements OnInit {

  friends: object;

  constructor(private FriendService: FriendService, private activeRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activeRoute.params.subscribe(routeParams => {
      this.FriendService.ListUnvalidateFriend().subscribe(response => {
        this.friends = response
        console.log(this.friends)
        return this.friends
      });
    });
  }

  accepted(id){
    this.FriendService.ValidateFriend(true,id).subscribe(response => {});
  }
  
  refused(id){
    this.FriendService.ValidateFriend(false,id).subscribe(response => {});
  }

}
