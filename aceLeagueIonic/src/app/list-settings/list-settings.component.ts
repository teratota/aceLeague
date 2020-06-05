import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { SecurityService } from '../service/security.service';

@Component({
  selector: 'app-list-settings',
  templateUrl: './list-settings.component.html',
  styleUrls: ['./list-settings.component.scss'],
})
export class ListSettingsComponent implements OnInit {

  option: any =  '1';

  settingForm = new FormGroup({
    test01: new FormControl('',
    [
      Validators.required
    ]),
  });

  settingStorage: object = {
    firstOption: true,
    secondOption: false,
  };

  constructor(private router: Router, private activeRoute: ActivatedRoute,private securityService: SecurityService) { }

  ngOnInit() {
    this.activeRoute.params.subscribe(routeParams => {
      this.option = history.state.data['option'];
    });
  }

  goBack() {
    this.router.navigate(['settings']);
  }

  validateOptions(event, name) {
  }

}
