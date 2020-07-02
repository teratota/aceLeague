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
    const token = this.securityService.getToken();
    user = this.securityService.encode(JSON.stringify(user));
    return this.http.post(this.configUrl + 'publication/me/', {user, token});
  }

  uploadPublication(file, form) {
    const token = this.securityService.getToken();
    file = this.securityService.encode(JSON.stringify(file));
    form = this.securityService.encode(JSON.stringify(form));
    return this.http.post(this.configUrl + 'publication/upload/', {file, form, token});
  }

  uploadPublicationPro(file, form) {
    const token = this.securityService.getToken();
    file = this.securityService.encode(JSON.stringify(file));
    form = this.securityService.encode(JSON.stringify(form));
    return this.http.post(this.configUrl + 'publication/upload/pro/', {file, form, token});
  }

  uploadPlublicationGroupe(file, form) {
    const token = this.securityService.getToken();
    file = this.securityService.encode(JSON.stringify(file));
    form = this.securityService.encode(JSON.stringify(form));
    return this.http.post(this.configUrl + 'publication/upload/groupe', {file, form, token});
  }

  getAllPublications() {
    const token = this.securityService.getToken();
    return this.http.post(this.configUrl + 'publication/all-publication', {token});
  }

  getUserPublications(id) {
    const token = this.securityService.getToken();
    id = this.securityService.encode(JSON.stringify(id));
    return this.http.post(this.configUrl + 'publication/user', {token, user: id});
  }

  getProPublication(id) {
    const token = this.securityService.getToken();
    id = this.securityService.encode(JSON.stringify(id));
    return this.http.post(this.configUrl + 'publication/pro', {token, pro: id});
  }

  getGroupePublication(id) {
    const token = this.securityService.getToken();
    id = this.securityService.encode(JSON.stringify(id));
    return this.http.post(this.configUrl + 'publication/groupe', {token, groupe: id});
  }

  likePublication(id) {
    const token = this.securityService.getToken();
    id = this.securityService.encode(JSON.stringify(id));
    return this.http.post(this.configUrl + 'like/publication', {token, publication: id});
  }

  dislikePublication(id) {
    const token = this.securityService.getToken();
    id = this.securityService.encode(JSON.stringify(id));
    return this.http.post(this.configUrl + 'dislike/publication', {token, publication: id});
  }

  getCommentaire(id) {
    const token = this.securityService.getToken();
    id = this.securityService.encode(JSON.stringify(id));
    return this.http.post(this.configUrl + 'commentaire', {token, publication: id});
  }

  addCommentaire(id, data) {
    const token = this.securityService.getToken();
    id = this.securityService.encode(JSON.stringify(id));
    data = this.securityService.encode(JSON.stringify(data));
    return this.http.post(this.configUrl + 'commentaire/add', {token, publication: id, form: data});
  }

  deletePublication(id) {
    const token = this.securityService.getToken();
    id = this.securityService.encode(JSON.stringify(id));
    return this.http.post(this.configUrl + 'publication/delete', {token, id});
  }
}
