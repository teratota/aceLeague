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

  getPublications() {
    let token = this.securityService.getToken();
    return this.http.post(this.configUrl+"publication/me/",{token: token});
  }

  uploadPublication(file,form){
    let token = this.securityService.getToken();
    return this.http.post(this.configUrl+"publication/upload/",{file: file, form: form, token: token});
  }
}
