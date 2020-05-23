import { Component, OnInit } from '@angular/core';
import { PublicationService } from '../service/publication.service';
import { ModalController, ActionSheetController } from '@ionic/angular';
import { ProService } from '../service/pro.service';
import { Router, ActivatedRoute } from '@angular/router';
import { GroupeService } from '../service/groupe.service';
import { EditGroupeComponent } from '../edit-groupe/edit-groupe.component';
import { UploadPictureComponent } from '../upload-picture/upload-picture.component';

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
    isAuthor: boolean = false;

  ngOnInit() {
    this.activeRoute.params.subscribe(routeParams => {
      this.isAuthor = false;
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

    this.GroupeService.groupeCheckAuthor(this.groupeId).subscribe(response => {
      if(response == true){
        this.isAuthor = true;
      }else{
        this.isAuthor = false;
      }
      return this.isAuthor;
    });
    
  }

  joinGroupe(){
    this.GroupeService.groupe2UserAdd(this.groupeId).subscribe(response => {
      if(response == true){
        this.isJoin = true;
        this.isNotJoin =false;
        this.GroupeService.groupe2userNumberUser(this.groupeId).subscribe(response => {
          this.abonnement = response[0]['COUNT(*)'];
          console.log(this.abonnement);
          return this.abonnement;
        });
      }
    });
  }

  async editingPro() {
    const modal = await this.modalController.create({
      component: EditGroupeComponent,
      componentProps: {
        'data': this.groupeId,
        'profilPic': 'noOneForMoment',
      }
    });
    return await modal.present();
  }

  async editingProImage() {
    const modal = await this.modalController.create({
      component: UploadPictureComponent,
      componentProps: {
        'param': 'groupe',
        'data': this.groupeId,
        'profilPic': 'noOneForMoment',
      }
    });
    return await modal.present();
  }

  async choiceAction() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Modification',
      buttons: [{
        text: 'Modifié profil du Groupe',
        icon: 'create-outline',
        handler: () => {
          this.editingPro();
        }
      }, {
        text: "Modifié l'image de profil du Groupe",
        icon: 'create-outline',
        handler: () => {
          this.editingProImage();
        }
      }
    ]
    });
    await actionSheet.present();
  }

  publicationDislike(id){
    this.PublicationService.dislikePublication(id).subscribe(response => {
      this.PublicationService.getGroupePublication(this.groupeId).subscribe(response => {
        this.publication = response;
        console.log(this.publication);
        return this.publication;
      });
    });
  }

  publicationLike(id){
    this.PublicationService.likePublication(id).subscribe(response => {
      this.PublicationService.getGroupePublication(this.groupeId).subscribe(response => {
        this.publication = response;
        console.log(this.publication);
        return this.publication;
      });
    });
  }

}
