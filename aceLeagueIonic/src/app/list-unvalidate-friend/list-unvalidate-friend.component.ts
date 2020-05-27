import { Component, OnInit } from '@angular/core';
import { FriendService } from '../service/friend.service';
import { ActivatedRoute } from '@angular/router';
import { SecurityService } from '../service/security.service';

@Component({
  selector: 'app-list-unvalidate-friend',
  templateUrl: './list-unvalidate-friend.component.html',
  styleUrls: ['./list-unvalidate-friend.component.scss'],
})
export class ListUnvalidateFriendComponent implements OnInit {

  friends: object;

  constructor(private FriendService: FriendService, private activeRoute: ActivatedRoute, private securityService: SecurityService) { }

  ngOnInit() {
    this.activeRoute.params.subscribe(routeParams => {
      this.FriendService.ListUnvalidateFriend().subscribe(response => {
        this.friends = JSON.parse(this.securityService.decode(response))
        return this.friends
      },err => {
        if(err.error.error == "wrong token"){
          this.securityService.presentToast()
        }
      });
    },err => {
      if(err.error.error == "wrong token"){
        this.securityService.presentToast()
      }
    });
  }

  accepted(id){
    this.FriendService.ValidateFriend(true,id).subscribe(response => {},err => {
      if(err.error.error == "wrong token"){
        this.securityService.presentToast()
      }
    });
  }
  
  refused(id){
    this.FriendService.ValidateFriend(false,id).subscribe(response => {},err => {
      if(err.error.error == "wrong token"){
        this.securityService.presentToast()
      }
    });
  }

}
