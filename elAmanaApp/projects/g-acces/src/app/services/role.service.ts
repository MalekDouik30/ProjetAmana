import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Role } from '../Models/Role';
@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(private http:HttpClient) { }
  public API_URL= environment.role_url;

  fromData:Role = new Role();
  listrole: Role[] | undefined ;
  listroleById: Role[] ;
  nameRole:Promise<string>;
  urlParamsSearch="";

postRole(){
    return this.http.post(this.API_URL, this.fromData);
 }

getRole(){
  return this.http.get<Role[]>(this.API_URL); 
}
getRole2(){
  this.http.get(this.API_URL).toPromise().then(
    res => this.listrole = res as Role[]);
}
putRole(){
  return this.http.put(`${this.API_URL}/${this.fromData.rolId}`, this.fromData);
}

deleteRole(id:number){
  return this.http.put(`${this.API_URL}/delete/${id}`, this.fromData);
}

getRoleById(id:number){
    this.http.get(this.API_URL+"/"+id).toPromise().then(
      res => this.listroleById = res as Role[]);
}

getNameRoleById(id:number){
  this.nameRole=this.http.get(this.API_URL+"/GetRoleName/"+id).toPromise().then(
    res => this.nameRole);

    return this.nameRole;
}

refreshComponent() {
  window.location.reload();// This function allows to update the component and we call it when we want to update the display list when modifying or adding 
}
getRoleSearch(libelle:string,etat:string,description:string):Observable<Role[]>{
  this.urlParamsSearch=""; // reset search url Api
  if (libelle!="" && libelle!=null){
    this.urlParamsSearch=this.urlParamsSearch+"libelle="+libelle
  } 
  if (description!="" && description!=null){
    this.urlParamsSearch=this.urlParamsSearch+"&description="+description
  }
  if(etat!=null ){
    this.urlParamsSearch=this.urlParamsSearch+"&etatInput="+etat
  }
   //this.http.get(`${this.baseURL}/searchs?${this.urlParamsSearch}`).toPromise().then(res => this.listModule = res as Module[]);
   return this.http.get<Role[]>((`${this.API_URL}/searchs?${this.urlParamsSearch}`));
}


}
