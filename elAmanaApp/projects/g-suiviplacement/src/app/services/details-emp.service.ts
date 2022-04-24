import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { detailsEmp } from '../Models/detailsEmp';

@Injectable({
  providedIn: 'root'
})
export class DetailsEmpService {

  constructor(private http:HttpClient) { }
  public API_URL= environment.detailsEmp_url;
  fromData:detailsEmp= new detailsEmp();
  listdetailsEmp: detailsEmp[];

  postdetailsEmp(){
    return this.http.post(this.API_URL+"/AjouterDetailsEmprunts", this.fromData);
  }

  getDetailsEmpResolver():Observable<detailsEmp[]>{
    return this.http.get<detailsEmp[]>(this.API_URL); 
  }
  getDetailsEmp(){
    this.http.get(this.API_URL).toPromise().then(
      res => this.listdetailsEmp= res as detailsEmp[]);
  }
}
