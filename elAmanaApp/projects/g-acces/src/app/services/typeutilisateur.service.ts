import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { TypeUtilisateur } from '../Models/TypeUtilisateur';

@Injectable({
  providedIn: 'root'
})
export class TypeutilisateurService {

  constructor(private http:HttpClient) { }

  public API_URL= environment.type_utilisateur_url;
  fromData:TypeUtilisateur = new TypeUtilisateur();
  listTypesUtilisateur: TypeUtilisateur[];

  getTypeUtilisateur(){
    this.http.get(this.API_URL).subscribe(
      res => this.listTypesUtilisateur = res as TypeUtilisateur[]);
  }
  
  getTypeUtilisateurResolver(){
    return this.http.get<TypeUtilisateur[]>(this.API_URL); 

}
}




