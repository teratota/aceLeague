import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SecurityService } from '../service/security.service';
import { Platform } from '@ionic/angular';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  constructor(
    private router:Router,
    public platform: Platform,
    private securityService: SecurityService,
    private userService: UserService,
    private activeRoute: ActivatedRoute,
    private location: Location) { }

  isConnect: boolean = true;
  displayHeader: boolean = true;
  goBackConf: boolean = false;

  ngOnInit() {
    this.router.events.subscribe(event => {
      this.refreshHeader();
      this.goBackConfidentiality();
    });

  }

  getNotif(){
    this.router.navigate(['listCommunication']);
  }

  refreshHeader(){
    this.userService.testConnection().subscribe(response => {
      if(response == true){
        this.isConnect = true;
      }
    },err => {
      if(err.error.error == "wrong token"){
        this.isConnect = false;
      }
    });
  }

  goBackConfidentiality() {
    const location = this.location.path();

    if (location === '/listSetting') {
      this.goBackConf = true;
    } else {
      this.goBackConf = false;
    }
  }

  goBack(link) {
    console.log(link);
    this.goBackConf = false;
    this.router.navigate([link]);
  }

}
