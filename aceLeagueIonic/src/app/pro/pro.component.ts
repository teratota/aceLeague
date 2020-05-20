import { Component, OnInit } from '@angular/core';
import { PublicationService } from '../service/publication.service';
import { ModalController, ActionSheetController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { getLocaleDateFormat } from '@angular/common';
import { ProService } from '../service/pro.service';

@Component({
  selector: 'app-pro',
  templateUrl: './pro.component.html',
  styleUrls: ['./pro.component.scss'],
})
export class ProComponent implements OnInit {

  constructor(
    private PublicationService: PublicationService,
    public modalController: ModalController,
    private ProService: ProService,
    public actionSheetController: ActionSheetController,
    private router: Router,
    private activeRoute: ActivatedRoute
    ) { }

    pro:object = {
      nom:'',
      image:'',
    };

    isJoin: boolean = false;
    isNotJoin: boolean = true;
    publication:object;
    abonnement:number;
    proId:number;

  ngOnInit() {
    this.activeRoute.params.subscribe(routeParams => {
      this.proId = history.state.data;
      this.getData();
    });
  }
  

  getData(){
    this.ProService.getInfoPro(this.proId).subscribe(response => {
      this.pro = response[0];
      console.log(this.pro);
      return this.pro;
    });

    this.ProService.getNumberAbonnement(this.proId).subscribe(response => {
      this.abonnement = response[0]['COUNT(*)'];
      console.log(this.abonnement);
      return this.abonnement;
    });
    
    this.PublicationService.getProPublication(this.proId).subscribe(response => {
      this.publication = response;
      console.log(this.publication);
      return this.publication;
    });

    this.ProService.abonnementUserCheck(this.proId).subscribe(response => {
      if(response == true){
        console.log(response)
        this.isJoin = true;
        this.isNotJoin = false;
      }
    });
  }

  joinPro(){
    this.ProService.abonnementUserAdd(this.proId).subscribe(response => {
      if(response == true){
        this.isJoin = true;
        this.isNotJoin = false;
        this.ProService.getNumberAbonnement(this.proId).subscribe(response => {
          this.abonnement = response[0]['COUNT(*)'];
          console.log(this.abonnement);
          return this.abonnement;
        });
      }
    });
  }

}
