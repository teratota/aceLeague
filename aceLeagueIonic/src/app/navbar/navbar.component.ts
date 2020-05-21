import { PublicationComponent } from './../publication/publication.component';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Platform, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {

  // Displaying
  displayNavbar: boolean = true;

  // Modal
  currentModal = null;

  constructor(private router:Router, public platform: Platform, public modalController: ModalController) { }

  ngOnInit() {
    let platform = this.platform.platforms();
    if (platform[0] === 'electron') {
      this.displayNavbar = false;
    }
    else {
      this.displayNavbar = true;
    }

  }
  profil(){
    this.router.navigate(['profile'])
  }
  async publication(){
    const modal = await this.modalController.create({
      component: PublicationComponent
    });
    await modal.present();
    this.currentModal = modal;
  }
  search(){
    this.router.navigate(['search'])
  }
  home(){
    this.router.navigate(['newsfeed'])
  }

  // Dimiss modal
  dismissModal() {
    if (this.currentModal) {
      this.currentModal.dismiss().then(() => { this.currentModal = null; });
    }
  }
}
