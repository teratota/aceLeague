import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {}

  // Changer de page
  changeSetting(option) {
    this.router.navigate(['listSetting'], {state: {data: {option}}});
  }

}
