import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Parametre } from '../Models/parametre';

@Injectable({
  providedIn: 'root'
})
export class ParametreService {

  constructor(private http:HttpClient) { }
  public API_URL= environment.detailsParametre_url;
  fromData:Parametre = new Parametre();
  listParametre: Parametre[];

  getParametre(){
    this.http.get(this.API_URL+"/GetParametre").toPromise().then(
      res => this.listParametre= res as Parametre[]);
  }
  putParametre(){
    return this.http.put(`${this.API_URL}/${this.fromData.par_id}`, this.fromData);
  }
}
