import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../service/user.service';
import { Router } from '@angular/router';

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
      Validators.minLength(1),
      Validators.pattern('^[a-zA-Z]+(([ -][a-zA-Z ])?[a-zA-Z]*)*$')
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


  constructor(private UserService: UserService, private router: Router) { }

  ngOnInit() {
    console.log(this.user['username']);
    this.profileForm.setValue({
      username: this.user['username'], bio: this.user['bio'], sport: this.user['sport'], level:this.user['level'], sportDescription:this.user['sportDescription']
    });
  }

  checkData() {
    console.log(this.profileForm.value);
    this.UserService.userUpdate(this.profileForm.value).subscribe(response => {
      this.config = response;
      this.router.navigate(['/profile']);
    });
  }

}
