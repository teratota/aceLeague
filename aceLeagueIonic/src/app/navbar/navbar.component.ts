import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit() {
    
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
