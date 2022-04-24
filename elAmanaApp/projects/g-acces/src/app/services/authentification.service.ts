import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { JwtHelperService } from '@auth0/angular-jwt'; // npm i @auth0/angular-jwt
import { UserService } from './user.service';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AuthentificationService implements CanActivate {

  constructor(private http:HttpClient, private jwtHelper :JwtHelperService, private serviceUser:UserService,private router:Router) { }
  login="";
  password="";
  public API_URL= environment.utilisateur_URL;

  postlogin(){
    const body={
      "utiLogin" : this.login,
      "utiMotPasse" : this.password,
    }
    return this.http.post(this.API_URL+"/login", body)      
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) : Observable<boolean> | Promise<boolean> | boolean {
    let redirectionPath: string = "";
    const token = localStorage.getItem("jwt");
       
    if(token && !this.jwtHelper.isTokenExpired(token)){
      return true;
    }
    redirectionPath="gAcces/login";
    this.router.navigate([redirectionPath]);

    return false;
  }

  deleteUtilisateurBylogin(login:string){
    return this.http.put(`${this.API_URL}/deleteByLogin/${login}`,null).subscribe(
      (res) => {
        console.log("Bloqué avec succes")
      },
      (err) => {
        console.log(err);
      }
    )
  }

}
