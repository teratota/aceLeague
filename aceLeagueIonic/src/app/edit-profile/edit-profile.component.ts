import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
})
export class EditProfileComponent implements OnInit {

  @Input() user: object;
  @Input() profilPic: any;

  //username: string = this.user.username;
  //bio: string = this.user.bio;


  constructor() { }

  ngOnInit() {
    console.log(this.user['username']);
  }

}
