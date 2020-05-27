import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PublicationService } from '../service/publication.service';
import { ActivatedRoute } from '@angular/router';
import { SecurityService } from '../service/security.service';

@Component({
  selector: 'app-commentaire',
  templateUrl: './commentaire.component.html',
  styleUrls: ['./commentaire.component.scss'],
})
export class CommentaireComponent implements OnInit {

  @Input() param: number;

  commentaireFormEdit = new FormGroup({
    message:new FormControl('',[
      Validators.required
    ]),                                                                
  });

  commentaire: object;

  constructor(private PublicationService: PublicationService, private activeRoute: ActivatedRoute ,private securityService: SecurityService) { }

  ngOnInit() {
    this.activeRoute.params.subscribe(routeParams => {
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

  getCommentaire
  checkData(){
    this.PublicationService.addCommentaire(this.param,this.commentaireFormEdit.value).subscribe(response => {
      this.getData();
    },err => {
      if(err.error.error == "wrong token"){
        this.securityService.presentToast()
      }
    });
  }
}
