import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { HeaderComponent } from '../header/header.component';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  key:string = 'dfsdjklfnkmjv<wxnklmcvnkjlmxnwjkvbkjcnklw<jnbvlkjbnkj<wbxcljhbvcxvkjhxbwnqs<bs<cbljkxwnckxbwvknjkmnvc,n<lkw,cvnxkwcnbvkjnvlwnlùcxnvlw<'
  
  constructor(private router: Router,public toastController: ToastController) { }

  getToken()
  {
    let token = localStorage.getItem('token');
    if (token) {
        return token;
    } else {
        return null;
    }
  }

  encode(data)
  {
    var encryptData = CryptoJS.AES.encrypt(data, this.key).toString();
    return encryptData
  }

  decode(data)
  {
    var decryptData  = CryptoJS.AES.decrypt(data, this.key).toString(CryptoJS.enc.Utf8);
    return decryptData;
  }

  isConnectValid(data){

  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Votre session a expiré. Veuillez-vous reconnecter',
      duration: 2000,
      position: "middle"
    });
    toast.present();
    this.router.navigate(['']);
  }
}
