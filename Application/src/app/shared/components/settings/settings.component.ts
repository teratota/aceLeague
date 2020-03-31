import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  isShown: boolean = false ; // hidden by default
  pageBasic: boolean = true ; // displayed by default

  affichage: string;

  defaultDisplay() {
    this.isShown = false
    this.pageBasic = true
  }

  toggleShow(div) {
    this.isShown = ! this.isShown;
    this.pageBasic = ! this.pageBasic;
    this.affichage = div;
  }

}
