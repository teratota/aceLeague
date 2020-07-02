import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  constructor() { }

  validationEmail(email) {
    return true;
  }

  validationIdentiquePassword(password1, password2) {
    if (password1 === password2) {
      return true;
    } else {
      return false;
    }
  }
}
