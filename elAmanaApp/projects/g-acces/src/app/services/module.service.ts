import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Module } from '../Models/Module';

@Injectable({
  providedIn: 'root'
})
export class ModuleService {

  constructor(private http:HttpClient) { }
  public API_URL= environment.module_url;
  urlParamsSearch="";
  fromData:Module = new Module();

  getModule(){
    return this.http.get<Module[]>(this.API_URL); 
  }
  putModule(){
    return this.http.put(`${this.API_URL}/${this.fromData.modId}`, this.fromData);
  }
  
  deleteModule(id:number){
    return this.http.put(`${this.API_URL}/delete/${id}`, this.fromData);
  }

  postModule(){
    return this.http.post(this.API_URL, this.fromData);
  }
  refreshComponent() {
    window.location.reload();
  }

  getModuleSearch(libelle:string,etat:string,description:string,applicationId:string):Observable<Module[]>{
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
    if(applicationId!=null ){
      this.urlParamsSearch=this.urlParamsSearch+"&applicationId="+applicationId
    }

     //this.http.get(`${this.baseURL}/searchs?${this.urlParamsSearch}`).toPromise().then(res => this.listModule = res as Module[]);
     return this.http.get<Module[]>((`${this.API_URL}/searchs?${this.urlParamsSearch}`));
  }
}


