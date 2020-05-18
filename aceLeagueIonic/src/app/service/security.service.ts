import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  tokenName:string = 'tokenValidation'
  
  constructor() { }

  getToken()
  {
    let token = localStorage.getItem('token');
    if (token) {
        return token;
    } else {
        return null;
    }
  }

  encode()
  {

  }

  decode()
  {

  }
}
