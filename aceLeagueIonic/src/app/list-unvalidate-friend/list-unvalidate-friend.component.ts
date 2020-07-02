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
    private friendService: FriendService,
    private activeRoute: ActivatedRoute,
    private securityService: SecurityService,
    private router: Router
    ) { }

  ngOnInit() {
    this.activeRoute.params.subscribe(routeParams => {
      this.refresh();
    }, err => {
      if (err.error.error === 'wrong token') {
        this.securityService.presentToast();
      }
    });
  }

  // Accepter ami
  accepted(id) {
    this.friendService.ValidateFriend(true, id).subscribe(response => {
      this.refresh();
    }, err => {
      if (err.error.error === 'wrong token') {
        this.securityService.presentToast();
      }
    });
  }

  // Refuser ami
  refused(id) {
    this.friendService.ValidateFriend(false, id).subscribe(response => {
      this.refresh();
    }, err => {
      if (err.error.error === 'wrong token') {
        this.securityService.presentToast();
      }
    });
  }

  // Rafraichir la page
  refresh() {
    this.friendService.ListUnvalidateFriend().subscribe(response => {
      this.friends = JSON.parse(this.securityService.decode(response));
      if (this.friends.length === 0) {
        this.friendsExist = true;
      }
      return this.friends;
    }, err => {
      if (err.error.error === 'wrong token') {
        this.securityService.presentToast();
      }
    });
  }

  // Aller dans le profil la personne
  goToProfil(id) {
    this.router.navigate(['profile'], {state: {data: id}});
  }

}
