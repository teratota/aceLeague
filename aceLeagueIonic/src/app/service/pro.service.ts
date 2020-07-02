import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SecurityService } from './security.service';
import { api_path } from '../includes/api_path.js';

@Injectable({
  providedIn: 'root'
})
export class ProService {

  configUrl = api_path;
  constructor(private http: HttpClient, private securityService: SecurityService) { }

  getlist(value) {
    const token = this.securityService.getToken();
    value = this.securityService.encode(JSON.stringify(value));
    return this.http.post(this.configUrl + 'pro/getlist', {data: value, token});
  }

  getListMe() {
    const token = this.securityService.getToken();
    return this.http.post(this.configUrl + 'pro/getlist/me', {token});
  }

  newPro(form, file) {
    const token = this.securityService.getToken();
    form = this.securityService.encode(JSON.stringify(form));
    file = this.securityService.encode(JSON.stringify(file));
    return this.http.post(this.configUrl + 'pro/add', {form, file, token});
  }

  deletePro(pro) {
    const token = this.securityService.getToken();
    pro = this.securityService.encode(JSON.stringify(pro));
    return this.http.post(this.configUrl + 'pro/delete', {pro, token});
  }

  updatePro(form, pro) {
    const token = this.securityService.getToken();
    form = this.securityService.encode(JSON.stringify(form));
    pro = this.securityService.encode(JSON.stringify(pro));
    return this.http.post(this.configUrl + 'pro/update', {form, pro, token});
  }

  updateProImage(pro, file) {
    const token = this.securityService.getToken();
    pro = this.securityService.encode(JSON.stringify(pro));
    file = this.securityService.encode(JSON.stringify(file));
    return this.http.post(this.configUrl + 'pro/update/image', {pro, file, token});
  }

  getInfoPro(pro) {
    const token = this.securityService.getToken();
    pro = this.securityService.encode(JSON.stringify(pro));
    return this.http.post(this.configUrl + 'pro/get', {pro, token});
  }

  getNumberAbonnement(pro) {
    const token = this.securityService.getToken();
    pro = this.securityService.encode(JSON.stringify(pro));
    return this.http.post(this.configUrl + 'pro/number/abonnement', {pro, token});
  }

  getNumberAbonnementUser(user) {
    const token = this.securityService.getToken();
    user = this.securityService.encode(JSON.stringify(user));
    return this.http.post(this.configUrl + 'pro/number/abonnement/me', {user, token});
  }

  abonnementUserCheck(pro) {
    const token = this.securityService.getToken();
    pro = this.securityService.encode(JSON.stringify(pro));
    return this.http.post(this.configUrl + 'pro/check/abonnement', {pro, token});
  }

  abonnementUserAdd(pro) {
    const token = this.securityService.getToken();
    pro = this.securityService.encode(JSON.stringify(pro));
    return this.http.post(this.configUrl + 'pro/add/abonnement', {pro, token});
  }

  checkProAuthor(pro) {
    const token = this.securityService.getToken();
    pro = this.securityService.encode(JSON.stringify(pro));
    return this.http.post(this.configUrl + 'pro/check/author', {pro, token});
  }
}
