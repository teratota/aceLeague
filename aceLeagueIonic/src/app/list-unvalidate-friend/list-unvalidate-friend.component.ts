import { Component, OnInit } from '@angular/core';
import { FriendService } from '../service/friend.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SecurityService } from '../service/security.service';

@Component({
  selector: 'app-list-unvalidate-friend',
  templateUrl: './list-unvalidate-friend.component.html',
  styleUrls: ['./list-unvalidate-friend.component.scss'],
})
export class ListUnvalidateFriendComponent implements OnInit {

  friends: [];
  friendsExist: boolean = false;

  constructor(
    private FriendService: FriendService,
    private activeRoute: ActivatedRoute,
    private securityService: SecurityService,
    private router: Router
    ) { }

  ngOnInit() {
    this.activeRoute.params.subscribe(routeParams => {
      this.refresh();
    },err => {
      if(err.error.error == "wrong token"){
        this.securityService.presentToast()
      }
    });
  }

  accepted(id){
    this.FriendService.ValidateFriend(true,id).subscribe(response => {
      this.refresh();
    }, err => {
      if(err.error.error == "wrong token"){
        this.securityService.presentToast()
      }
    });
  }
  
  refused(id){
    this.FriendService.ValidateFriend(false,id).subscribe(response => {
      this.refresh();
    }, err => {
      if(err.error.error == "wrong token"){
        this.securityService.presentToast()
      }
    });
  }

  refresh() {
    this.FriendService.ListUnvalidateFriend().subscribe(response => {
      this.friends = JSON.parse(this.securityService.decode(response));
      if (this.friends.length === 0) {
        this.friendsExist = true;
      }
      return this.friends
    },err => {
      if(err.error.error == "wrong token"){
        this.securityService.presentToast()
      }
    });
  }

  goToProfil(id) {
    this.router.navigate(['profile'], {state: {data: id}});
  }

}
