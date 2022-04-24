import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { typefond } from '../Models/typefond';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TypefondService {

  constructor(private http:HttpClient) { }
  
  API_URL =environment.type_fond_url
  fromData:typefond = new typefond ();
  listtypefond: typefond [];
  
  getTypefond(){
    this.http.get(this.API_URL+"/GetTypefond").toPromise().then(
      res => this.listtypefond= res as typefond []);
  }

  getTypefondResolver():Observable<typefond[]>{
    return this.http.get<typefond[]>(this.API_URL+"/GetTypefond");
  }

}
