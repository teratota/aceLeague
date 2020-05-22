import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SecurityService } from './security.service';

@Injectable({
  providedIn: 'root'
})
export class GroupeService {
  configUrl = 'http://localhost:4444/api/';
  constructor(private http: HttpClient, private securityService: SecurityService) { }
  getlist(value)
  {
    let token = this.securityService.getToken();
    return this.http.post(this.configUrl+"groupe/getlist",{data: value, token: token});
  }
  deleteGroupe(groupe)
  {
    let token = this.securityService.getToken();
    return this.http.post(this.configUrl+"groupe/delete",{groupe: groupe, token: token});
  }
  getGroupeInfo(groupe)
  {
    let token = this.securityService.getToken();
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
    return this.http.post(this.configUrl+"groupe/check/author",{groupe:groupe, token: token});
  }
  newGroupe(form,file){
    let token = this.securityService.getToken();
    return this.http.post(this.configUrl+"groupe/add",{form:form,file:file, token: token});
  }
  updateGroupe(form,groupe){
    let token = this.securityService.getToken();
    return this.http.post(this.configUrl+"groupe/update",{groupe:groupe,form:form, token: token});
  }
  updateGroupeImage(groupe,file){
    let token = this.securityService.getToken();
    return this.http.post(this.configUrl+"groupe/update/image",{groupe:groupe,file:file, token: token});
  }
  groupe2UserGetList(){
    let token = this.securityService.getToken();
    return this.http.post(this.configUrl+"groupe2user/getlist",{token: token});
  }
  groupe2UserAdd(groupe){
    let token = this.securityService.getToken();
    return this.http.post(this.configUrl+"groupe2user/add",{groupe:groupe,token: token});
  }
  groupe2UserCheck(groupe){
    let token = this.securityService.getToken();
    return this.http.post(this.configUrl+"groupe2user/check",{groupe:groupe,token: token});
  }
  groupe2userDelete(groupe){
    let token = this.securityService.getToken();
    return this.http.post(this.configUrl+"groupe2user/delete",{groupe:groupe,token: token});
  }
  groupe2userNumberUser(groupe){
    let token = this.securityService.getToken();
    return this.http.post(this.configUrl+"groupe2user/number/user",{groupe:groupe,token: token});
  }
}
