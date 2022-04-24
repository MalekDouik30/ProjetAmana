import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Direction } from '../Models/Direction';

@Injectable({
  providedIn: 'root'
})
export class DirectionService {

  constructor(private http:HttpClient) { }
  public API_URL= environment.direction_url;
  urlParamsSearch="";
  fromData:Direction = new Direction();
  listdirection : Direction[];

  getDirection(){
    this.http.get(this.API_URL).toPromise().then(
      res => this.listdirection = res as Direction[]);
  }
  putDirection(){
    return this.http.put(`${this.API_URL}/${this.fromData.dirId}`, this.fromData);
  }
  
  deleteDirection(id:number){
    return this.http.put(`${this.API_URL}/delete/${id}`, this.fromData);
  }

  postDirection(){
    return this.http.post(this.API_URL, this.fromData);
  }
  refreshComponent() {
    window.location.reload();
  }
}
