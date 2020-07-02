import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UserService } from 'src/app/service/user.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SecurityService } from '../service/security.service';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  config: any;

  constructor(
    private userService: UserService,
    private router: Router,
    private securityService: SecurityService,
    private navBarComponent: NavbarComponent,
    private activeRoute: ActivatedRoute) { }

  messageMail: boolean;
  messagePass: boolean;
  nickname: string = '';

  loginForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email,
      Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
    ]),
    password: new FormControl('', [
      Validators.required
    ])
  });

  chatForm = new FormGroup({
    name: new FormControl('', [
      Validators.required
    ]),
    room: new FormControl('', [
      Validators.required
    ])
  });

  ngOnInit() {
    this.activeRoute.params.subscribe(routeParams => {
      this.userService.testConnection().subscribe(response => {
        if (response === true) {
          this.router.navigate(['/profile']);
        }
      }, err => {
      });
      this.navBarComponent.refreshNavbar();
      this.messageMail = false;
      this.messagePass = false;
    });
  }

  // connexion
  connection() {
    this.userService.connection(this.loginForm.value)
    .subscribe(response => {
      this.config = response;
      this.config.token = this.securityService.encode(this.config.token);
      localStorage.setItem('token', this.config.token);
      this.navBarComponent.refreshNavbar();
      this.router.navigate(['/profile']);
      return this.config;
    }, err => {
    });
  }

  // Aller a la page inscription
  register() {
    this.router.navigate(['/register']);
  }
}
