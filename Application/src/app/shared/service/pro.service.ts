import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProService {
  configUrl = 'http://localhost:4444/api/';
  constructor(private http: HttpClient) { }
  getlist(value)
  {
    return this.http.post(this.configUrl+"pro/getlist",{data: value});
  }
}
