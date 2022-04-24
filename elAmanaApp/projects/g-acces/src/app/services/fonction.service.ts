import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Fonction } from '../Models/Fonction';
@Injectable({
  providedIn: 'root'
})
export class FonctionService {

  constructor(private http:HttpClient) { }
  public API_URL= environment.fonction_url;
  urlParamsSearch="";
  fromData:Fonction = new Fonction();


  listfonction:Fonction[]
  getFonction(){
    return this.http.get<Fonction[]>(this.API_URL); 
  }
  geFonction2(){
    return this.http.get(this.API_URL+"/").toPromise().then(
       res => this.listfonction = res as Fonction[]); 
 }
  putFonction(){
    return this.http.put(`${this.API_URL}/${this.fromData.fonId}`, this.fromData);
  }
  
  deleteFonction(id:number){
    return this.http.put(`${this.API_URL}/delete/${id}`, this.fromData);
  }

  postFonction(){
    return this.http.post(this.API_URL, this.fromData);
  }
  refreshComponent() {
    window.location.reload();
  }

  getFonctionSearch(nom:string,description:string,etat:string,module:string):Observable<Fonction[]>{
    this.urlParamsSearch=""; // reset search url Api
    if (nom!="" && nom!=null){
      this.urlParamsSearch=this.urlParamsSearch+"nom="+nom
    } 
    if (description!="" && description!=null){
      this.urlParamsSearch=this.urlParamsSearch+"&description="+description
    }
    if(etat!=null ){
      this.urlParamsSearch=this.urlParamsSearch+"&etatInput="+etat
    }
    if(etat!=null ){
      this.urlParamsSearch=this.urlParamsSearch+"&etatInput="+etat
    }
    if(module!=null ){
      this.urlParamsSearch=this.urlParamsSearch+"&module="+module
    }
  
     //this.http.get(`${this.baseURL}/searchs?${this.urlParamsSearch}`).toPromise().then(res => this.listfonction = res as Fonction[]);
     return this.http.get<Fonction[]>((`${this.API_URL}/searchs?${this.urlParamsSearch}`));
  }


}
