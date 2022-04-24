import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { typeSSplacement } from '../Models/typeSSplacement';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TypesoussousplacementService {

  constructor(private http:HttpClient) { }
  API_URL=environment.type_sous_sous_placement_url
  fromData:typeSSplacement = new typeSSplacement();
  listtypeSSplacement!: typeSSplacement[];
  
  getTypeSSplacement(){
    this.http.get(this.API_URL+"/GetTypeSousSousplacement").toPromise().then(
      res => this.listtypeSSplacement= res as typeSSplacement[]);
  }
}
