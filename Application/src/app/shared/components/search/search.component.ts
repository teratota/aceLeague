import { Component, OnInit } from '@angular/core';
import { UserService } from '../../service/user.service';
import { GroupeService } from '../../service/groupe.service';
import { ProService } from '../../service/pro.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  config: any;
  constructor(private UserService: UserService, private GroupeService: GroupeService, private ProService: ProService) { }

  ngOnInit() {
  }

  search(event) {
    this.GroupeService.getlist(event.target.value)
    .subscribe((data: any) => this.config = data);
    this.UserService.getlist(event.target.value)
    .subscribe((data: any) => this.config = data);
    this.ProService.getlist(event.target.value)
    .subscribe((data: any) => this.config = data);
  }
}
