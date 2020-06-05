import { Component, OnInit, Input } from '@angular/core';
import { ValidationService } from '../service/validation.service';
import { GroupeService } from '../service/groupe.service';
import { Router, ActivatedRoute } from '@angular/router';
import { PhotoService } from '../service/photo.service';
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
    user:new FormControl('',[
      Validators.required
    ])                                                                  
  });

  listUser : object;
  lisFriend: object;

  constructor(private modalCtrl: ModalController, private ValidationService: ValidationService, private GroupeService: GroupeService,private router : Router, private photoService: PhotoService,  public actionSheetController: ActionSheetController, public platform: Platform, private activeRoute: ActivatedRoute,private securityService: SecurityService, private location:Location) {
  }

  ngOnInit() {
    this.activeRoute.params.subscribe(routeParams => {
      this.getData();
    });
  }

  getData(){
    this.GroupeService.groupe2userListUser(this.data).subscribe(response => {
      this.listUser = JSON.parse(this.securityService.decode(response))
      return this.listUser
    },err => {
      if(err.error.error == "wrong token"){
        this.securityService.presentToast()
      }
    });
    this.GroupeService.groupe2userFriendListUserIsNot(this.data).subscribe(response => {
      this.lisFriend = JSON.parse(this.securityService.decode(response))
      return this.lisFriend
    },err => {
      if(err.error.error == "wrong token"){
        this.securityService.presentToast()
      }
    });
  }

  checkData() {
      this.GroupeService.groupe2UserAdd(this.data,this.editUserform.value.user).subscribe(response => {
        this.getData();
        this.editUserform.patchValue({
          user:''
        })
      });
  }

  delete(id){
    this.GroupeService.groupe2userDelete(this.data,id).subscribe(response => {
      this.getData();
    });
  }

  public async closeModal() {
    let location = this.location.path()
    if(location == "/groupe"){
      this.router.navigate(['groupeReload'], {state: {data:this.data}});
    }else if(location == "/groupe"){
      this.router.navigate(['groupe'], {state: {data:this.data}});
    }
    await this.modalCtrl.dismiss();
  }
}
