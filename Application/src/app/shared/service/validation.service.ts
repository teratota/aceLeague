import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  constructor() { }

  // verifuserconnection(token) {
  //   let result: any;
  //   $.ajax({
  //     type: 'POST',
  //     url: 'http://localhost:8000/token/verifconnectionuser',
  //     dataType: 'json',
  //     data: {
  //       token: token
  //     },
  //     async: false,
  //     success(data) {
  //         result = data;
  //     }
  // });
  //   return result;
  // }

  // verifadminconnection(token) {
  //   let result: any;
  //   $.ajax({
  //     type: 'POST',
  //     url: 'http://localhost:8000/token/verifconnectionadmin',
  //     dataType: 'json',
  //     data: {
  //       token: token
  //     },
  //     async: false,
  //     success(data) {
  //         result = data;
  //     }
  // });
  //   return result;
  // }

  getCookie(nameCookie) {
    var oRegex = new RegExp("(?:; )?" + nameCookie + "=([^;]*);?");
 
    if (oRegex.test(document.cookie)) {
        return decodeURIComponent(RegExp["$1"]);
    } else {
        return null;
    }
  }

  // deleteCookie(cookie) {
  //   let result: any;
  //   $.ajax({
  //     type: 'POST',
  //     url: 'http://localhost:8000/token/deleteCookie',
  //     dataType: 'json',
  //     data: {
  //       cookie: cookie
  //     },
  //     async: false,
  //     success(data) {
  //         result = data;
  //     }
  // });
  //   return result;
  // }

  validationEmail(email)
  {
  //   let result: any;
  //   $.ajax({
  //     type: 'POST',
  //     url: 'http://localhost:8000/user/validationEmail',
  //     dataType: 'json',
  //     data: {
  //       email: email
  //     },
  //     async: false,
  //     success(data) {
  //         result = data;
  //     }
  // });
    return true;
  }
  validationChaine(chaine)
  {
    
  }
  validationDate()
  {

  }
  validationPassword(password){
    var passw=  /^[A-Za-z]\w{7,15}$/;
    if(password.match(passw)) 
    { 
    return true;
    }
    else
    { 
    return false;
    }
  }
  validationIdentiquePassword(password1,password2){
    if(password1 === password2){
      return true;
    }else{
      return false;
    }
  }
}
