import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PublicationService } from '../service/publication.service';
import { ActivatedRoute } from '@angular/router';

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

  constructor(private PublicationService: PublicationService, private activeRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activeRoute.params.subscribe(routeParams => {
      this.PublicationService.getCommentaire(this.param).subscribe(response => {
        this.commentaire = response
        console.log(this.commentaire)
        return this.commentaire
      });
    });
  }
  getCommentaire
  checkData(){
    this.PublicationService.addCommentaire(this.param,this.commentaireFormEdit.value).subscribe(response => {
      this.PublicationService.getCommentaire(this.param).subscribe(response => {
        this.commentaire = response
        console.log(this.commentaire)
        return this.commentaire
      });
    });
  }
}
