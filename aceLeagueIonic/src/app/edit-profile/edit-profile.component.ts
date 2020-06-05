import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../service/user.service';
import { Router } from '@angular/router';
import { SecurityService } from '../service/security.service';
import { ModalController } from '@ionic/angular';
import { Location } from '@angular/common';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
})
export class EditProfileComponent implements OnInit {

  @Input() user: object;
  @Input() profilPic: any;

  config: any;

  profileForm = new FormGroup({
    username: new FormControl('',
    [
      Validators.required,
      Validators.maxLength(50),
      Validators.minLength(1)
    ]),
    bio: new FormControl('',
    [
      Validators.required
    ]),
    sport: new FormControl('',
    [
      Validators.required
    ]),
    level: new FormControl('',
    [
      Validators.required
    ]),
    sportDescription: new FormControl('',
    [
      Validators.required
    ]),
  });


  constructor(private UserService: UserService, private router: Router,private securityService: SecurityService, private location: Location, private modalCtrl: ModalController) { }

  ngOnInit() {
    this.profileForm.setValue({
      username: this.user['username'], bio: this.user['bio'], sport: this.user['sport'], level:this.user['level'], sportDescription:this.user['sportDescription']
    });
  }

  checkData() {
    this.UserService.userUpdate(this.profileForm.value).subscribe(response => {
      this.config = response;
      let location = this.location.path()
            if(location == "/profile"){
              this.router.navigate(['profileReload']);
            }else{
              this.router.navigate(['profile']);
            }
            this.modalCtrl.dismiss();
    },err => {
      if(err.error.error == "wrong token"){
        this.securityService.presentToast()
      }
    });
  }

  public async closeModal() {
    await this.modalCtrl.dismiss();
  }


}
