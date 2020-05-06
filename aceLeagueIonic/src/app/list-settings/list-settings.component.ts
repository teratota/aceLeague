import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-list-settings',
  templateUrl: './list-settings.component.html',
  styleUrls: ['./list-settings.component.scss'],
})
export class ListSettingsComponent implements OnInit {

  option: any =  '1';

  constructor() { }

  ngOnInit() {
    console.log(history);
    this.option = history.state.data['option'];
    console.log(this.option);
  }

}
