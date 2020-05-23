import { Component, OnInit } from '@angular/core';
import { PublicationService } from '../service/publication.service';
import { ModalController, ActionSheetController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { getLocaleDateFormat } from '@angular/common';
import { ProService } from '../service/pro.service';
import { EditProComponent } from '../edit-pro/edit-pro.component';
import { UploadPictureComponent } from '../upload-picture/upload-picture.component';

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
    isAuthor: boolean = false;

  ngOnInit() {
    this.activeRoute.params.subscribe(routeParams => {
      this.isAuthor = false;
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

    this.ProService.abonnementUserCheck(this.proId).subscribe(response => {
      if(response == true){
        console.log(response)
        this.isJoin = true;
        this.isNotJoin = false;
      }
    });

    this.ProService.checkProAuthor(this.proId).subscribe(response => {
      if(response == true){
        this.isAuthor = true;
      }else{
        this.isAuthor = false;
      }
      return this.isAuthor;
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

  async editingPro() {
    const modal = await this.modalController.create({
      component: EditProComponent,
      componentProps: {
        'data': this.proId,
        'profilPic': 'noOneForMoment',
      }
    });
    return await modal.present();
  }

  async editingProImage() {
    const modal = await this.modalController.create({
      component: UploadPictureComponent,
      componentProps: {
        'param': 'pro',
        'data': this.proId,
        'profilPic': 'noOneForMoment',
      }
    });
    return await modal.present();
  }

  async choiceAction() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Modification',
      buttons: [{
        text: 'Modifié profil du Pro',
        icon: 'create-outline',
        handler: () => {
          this.editingPro();
        }
      }, {
        text: "Modifié l'image de profil du Pro",
        icon: 'create-outline',
        handler: () => {
          this.editingProImage();
        }
      }
    ]
    });
    await actionSheet.present();
  }

  dismissModal() {
    if (this.modalController) {
      this.modalController.dismiss().then(() => { this.modalController = null; });
    }
  }

  publicationDislike(id){
    this.PublicationService.dislikePublication(id).subscribe(response => {
      this.PublicationService.getProPublication(this.proId).subscribe(response => {
      this.publication = response;
      console.log(this.publication);
      return this.publication;
    });
    });
  }

  publicationLike(id){
    this.PublicationService.likePublication(id).subscribe(response => {
      this.PublicationService.getProPublication(this.proId).subscribe(response => {
        this.publication = response;
        console.log(this.publication);
        return this.publication;
      });
    });
  }
}
