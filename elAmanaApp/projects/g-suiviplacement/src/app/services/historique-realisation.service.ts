import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HistoriqueRealisation } from '../Models/HistoriqueRealisation';

@Injectable({
  providedIn: 'root'
})
export class HistoriqueRealisationService {

  constructor(private http:HttpClient) { }
  public API_URL= environment.historiqueRealisation_url;
  fromData:HistoriqueRealisation= new HistoriqueRealisation();

  getHistoRealisationResolver():Observable<HistoriqueRealisation[]>{
    return this.http.get<HistoriqueRealisation[]>(this.API_URL)
  }

  postHistoRealisation(){
    return this.http.post(this.API_URL, this.fromData);
  }


  putHistoRealisation(){
    return this.http.put(this.API_URL+'/'+this.fromData.id_histo_rea,this.fromData)
  }

  refreshComponent() {
    window.location.reload();
  }
}
