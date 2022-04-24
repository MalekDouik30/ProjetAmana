import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { intermediaireB } from '../Models/intermediaireB';

@Injectable({
  providedIn: 'root'
})
export class IntermediaireBService {

  constructor(private http:HttpClient) { }
  public API_URL= environment.intermB_url;
  fromData:intermediaireB = new intermediaireB();
  listinterB : intermediaireB[];

  getinterB(){
    this.http.get(this.API_URL+"/GetIntermediareBourse").toPromise().then(
      res => { this.listinterB = res as intermediaireB[] });
  }
  
  getInterBourseResolver():Observable<intermediaireB[]>{
    return this.http.get<intermediaireB[]>(this.API_URL+'/GetIntermediareBourse')
  }

  postInterBourse(){
    return this.http.post(this.API_URL, this.fromData);
  }
  deleteInterBourse(id:number){
    return this.http.delete(this.API_URL+'/'+id);
  }

  putInterBourse(){
    return this.http.put(this.API_URL+'/'+this.fromData.inB_id,this.fromData)
  }

  refreshComponent() {
    window.location.reload();
  }


}

