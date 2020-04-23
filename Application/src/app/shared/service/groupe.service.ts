import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GroupeService {
  configUrl = 'http://localhost:4444/api/';
  constructor(private http: HttpClient) { }
  getlist(value)
  {
    console.log("connection");
    return this.http.post(this.configUrl+"groupe/getlist",{data: value});
  }
}
