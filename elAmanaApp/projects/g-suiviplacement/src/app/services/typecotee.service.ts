import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { typecotee } from '../Models/typecotee';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TypecoteeService {

  constructor(private http:HttpClient) { }
  API_URL=environment.type_cote_url
  fromData:typecotee = new typecotee();
  listtypecotee!: typecotee[];
  
  getTypeCotee(){
    this.http.get(this.API_URL+"/GetCoteeNonCotee").toPromise().then(
      res => {this.listtypecotee= res as typecotee[]
      });
      
  }
}
