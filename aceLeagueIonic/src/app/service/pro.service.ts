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
  deletePro(pro){
    let token = this.securityService.getToken();
    return this.http.post(this.configUrl+"pro/delete",{pro: pro,token: token});
  }
  updatePro(pro){
    let token = this.securityService.getToken();
    return this.http.post(this.configUrl+"pro/update",{pro: pro,token: token});
  }
  updateProImage(pro,file){
    let token = this.securityService.getToken();
    return this.http.post(this.configUrl+"pro/update",{pro: pro,file: file,token: token});
  }
  getInfoPro(pro){
    let token = this.securityService.getToken();
    return this.http.post(this.configUrl+"pro/get",{pro: pro,token: token});
  }
}
