import { Component, OnInit } from '@angular/core';
import { PublicationService } from '../service/publication.service';
import { ModalController, ActionSheetController } from '@ionic/angular';
import { ProService } from '../service/pro.service';
import { Router, ActivatedRoute } from '@angular/router';
import { GroupeService } from '../service/groupe.service';

@Component({
  selector: 'app-groupe',
  templateUrl: './groupe.component.html',
  styleUrls: ['./groupe.component.scss'],
})
export class GroupeComponent implements OnInit {

  constructor(
    private PublicationService: PublicationService,
    public modalController: ModalController,
    private GroupeService: GroupeService,
    public actionSheetController: ActionSheetController,
    private router: Router,
    private activeRoute: ActivatedRoute
    ) { }

    groupe:object = {
      nom:'',
      image:'',
    };
    isJoin: boolean = false;
    isNotJoin: boolean = true;
    publication:object;
    abonnement:number;
    groupeId:number;

  ngOnInit() {
    this.activeRoute.params.subscribe(routeParams => {
      this.groupeId = history.state.data;
      this.getData();
    });
  }
  

  getData(){
    this.GroupeService.getGroupeInfo(this.groupeId).subscribe(response => {
      this.groupe = response[0];
      console.log(this.groupe);
      return this.groupe;
    });

    this.GroupeService.groupe2userNumberUser(this.groupeId).subscribe(response => {
      this.abonnement = response[0]['COUNT(*)'];
      console.log(this.abonnement);
      return this.abonnement;
    });
    
    this.PublicationService.getGroupePublication(this.groupeId).subscribe(response => {
      this.publication = response;
      console.log(this.publication);
      return this.publication;
    });

    this.GroupeService.groupe2UserCheck(this.groupeId).subscribe(response => {
      if(response == true){
        this.isJoin = true;
        this.isNotJoin =false;
      }
    });
    
  }

  joinGroupe(){
    this.GroupeService.groupe2UserAdd(this.groupeId).subscribe(response => {
      if(response == true){
        this.isJoin = true;
        this.isNotJoin =false;
      }
    });
  }

}
