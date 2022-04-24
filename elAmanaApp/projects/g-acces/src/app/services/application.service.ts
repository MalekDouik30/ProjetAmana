import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Application } from '../Models/Application';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {

  constructor(private http:HttpClient) { }
  public API_URL= environment.application_url;
  urlParamsSearch="";
  fromData:Application = new Application();

  getApplication(){
    return this.http.get<Application[]>(this.API_URL); 
  }
  putApplication(){
    return this.http.put(`${this.API_URL}/${this.fromData.appId}`, this.fromData);
  }
  
  deleteApplication(id:number){
    return this.http.put(`${this.API_URL}/delete/${id}`, this.fromData);
  }

  postApplication(){
    return this.http.post(this.API_URL, this.fromData);
  }
  refreshComponent() {
    window.location.reload();
  }

  getApplicationSearch(libelle:string,description:string,etat:string):Observable<Application[]>{
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
     //this.http.get(`${this.baseURL}/searchs?${this.urlParamsSearch}`).toPromise().then(res => this.listApplication = res as Application[]);
     return this.http.get<Application[]>((`${this.API_URL}/searchs?${this.urlParamsSearch}`));
  }
}
