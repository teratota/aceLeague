import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  key:string = 'cledesecurite';

  constructor(
    private router: Router,
    public toastController: ToastController) { }

  getToken() {
    const token = localStorage.getItem('token');
    if (token) {
        return token;
    } else {
        return null;
    }
  }

  encode(data) {
    const encryptData = CryptoJS.AES.encrypt(data, this.key).toString();
    return encryptData;
  }

  decode(data) {
    const decryptData  = CryptoJS.AES.decrypt(data, this.key).toString(CryptoJS.enc.Utf8);
    return decryptData;
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Votre session a expiré. Veuillez-vous reconnecter',
      duration: 2000,
      position: 'middle'
    });
    toast.present();
    this.router.navigate(['']);
  }
}
