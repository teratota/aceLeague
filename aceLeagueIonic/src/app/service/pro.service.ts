import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SecurityService } from './security.service';

@Injectable({
  providedIn: 'root'
})
export class ProService {

  configUrl = 'http://localhost:4444/api/';
  constructor(private http: HttpClient, private securityService: SecurityService) { }
  getlist(value)
  {
    let token = this.securityService.getToken();
    return this.http.post(this.configUrl+"pro/getlist",{data: value, token: token});
  }
  getListMe(){
    let token = this.securityService.getToken();
    return this.http.post(this.configUrl+"pro/getlist/me",{token: token});
  }
  newPro(form,file){
    let token = this.securityService.getToken();
    return this.http.post(this.configUrl+"pro/add",{form: form,file:file,token: token});
  }
  deletePro(pro){
    let token = this.securityService.getToken();
    return this.http.post(this.configUrl+"pro/delete",{pro: pro,token: token});
  }
  updatePro(form,pro){
    let token = this.securityService.getToken();
    return this.http.post(this.configUrl+"pro/update",{form: form,pro:pro,token: token});
  }
  updateProImage(pro,file){
    let token = this.securityService.getToken();
    return this.http.post(this.configUrl+"pro/update/image",{pro: pro,file: file,token: token});
  }
  getInfoPro(pro){
    let token = this.securityService.getToken();
    return this.http.post(this.configUrl+"pro/get",{pro: pro,token: token});
  }
  getNumberAbonnement(pro)
  {
    let token = this.securityService.getToken();
    return this.http.post(this.configUrl+"pro/number/abonnement",{pro: pro,token: token});
  }
  getNumberAbonnementUser(user)
  {
    let token = this.securityService.getToken();
    return this.http.post(this.configUrl+"pro/number/abonnement/me",{user:user,token: token});
  }
  abonnementUserCheck(pro)
  {
    let token = this.securityService.getToken();
    return this.http.post(this.configUrl+"pro/check/abonnement",{pro: pro,token: token});
  }
  abonnementUserAdd(pro)
  {
    let token = this.securityService.getToken();
    return this.http.post(this.configUrl+"pro/add/abonnement",{pro: pro,token: token});
  }
  checkProAuthor(pro)
  {
    let token = this.securityService.getToken();
    return this.http.post(this.configUrl+"pro/check/author",{pro: pro,token: token});
  }
}
