import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Parametre } from '../Models/Parametre';

@Injectable({
  providedIn: 'root'
})
export class ParametreService {

  constructor(private http:HttpClient) { }
  public API_URL= environment.parametreGlobeau_url;

  listparametres : Parametre[] ;
  fromData:Parametre = new Parametre();

  getParametres(){
    this.http.get(this.API_URL).toPromise().then(
      res => this.listparametres = res as Parametre[]);   
  }
  deleteParametre(idParam:number){
    this.http.delete(`${this.API_URL}/${idParam}`);
  }
  
  addParametre(){
    this.http.post(this.API_URL, this.fromData);
  }

  putParametre(){
    return this.http.put(`${this.API_URL}/${this.fromData.parId}`, this.fromData);
}

}
