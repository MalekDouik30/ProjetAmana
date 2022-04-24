import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { typeplacement } from '../Models/typeplacement';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TypeplacementService {

  constructor(private http:HttpClient) { }
  API_URL=environment.type_placement_url
  fromData:typeplacement = new typeplacement();
  listtypeplacement: typeplacement[];
  
  getTypeplacement(){
    this.http.get(this.API_URL+"/GetTypeplacement").toPromise().then(
      res => this.listtypeplacement= res as typeplacement[]);
  }

  getTypeplacementResolver():Observable<typeplacement[]>{
    return this.http.get <typeplacement[]> (this.API_URL+"/GetTypeplacement");
  }
}
