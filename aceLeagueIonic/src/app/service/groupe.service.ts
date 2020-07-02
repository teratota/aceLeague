import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SecurityService } from './security.service';
import { api_path } from '../includes/api_path.js';

@Injectable({
  providedIn: 'root'
})
export class GroupeService {
  configUrl = api_path;
  constructor(private http: HttpClient, private securityService: SecurityService) { }
  getlist(data) {
    const token = this.securityService.getToken();
    data = this.securityService.encode(JSON.stringify(data));
    return this.http.post(this.configUrl + 'groupe/getlist', {data, token});
  }
  deleteGroupe(groupe) {
    const token = this.securityService.getToken();
    groupe = this.securityService.encode(JSON.stringify(groupe));
    return this.http.post(this.configUrl + 'groupe/delete', {groupe, token});
  }
  getGroupeInfo(groupe) {
    const token = this.securityService.getToken();
    groupe = this.securityService.encode(JSON.stringify(groupe));
    return this.http.post(this.configUrl + 'groupe/get', {groupe, token});
  }
  getMyGroupe() {
    const token = this.securityService.getToken();
    return this.http.post(this.configUrl + 'groupe/me', {token});
  }
  groupeCheckAuthor(groupe) {
    const token = this.securityService.getToken();
    groupe = this.securityService.encode(JSON.stringify(groupe));
    return this.http.post(this.configUrl + 'groupe/check/author', {groupe, token});
  }
  newGroupe(form, file) {
    const token = this.securityService.getToken();
    form = this.securityService.encode(JSON.stringify(form));
    file = this.securityService.encode(JSON.stringify(file));
    return this.http.post(this.configUrl + 'groupe/add', {form, file, token});
  }
  updateGroupe(form, groupe) {
    const token = this.securityService.getToken();
    groupe = this.securityService.encode(JSON.stringify(groupe));
    form = this.securityService.encode(JSON.stringify(form));
    return this.http.post(this.configUrl + 'groupe/update', {groupe, form, token});
  }
  updateGroupeImage(groupe, file) {
    const token = this.securityService.getToken();
    groupe = this.securityService.encode(JSON.stringify(groupe));
    file = this.securityService.encode(JSON.stringify(file));
    return this.http.post(this.configUrl + 'groupe/update/image', {groupe, file, token});
  }
  groupe2UserGetList() {
    const token = this.securityService.getToken();
    return this.http.post(this.configUrl + 'groupe2user/getlist', {token});
  }
  groupe2UserAdd(groupe, user = null) {
    const token = this.securityService.getToken();
    user = this.securityService.encode(JSON.stringify(user));
    groupe = this.securityService.encode(JSON.stringify(groupe));
    return this.http.post(this.configUrl + 'groupe2user/add', {groupe, user, token});
  }
  groupe2UserCheck(groupe) {
    const token = this.securityService.getToken();
    groupe = this.securityService.encode(JSON.stringify(groupe));
    return this.http.post(this.configUrl + 'groupe2user/check', {groupe, token});
  }
  groupe2userDelete(groupe, user) {
    const token = this.securityService.getToken();
    groupe = this.securityService.encode(JSON.stringify(groupe));
    user = this.securityService.encode(JSON.stringify(user));
    return this.http.post(this.configUrl + 'groupe2user/delete', {groupe, user, token});
  }
  groupe2userNumberUser(groupe) {
    const token = this.securityService.getToken();
    groupe = this.securityService.encode(JSON.stringify(groupe));
    return this.http.post(this.configUrl + 'groupe2user/number/user', {groupe, token});
  }
  groupe2userListUser(groupe) {
    const token = this.securityService.getToken();
    groupe = this.securityService.encode(JSON.stringify(groupe));
    return this.http.post(this.configUrl + 'groupe2user/list/user', {groupe, token});
  }
  groupe2userFriendListUserIsNot(groupe) {
    const token = this.securityService.getToken();
    groupe = this.securityService.encode(JSON.stringify(groupe));
    return this.http.post(this.configUrl + 'groupe2user/list/userfriend/isnot', {groupe, token});
  }
  getMyGroupePublic() {
    const token = this.securityService.getToken();
    return this.http.post(this.configUrl + 'groupe/me/public', {token});
  }
  getMyGroupePrive() {
    const token = this.securityService.getToken();
    return this.http.post(this.configUrl + 'groupe/me/prive', {token});
  }
}
