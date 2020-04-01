import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }
  
  configUrl = 'http://10.0.0.15:8080/api/users/login';


  connection(data) {
    console.log("connection");
    return this.http.post(this.configUrl,data);
  }
}
