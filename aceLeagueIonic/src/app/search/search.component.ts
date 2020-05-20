import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/service/user.service';
import { GroupeService } from 'src/app/service/groupe.service';
import { ProService } from 'src/app/service/pro.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {

  config: any;
  users: object; 
  groupes: object; 
  pros: object;

  constructor(private UserService: UserService, private GroupeService: GroupeService, private ProService: ProService, private router : Router) { }

  ngOnInit() {
  }

  search(event) {
    this.GroupeService.getlist(event.target.value)
    .subscribe(response => {
      this.groupes = response;
      console.log(this.groupes);
      return this.groupes;
    });
    this.UserService.getlist(event.target.value)
    .subscribe(response => {
      this.users = response;
      console.log(this.users);
      return this.users;
    });
    this.ProService.getlist(event.target.value)
    .subscribe(response => {
      this.pros = response;
      console.log(this.pros);
      return this.pros;
    });
  }

  goToPro(idPro){
    this.router.navigate(['pro'],{state: {data: idPro}});
  }

  goToGroupe(idGroupe){
    this.router.navigate(['groupe'],{state: {data: idGroupe}});
  }

  goToUser(idUser){
    this.router.navigate(['profile'],{state: {data: idUser}});
  }
}
