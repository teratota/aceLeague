import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SecurityService } from './security.service';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';

@Injectable({
  providedIn: 'root'
})
export class PublicationService {

  constructor(private http: HttpClient, private securityService: SecurityService) { }

  configUrl = 'http://localhost:4444/api/';

  getPublications(user) {
    let token = this.securityService.getToken();
    return this.http.post(this.configUrl+"publication/me/",{user:user,token: token});
  }

  uploadPublication(file,form){
    let token = this.securityService.getToken();
    return this.http.post(this.configUrl+"publication/upload/",{file: file, form: form, token: token});
  }

  uploadPublicationPro(file,form){
    let token = this.securityService.getToken();
    return this.http.post(this.configUrl+"publication/upload/pro/",{file: file, form: form, token: token});
  }

  uploadPlublicationGroupe(file,form){
    let token = this.securityService.getToken();
    return this.http.post(this.configUrl+"publication/upload/groupe",{file: file, form: form, token: token});
  }

  getAllPublications() {
    let token = this.securityService.getToken();
    return this.http.post(this.configUrl+"publication/all-publication", {token: token})
  }

  getUserPublications(id) {
    let token = this.securityService.getToken();
    return this.http.post(this.configUrl+"publication/user", {token: token, user: id})
  }

  getProPublication(id) {
    let token = this.securityService.getToken();
    return this.http.post(this.configUrl+"publication/pro", {token: token, pro: id})
  }

  getGroupePublication(id) {
    let token = this.securityService.getToken();
    return this.http.post(this.configUrl+"publication/groupe", {token: token, groupe: id})
  }
}
