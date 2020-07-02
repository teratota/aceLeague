import { Component, OnInit, Input, ViewChild, AfterViewChecked } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PublicationService } from '../service/publication.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SecurityService } from '../service/security.service';
import { ModalController, IonContent } from '@ionic/angular';
import { Location } from '@angular/common';

@Component({
  selector: 'app-commentaire',
  templateUrl: './commentaire.component.html',
  styleUrls: ['./commentaire.component.scss'],
})
export class CommentaireComponent implements OnInit, AfterViewChecked {

  @ViewChild(IonContent, {read: IonContent, static: true}) content: IonContent;
  @Input() param: number;
  @Input() data: number;

  commentaireFormEdit = new FormGroup({
    message: new FormControl('', [
      Validators.required
    ]),
  });

  commentaire: object;

  constructor(
    private router: Router,
    private publicationService: PublicationService,
    private activeRoute: ActivatedRoute,
    private securityService: SecurityService,
    private modalCtrl: ModalController,
    private location: Location) { }

  ngOnInit() {
    this.activeRoute.params.subscribe(routeParams => {
      this.getData();
    });
  }

  // Descnedre en bas de page
  ScrollToBottom() {
    this.content.scrollToBottom(0);
  }

  // Descendre en bas de page apres son chargement
  ngAfterViewChecked()	{
    this.ScrollToBottom();
  }

  // Recuperation des commentaires
  getData() {
    this.publicationService.getCommentaire(this.param).subscribe(response => {
      this.commentaire = JSON.parse(this.securityService.decode(response));
      return this.commentaire;
    }, err => {
      if (err.error.error === 'wrong token') {
        this.securityService.presentToast();
      }
    });
  }

  // Envoi du commentaire
  checkData() {
    if (this.commentaireFormEdit.value.message !== '') {
      this.publicationService.addCommentaire(this.param, this.commentaireFormEdit.value).subscribe(response => {
        this.getData();
        this.commentaireFormEdit.patchValue({
          message: ''
        });
        this.ScrollToBottom();
      }, err => {
        if (err.error.error === 'wrong token') {
          this.securityService.presentToast();
        }
      });
    }
  }

  // Fermeture modal avec reresh
  public async closeModal() {
    const location = this.location.path();
    if (location === '/profile') {
      this.router.navigate(['profileReload']);
    } else if (location === '/profileReload') {
      this.router.navigate(['profile']);
    }
    if (location === '/groupe') {
      this.router.navigate(['groupeReload'], {state: {data: this.data}});
    } else if (location === '/groupe') {
      this.router.navigate(['groupe'], {state: {data: this.data}});
    }
    if (location === '/pro') {
      this.router.navigate(['proReload'], {state: {data: this.data}});
    } else if (location === '/proReload') {
      this.router.navigate(['pro'], {state: {data: this.data}});
    }
    if (location === '/newsfeed') {
      this.router.navigate(['newsfeedReload']);
    } else if (location === '/newsfeedReload') {
      this.router.navigate(['newsfeed']);
    }
    await this.modalCtrl.dismiss();
  }
}
