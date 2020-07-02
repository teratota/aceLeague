import { Component, OnInit, Input } from '@angular/core';
import { GroupeService } from '../service/groupe.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ActionSheetController, Platform, ModalController } from '@ionic/angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SecurityService } from '../service/security.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-edit-user-groupe',
  templateUrl: './edit-user-groupe.component.html',
  styleUrls: ['./edit-user-groupe.component.scss'],
})
export class EditUserGroupeComponent implements OnInit {

  @Input() data: number;

  editUserform = new FormGroup({
    user: new FormControl('', [
      Validators.required
    ])
  });

  listUser: object;
  listFriend: object;

  constructor(
    private modalCtrl: ModalController,
    private groupeService: GroupeService,
    private router: Router,
    public actionSheetController: ActionSheetController,
    public platform: Platform,
    private activeRoute: ActivatedRoute,
    private securityService: SecurityService,
    private location: Location) {
  }

  ngOnInit() {
    this.activeRoute.params.subscribe(routeParams => {
      this.getData();
    });
  }

  // Recupération des utilisateur qui font parti du groupe
  getData() {
    this.groupeService.groupe2userListUser(this.data).subscribe(response => {
      this.listUser = JSON.parse(this.securityService.decode(response));
      return this.listUser;
    }, err => {
      if (err.error.error === 'wrong token') {
        this.securityService.presentToast();
      }
    });
    this.groupeService.groupe2userFriendListUserIsNot(this.data).subscribe(response => {
      this.listFriend = JSON.parse(this.securityService.decode(response));
      return this.listFriend;
    }, err => {
      if (err.error.error === 'wrong token') {
        this.securityService.presentToast();
      }
    });
  }

  // Envoi du nouvel utilisateur
  checkData() {
      this.groupeService.groupe2UserAdd(this.data, this.editUserform.value.user).subscribe(response => {
        this.getData();
        this.editUserform.patchValue({
          user: ''
        });
      });
  }

  // Suppression de l'utilisateur du groupe
  delete(id) {
    this.groupeService.groupe2userDelete(this.data, id).subscribe(response => {
      this.getData();
    });
  }

  // Fermeture du modal
  public async closeModal() {
    const location = this.location.path();
    if (location === '/groupe') {
      this.router.navigate(['groupeReload'], {state: {data: this.data}});
    } else if (location === '/groupe') {
      this.router.navigate(['groupe'], {state: {data: this.data}});
    }
    await this.modalCtrl.dismiss();
  }
}
