import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Platform, ModalController } from '@ionic/angular';
import { SecurityService } from '../service/security.service';
import { UserService } from '../service/user.service';
import { PublicationComponent } from './../publication/publication.component';
import { Location } from '@angular/common';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {

  currentModal: any;
  displayNavbar: boolean = true;
  isConnect: boolean = true;

  constructor(
    private router: Router,
    public platform: Platform,
    private userService: UserService,
    private activeRoute: ActivatedRoute,
    private modalController: ModalController,
    private location: Location) { }

  ngOnInit() {
    this.router.events.subscribe(event => {
      this.refreshNavbar();
      const platform = this.platform.platforms();
      if (platform[0] === 'electron') {
        this.displayNavbar = false;
      } else {
        this.displayNavbar = true;
      }
    });
  }

  // Aller sur la page profil
  profil() {
    const location = this.location.path();
    if (location === '/profile') {
      this.router.navigate(['profileReload']);
    } else if (location === '/profileReload') {
      this.router.navigate(['profile']);
    } else {
      this.router.navigate(['profile']);
    }
  }

  // Ouvrir le modal popup
  async publication() {
    const modal = await this.modalController.create({
      component: PublicationComponent
    });
    await modal.present();
    this.currentModal = modal;
  }

  // Aller a la page recherche
  search() {
    this.router.navigate(['search']);
  }

  // Aller a la page fil d'actualité
  home() {
    this.router.navigate(['newsfeed']);
  }

  // Rafraichir navbar
  refreshNavbar() {
    this.activeRoute.params.subscribe(routeParams => {
      this.userService.testConnection().subscribe(response => {
        if (response === true) {
          this.isConnect = true;
        }
      }, err => {
        if (err.error.error === 'wrong token') {
          this.isConnect = false;
        }
      });
    });
  }
}
