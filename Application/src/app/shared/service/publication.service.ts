import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PublicationService {

  constructor(private http: HttpClient) { }

  configUrl = 'http://localhost:4444/api/';

  getPublications(token) {
    return this.http.get(this.configUrl+"publication/me/",token);
  }


}
