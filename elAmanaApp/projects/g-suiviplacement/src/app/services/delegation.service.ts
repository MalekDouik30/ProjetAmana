import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delegation } from '../Models/delegation';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DelegationService {

  constructor(private http:HttpClient) { }
  public API_URL= environment.delegation_url;
  fromData:delegation = new delegation();
  listdelegation!: delegation[];

  getDelegation(){
    this.http.get(this.API_URL+"/GetDelegation").toPromise().then(
      res => this.listdelegation= res as delegation[]);
  }
}
