import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { placement } from '../Models/placement';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlacementService {

  constructor(private http:HttpClient) { }
  
  API_URL=environment.placement_url;
  fromData:placement = new placement();
  listplacement: placement[];
  listplacementFiltre:placement[]=[];
  listplacementNomEntreprise:string[];
  prixEntreprise:string
  
  getPlacement(){
    this.http.get(this.API_URL).toPromise().then(
        res => {
          this.listplacement = res as placement []
        });
  }

  getPlacementResolver():Observable<placement[]>{
    return this.http.get<placement[]>(this.API_URL); 
  }
  getPlacementResolverAction(){
    // get placement 2 pour les actions cotées en faisant le web scraping du prix de l'action et en mettant à jour la base de données.
    return this.http.get<placement[]>(this.API_URL+"/ActionCotee"); 
  }


  postPlacement(){    
    return this.http.post(this.API_URL+"/AjouterPlacementCapital", this.fromData);
  }
  
  refreshComponent() {
    window.location.reload();
  }

  getNameEntreprise(){
    this.http.get(this.API_URL+"/GetNameEntrepriseBourse").toPromise().then(
      res => {
        this.listplacementNomEntreprise = res as string []
      });
  }

  getPriceAction(nomEntreprise:string):Observable<string[]>{
    return this.http.get<string[]>(this.API_URL+"/GetScrapPrix/"+nomEntreprise); 
  }

  getDernierTauxPlacementParBanque():Observable<placement[]>{
    return this.http.get<placement[]>(this.API_URL+"/DernierTauxPlacementParBanque")
  }

  putPlacement(){
    return this.http.put(`${this.API_URL}/${this.fromData.pla_id}`, this.fromData);
  }

  validatePlacement(){
    return this.http.put(`${this.API_URL}/validate/${this.fromData.pla_id}`, this.fromData);
  }


}
