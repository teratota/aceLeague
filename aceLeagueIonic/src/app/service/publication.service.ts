import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SecurityService } from './security.service';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';
import { api_path } from '../includes/api_path.js';

@Injectable({
  providedIn: 'root'
})
export class PublicationService {

  constructor(private http: HttpClient, private securityService: SecurityService) { }

  configUrl = api_path;

  getPublications(user) {
    let token = this.securityService.getToken();
    user = this.securityService.encode(JSON.stringify(user))
    return this.http.post(this.configUrl+"publication/me/",{user:user,token: token});
  }

  uploadPublication(file,form){
    let token = this.securityService.getToken();
    file = this.securityService.encode(JSON.stringify(file))
    form = this.securityService.encode(JSON.stringify(form))
    return this.http.post(this.configUrl+"publication/upload/",{file: file, form: form, token: token});
  }

  uploadPublicationPro(file,form){
    let token = this.securityService.getToken();
    file = this.securityService.encode(JSON.stringify(file))
    form = this.securityService.encode(JSON.stringify(form))
    return this.http.post(this.configUrl+"publication/upload/pro/",{file: file, form: form, token: token});
  }

  uploadPlublicationGroupe(file,form){
    let token = this.securityService.getToken();
    file = this.securityService.encode(JSON.stringify(file))
    form = this.securityService.encode(JSON.stringify(form))
    return this.http.post(this.configUrl+"publication/upload/groupe",{file: file, form: form, token: token});
  }

  getAllPublications() {
    let token = this.securityService.getToken();
    return this.http.post(this.configUrl+"publication/all-publication", {token: token})
  }

  getUserPublications(id) {
    let token = this.securityService.getToken();
    id = this.securityService.encode(JSON.stringify(id))
    return this.http.post(this.configUrl+"publication/user", {token: token, user: id})
  }

  getProPublication(id) {
    let token = this.securityService.getToken();
    id = this.securityService.encode(JSON.stringify(id))
    return this.http.post(this.configUrl+"publication/pro", {token: token, pro: id})
  }

  getGroupePublication(id) {
    let token = this.securityService.getToken();
    id = this.securityService.encode(JSON.stringify(id))
    return this.http.post(this.configUrl+"publication/groupe", {token: token, groupe: id})
  }
  likePublication(id){
    let token = this.securityService.getToken();
    id = this.securityService.encode(JSON.stringify(id))
    return this.http.post(this.configUrl+"like/publication", {token: token, publication: id})
  }
  dislikePublication(id){
    let token = this.securityService.getToken();
    id = this.securityService.encode(JSON.stringify(id))
    return this.http.post(this.configUrl+"dislike/publication", {token: token, publication: id})
  }
  getCommentaire(id){
    let token = this.securityService.getToken();
    id = this.securityService.encode(JSON.stringify(id))
    return this.http.post(this.configUrl+"commentaire", {token: token, publication: id})
  }
  addCommentaire(id,data){
    let token = this.securityService.getToken();
    id = this.securityService.encode(JSON.stringify(id))
    data = this.securityService.encode(JSON.stringify(data))
    return this.http.post(this.configUrl+"commentaire/add", {token: token, publication: id, form:data})
  }
  deletePublication(id)
  {
    let token = this.securityService.getToken();
    id = this.securityService.encode(JSON.stringify(id))
    return this.http.post(this.configUrl+"publication/delete", {token: token, id: id})
  }
}
