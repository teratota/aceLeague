import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {

  // Displaying
  displayNavbar: boolean = true;

  constructor(private router:Router, public platform: Platform) { }

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
  publication(){
    this.router.navigate(['publication'])
  }
  search(){
    this.router.navigate(['search'])
  }
  home(){
    this.router.navigate(['newsfeed'])
  }
}
