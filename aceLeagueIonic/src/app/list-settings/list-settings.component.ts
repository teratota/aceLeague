import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-list-settings',
  templateUrl: './list-settings.component.html',
  styleUrls: ['./list-settings.component.scss'],
})
export class ListSettingsComponent implements OnInit {

  option: string = '1';

  settingStorage: object = {
    firstOption: true,
    secondOption: false,
  };

  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activeRoute.params.subscribe(routeParams => {
      this.option = history.state.data['option'];
    });
  }

  // Retour arriere
  goBack() {
    this.router.navigate(['settings']);
  }

}
