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
}
