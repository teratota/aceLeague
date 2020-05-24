import { Component, OnInit, Input } from '@angular/core';
import { ValidationService } from '../service/validation.service';
import { GroupeService } from '../service/groupe.service';
import { Router, ActivatedRoute } from '@angular/router';
import { PhotoService } from '../service/photo.service';
import { ActionSheetController, Platform, ModalController } from '@ionic/angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';

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

  constructor(private modalCtrl: ModalController, private ValidationService: ValidationService, private GroupeService: GroupeService,private router : Router, private photoService: PhotoService,  public actionSheetController: ActionSheetController, public platform: Platform, private activeRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.activeRoute.params.subscribe(routeParams => {
      this.getData();
    });
  }

  getData(){
    this.GroupeService.groupe2userListUser(this.data).subscribe(response => {
      this.listUser = response
      console.log(this.listUser);
      return this.listUser
    });
    this.GroupeService.groupe2userFriendListUserIsNot(this.data).subscribe(response => {
      this.lisFriend = response
      console.log(this.lisFriend);
      return this.lisFriend
    });
  }

  checkData() {
    console.log(this.editUserform.value)
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
    await this.modalCtrl.dismiss();
  }
}
