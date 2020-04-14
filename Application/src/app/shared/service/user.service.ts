import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }
  
  configUrl = 'http://localhost:4444/api/users/login';


  connection(data) 
  {
    console.log("connection");
    return this.http.post(this.configUrl,data);
  }
  insertUser(data){
    console.log("insertuser");
    return this.http.post(this.configUrl,data);
  }
}
