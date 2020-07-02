import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/service/user.service';
import { GroupeService } from 'src/app/service/groupe.service';
import { ProService } from 'src/app/service/pro.service';
import { Router } from '@angular/router';
import { SecurityService } from '../service/security.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {

  config: any;
  users: object;
  groupes: object;
  pros: object;

  constructor(
    private userService: UserService,
    private groupeService: GroupeService,
    private proService: ProService,
    private router: Router,
    private securityService: SecurityService) { }

  ngOnInit() {
  }

  search(event) {
    if (event.target.value !== '') {
      this.groupeService.getlist(event.target.value)
      .subscribe(response => {
        this.groupes = JSON.parse(this.securityService.decode(response));
        return this.groupes;
      }, err => {
        if (err.error.error === 'wrong token') {
          this.securityService.presentToast();
        }
      });
      this.userService.getlist(event.target.value)
      .subscribe(response => {
        this.users = JSON.parse(this.securityService.decode(response));
        return this.users;
      }, err => {
        if (err.error.error === 'wrong token') {
          this.securityService.presentToast();
        }
      });
      this.proService.getlist(event.target.value)
      .subscribe(response => {
        this.pros = JSON.parse(this.securityService.decode(response));
        return this.pros;
      }, err => {
        if (err.error.error === 'wrong token') {
          this.securityService.presentToast();
        }
      });
    }

  }

  goToPro(idPro) {
    this.router.navigate(['pro'], {state: {data: idPro}});
  }

  goToGroupe(idGroupe) {
    this.router.navigate(['groupe'], {state: {data: idGroupe}});
  }

  goToUser(idUser) {
    this.router.navigate(['profile'], {state: {data: idUser}});
  }
}
