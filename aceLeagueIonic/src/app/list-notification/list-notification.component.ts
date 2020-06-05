import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SecurityService } from '../service/security.service';

@Component({
  selector: 'app-list-notification',
  templateUrl: './list-notification.component.html',
  styleUrls: ['./list-notification.component.scss'],
})
export class ListNotificationComponent implements OnInit {

  constructor(private router : Router,private securityService: SecurityService) { }

  ngOnInit() {}
  getListChat(){
    this.router.navigate(['listCommunication']);
  }
  getListNotif(){
    this.router.navigate(['/register']);
  }

}
