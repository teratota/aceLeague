import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PublicationService } from 'src/app/service/publication.service';
import { PhotoService } from 'src/app/service/photo.service';
import { ActionSheetController} from '@ionic/angular';
import { ProService } from '../service/pro.service';
import { GroupeService } from '../service/groupe.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-publication',
  templateUrl: './publication.component.html',
  styleUrls: ['./publication.component.scss']
})
export class PublicationComponent implements OnInit {

  slideOpts = {
    initialSlide: 1,
    speed: 400
  };

  publicationForm = new FormGroup({
    description:new FormControl('',[
      Validators.required
    ]) ,    
    pro : new FormControl('',[
    ]) ,   
    groupe : new FormControl('',[
    ]) , 
    param : new FormControl('Moi',[
    ]) ,                                               
  });

  pro: object = {
    id : null,
    nom: null
  }
  proActivated : boolean = false;
  groupe: object = {
    id: null,
    nom: null
  }
  groupeActivated : boolean = false;

  publication : any;

  constructor(private router: Router, private PublicationService: PublicationService, private photoService: PhotoService,  public actionSheetController: ActionSheetController, private ProService : ProService, private GroupeService : GroupeService) { }

  ngOnInit() {}

  photo(){
    this.photoService.addNewToGallery()
  }

  send(){
    console.log(this.photoService.blob)
    console.log(this.photoService.base)
    console.log(this.publicationForm.value)
    if(this.publicationForm.value.param == "Moi"){
      this.PublicationService.uploadPublication(this.photoService.base, this.publicationForm.value).subscribe(response => {
        this.publication = response;
        console.log(this.publication);
        this.router.navigate(['profile']);
      });
    }else if(this.publicationForm.value.param == "Pro"){
      this.PublicationService.uploadPublicationPro(this.photoService.base, this.publicationForm.value).subscribe(response => {
        this.publication = response;
        console.log(this.publication);
     //   this.router.navigate(['pro'], {state: {data:this.publicationForm.value.pro}});
      });
    }else if(this.publicationForm.value.param == "Groupe"){
      this.PublicationService.uploadPlublicationGroupe(this.photoService.base, this.publicationForm.value).subscribe(response => {
        this.publication = response;
        console.log(this.publication);
     //   this.router.navigate(['groupe'], {state: {data:this.publicationForm.value.groupe}});
      });
    }  
  }

  getList(value){
    console.log('test')
    if(value == 'Groupe'){
      this.GroupeService.groupe2UserGetList().subscribe(response => {
        this.groupe = response;
        this.groupeActivated = true;
        this.proActivated = false;
        console.log(this.groupe);
        return this.groupe;
      });
    }else if(value == 'Pro'){
      this.ProService.getListMe().subscribe(response => {
        this.pro = response;
        this.proActivated = true;
        this.groupeActivated = false;
        console.log(this.pro);
        return this.pro;
      });
    } else if(value == 'Moi'){
      this.proActivated = false;
      this.groupeActivated = false;
    }
  }

  public async showActionSheet(photo, position) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Photos',
      buttons: [{
        text: 'Delete',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          this.photoService.deletePicture(photo, position);
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {}
      }]
    });
    await actionSheet.present();
  }
}
