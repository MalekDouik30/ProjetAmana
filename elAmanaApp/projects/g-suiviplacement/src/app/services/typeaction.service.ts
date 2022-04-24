import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { typeaction } from '../Models/typeaction';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TypeactionService {

  constructor(private http:HttpClient) { }
  API_URL=environment.type_action_url;
  fromData:typeaction = new typeaction();
  listaction: typeaction[];
  
  getTypeaction(){
    this.http.get(this.API_URL+"/GetTypeAction").toPromise().then(
      res => {
        this.listaction = res as typeaction[]}

        );
  }

  getTypeactionResolver():Observable<typeaction[]>{
    return this.http.get<typeaction[]>(this.API_URL+"/GetTypeAction")
  }

}
