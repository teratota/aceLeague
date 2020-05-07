import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

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
    firstOption: true
  };

  constructor(private router: Router, private activeRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activeRoute.params.subscribe(routeParams => {
      console.log(history);
      this.option = history.state.data['option'];
      console.log(this.option);
    });
  }

  goBack() {
    this.router.navigate(['settings']);
  }

  validateOptions(event, name) {
    console.log(event.detail.checked);
    console.log(name);
  }

}
