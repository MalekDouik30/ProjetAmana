import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { RoleApplication } from '../Models/RoleApplication';

@Injectable({
  providedIn: 'root'
})
export class RoleApplicationService {

  public API_URL= environment.role_application_url;
  fromData:RoleApplication = new RoleApplication();
  listroleApplication: RoleApplication[];

  constructor(private http:HttpClient) { }

  getRoleApplicationAuth():Observable<RoleApplication[]>{
    return this.http.get<RoleApplication[]>(this.API_URL);
  }
  getRoleApplication(idRole:number){
    return this.http.get(this.API_URL+"/"+idRole).toPromise().then(
       res => this.listroleApplication = res as RoleApplication[]); 
 }
  postRoleApplication(){
    console.log("EEEEEEE")
    console.log(this.fromData)
    return this.http.post(this.API_URL, this.fromData);
  }
  deleteRoleApplication(idRole:number,idApplication:number){
    return this.http.delete(`${this.API_URL}/${idRole}/${idApplication}`);
  }
}
