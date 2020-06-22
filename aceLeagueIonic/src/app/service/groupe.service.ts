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
  getlist(value)
  {
    let token = this.securityService.getToken();
    value = this.securityService.encode(JSON.stringify(value))
    return this.http.post(this.configUrl+"groupe/getlist",{data: value, token: token});
  }
  deleteGroupe(groupe)
  {
    let token = this.securityService.getToken();
    groupe = this.securityService.encode(JSON.stringify(groupe))
    return this.http.post(this.configUrl+"groupe/delete",{groupe: groupe, token: token});
  }
  getGroupeInfo(groupe)
  {
    let token = this.securityService.getToken();
    groupe = this.securityService.encode(JSON.stringify(groupe))
    return this.http.post(this.configUrl+"groupe/get",{groupe: groupe, token: token});
  }
  getMyGroupe()
  {
    let token = this.securityService.getToken();
    return this.http.post(this.configUrl+"groupe/me",{ token: token});
  }
  groupeCheckAuthor(groupe)
  {
    let token = this.securityService.getToken();
    groupe = this.securityService.encode(JSON.stringify(groupe))
    return this.http.post(this.configUrl+"groupe/check/author",{groupe:groupe, token: token});
  }
  newGroupe(form,file){
    let token = this.securityService.getToken();
    form = this.securityService.encode(JSON.stringify(form))
    file = this.securityService.encode(JSON.stringify(file))
    return this.http.post(this.configUrl+"groupe/add",{form:form,file:file, token: token});
  }
  updateGroupe(form,groupe){
    let token = this.securityService.getToken();
    groupe = this.securityService.encode(JSON.stringify(groupe))
    form = this.securityService.encode(JSON.stringify(form))
    return this.http.post(this.configUrl+"groupe/update",{groupe:groupe,form:form, token: token});
  }
  updateGroupeImage(groupe,file){
    let token = this.securityService.getToken();
    groupe = this.securityService.encode(JSON.stringify(groupe))
    file = this.securityService.encode(JSON.stringify(file))
    return this.http.post(this.configUrl+"groupe/update/image",{groupe:groupe,file:file, token: token});
  }
  groupe2UserGetList(){
    let token = this.securityService.getToken();
    return this.http.post(this.configUrl+"groupe2user/getlist",{token: token});
  }
  groupe2UserAdd(groupe,user=null){
    let token = this.securityService.getToken();
    user = this.securityService.encode(JSON.stringify(user))
    groupe = this.securityService.encode(JSON.stringify(groupe))
    return this.http.post(this.configUrl+"groupe2user/add",{groupe:groupe,user:user,token: token});
  }
  groupe2UserCheck(groupe){
    let token = this.securityService.getToken();
    groupe = this.securityService.encode(JSON.stringify(groupe))
    return this.http.post(this.configUrl+"groupe2user/check",{groupe:groupe,token: token});
  }
  groupe2userDelete(groupe,user){
    let token = this.securityService.getToken();
    groupe = this.securityService.encode(JSON.stringify(groupe))
    user = this.securityService.encode(JSON.stringify(user))
    return this.http.post(this.configUrl+"groupe2user/delete",{groupe:groupe,user:user,token: token});
  }
  groupe2userNumberUser(groupe){
    let token = this.securityService.getToken();
    groupe = this.securityService.encode(JSON.stringify(groupe))
    return this.http.post(this.configUrl+"groupe2user/number/user",{groupe:groupe,token: token});
  }
  groupe2userListUser(groupe){
    let token = this.securityService.getToken();
    groupe = this.securityService.encode(JSON.stringify(groupe))
    return this.http.post(this.configUrl+"groupe2user/list/user",{groupe:groupe,token: token});
  }
  groupe2userFriendListUserIsNot(groupe){
    let token = this.securityService.getToken();
    groupe = this.securityService.encode(JSON.stringify(groupe))
    return this.http.post(this.configUrl+"groupe2user/list/userfriend/isnot",{groupe:groupe,token: token});
  }
  getMyGroupePublic(){
    let token = this.securityService.getToken();
    return this.http.post(this.configUrl+"groupe/me/public",{token: token});
  }
  getMyGroupePrive(){
    let token = this.securityService.getToken();
    return this.http.post(this.configUrl+"groupe/me/prive",{token: token});
  }
}
