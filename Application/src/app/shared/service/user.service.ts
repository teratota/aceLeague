import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }
  
  configUrl = 'http://localhost:4444/api/';


  connection(data) 
  {
    console.log("connection");
    return this.http.post(this.configUrl+"users/login",data);
  }

  getInfosUser(token) {
    return this.http.get(this.configUrl+"users/me/",token);
  }


  newUser(data): any
  {
    console.log("newUser");
    return this.http.post(this.configUrl+"users/register/",data);
  }

  test(){
    return this.http.get(this.configUrl+"users/test/");
  }

  getlist(value)
  {
    return this.http.post(this.configUrl+"user/getlist",{data: value});
  }
}
