import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Agence } from '../Models/Agence';

@Injectable({
  providedIn: 'root'
})
export class AgenceService {

  constructor(private http:HttpClient) { }
  public API_URL= environment.agence_url;
  fromData:Agence = new Agence();
  listagence : Agence[];

  getAgence(){
    this.http.get(this.API_URL).toPromise().then(
      res => this.listagence = res as Agence[]);
  }

  getAgenceResolver():Observable<Agence[]>{
    return this.http.get<Agence[]>(this.API_URL); 
  }

  putAgence(){
    return this.http.put(`${this.API_URL}/${this.fromData.ageId}`, this.fromData);
  }
  
  deleteAgence(id:number){
    return this.http.put(`${this.API_URL}/delete/${id}`, this.fromData);
  }

  postAgence(){
    return this.http.post(this.API_URL, this.fromData);
  }
  refreshComponent() {
    window.location.reload();
  }

  


}
