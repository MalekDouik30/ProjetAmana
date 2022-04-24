import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { RoleFonction } from '../Models/RoleFonction';

@Injectable({
  providedIn: 'root'
})
export class RoleFonctionService {

  public API_URL= environment.role_fonction_URL;
  fromData:RoleFonction = new RoleFonction();
  listrolefonction: RoleFonction[];

  constructor(private http:HttpClient) { }

  getRoleFonctionAuth():Observable<RoleFonction[]>{
    return this.http.get<RoleFonction[]>(this.API_URL);
  }
  getRoleFonction(idRole:number){
    return this.http.get(this.API_URL+"/"+idRole).toPromise().then(
       res => this.listrolefonction = res as RoleFonction[]); 
 }
  postRoleFonction(){
    return this.http.post(this.API_URL, this.fromData);
  }
  deleteRoleFonction(idRole:number,idFonction:number){
    return this.http.delete(`${this.API_URL}/${idRole}/${idFonction}`);
  }



}
