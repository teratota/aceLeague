import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {
  tokenName:string = 'tokenValidation'
  
  constructor() { }

  getToken()
  {
    var oRegex = new RegExp("(?:; )?" + this.tokenName + "=([^;]*);?");
    if (oRegex.test(document.cookie)) {
        return decodeURIComponent(RegExp["$1"]);
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
