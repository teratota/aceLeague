import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  constructor(
    private router: Router,
    public platform: Platform,
    private userService: UserService,
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

  // Aller a la page du chat
  goToChat() {
    this.router.navigate(['listCommunication']);
  }

  // Rafraichissement du header
  refreshHeader() {
    this.userService.testConnection().subscribe(response => {
      if (response === true) {
        this.isConnect = true;
      }
    }, err => {
      if (err.error.error === 'wrong token') {
        this.isConnect = false;
      }
    });
  }

  // Affichage du bouton dans la page parametres profil
  goBackConfidentiality() {
    const location = this.location.path();
    if (location === '/listSetting') {
      this.goBackConf = true;
    } else {
      this.goBackConf = false;
    }
  }

  // Masquage du bouton retour dans les autres pages
  goBack(link) {
    this.goBackConf = false;
    this.router.navigate([link]);
  }

}
