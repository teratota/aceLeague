import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PublicationService } from '../service/publication.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SecurityService } from '../service/security.service';
import { ModalController } from '@ionic/angular';
import { Location } from '@angular/common';

@Component({
  selector: 'app-commentaire',
  templateUrl: './commentaire.component.html',
  styleUrls: ['./commentaire.component.scss'],
})
export class CommentaireComponent implements OnInit {

  @Input() param: number;
  @Input() data: number;

  commentaireFormEdit = new FormGroup({
    message:new FormControl('',[
      Validators.required
    ]),                                                                
  });

  commentaire: object;

  constructor(private router : Router,private PublicationService: PublicationService, private activeRoute: ActivatedRoute ,private securityService: SecurityService, private modalCtrl: ModalController, private location: Location) { }

  ngOnInit() {
    this.activeRoute.params.subscribe(routeParams => {
      console.log(this.data)
      this.getData();
    });
  }

  getData(){
    this.PublicationService.getCommentaire(this.param).subscribe(response => {
      this.commentaire = JSON.parse(this.securityService.decode(response))
      return this.commentaire
    },err => {
      if(err.error.error == "wrong token"){
        this.securityService.presentToast()
      }
    });
  }

  checkData(){
    this.PublicationService.addCommentaire(this.param,this.commentaireFormEdit.value).subscribe(response => {
      this.getData();
    },err => {
      if(err.error.error == "wrong token"){
        this.securityService.presentToast()
      }
    });
  }

  public async closeModal() {
    let location = this.location.path()
    console.log(location)
    console.log(this.data)
    if(location == "/profile"){
      this.router.navigate(['profileReload']);
    }else if(location == "/profileReload"){
      this.router.navigate(['profile']);
    }
    if(location == "/groupe"){
      this.router.navigate(['groupeReload'], {state: {data:this.data}});
    }else if(location == "/groupe"){
      this.router.navigate(['groupe'], {state: {data:this.data}});
    }
    if(location == "/pro"){
      this.router.navigate(['proReload'], {state: {data:this.data}});
    }else if(location == "/proReload"){
      this.router.navigate(['pro'], {state: {data:this.data}});
    }
    if(location == "/newsfeed"){
      this.router.navigate(['newsfeedReload']);
    }else if(location == "/newsfeedReload"){
      this.router.navigate(['newsfeed']);
    }
    await this.modalCtrl.dismiss();
  }


  
}
