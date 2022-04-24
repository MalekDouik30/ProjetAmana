import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../Models/User';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public API_URL= environment.utilisateur_URL;
  fromData:User = new User();
  listusers : User[];
  urlParamsSearch="";
  constructor(public http:HttpClient) { }

  postUtilisateur(){    
    return this.http.post(this.API_URL, this.fromData);
  }

  putUtilisateur(){
    return this.http.put(`${this.API_URL}/${this.fromData.utiId}`, this.fromData);
  }

  deleteUtilisateur(id:number){
    return this.http.put(`${this.API_URL}/delete/${id}`, this.fromData);
  }

  getUtilisateur2(){
    this.http.get(this.API_URL).toPromise().then(
        res => this.listusers = res as User[]);
  }
  getUtilisateur(){
    this.http.get(this.API_URL).toPromise().then(
        res => this.listusers = res as User[]);
  }

  getUtilisateurResolver():Observable<User[]>{
    return this.http.get<User[]>(this.API_URL); 
  }

  getUserLoginInformation(){
    let decodedName;
    let decodedLogin;
    let decodedMail;
    let decodedRole;
    let decodedDescription;
    let decodedId;

    let token = localStorage.getItem("jwt")
    if(token!=null){
    let decodeToken = JSON.parse(window.atob(token.split('.')[1])); 
    decodedName = decodeToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name']
    decodedLogin = decodeToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname']
    decodedMail = decodeToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress']
    decodedRole = decodeToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
    decodedDescription = decodeToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/dns']
    decodedId = decodeToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']
    }
    return {decodedName,decodedLogin,decodedMail,decodedRole,decodedDescription,decodedId}
  }

  initializeUser(id:number){
    return this.http.put(`${this.API_URL}/initialize/${id}`,this.fromData);
  }

  verifPassword(login:string,newPassword:string){
    return this.http.get(`${this.API_URL}/verifyPassword/${login}/${newPassword}`);
  }

  changePassword(login:string,newPassword:string){
    return this.http.put(`${this.API_URL}/resetPassword/${login}/${newPassword}`, this.fromData);
  }

  refreshComponent() {
    window.location.reload();// This function allows to update the component and we call it when we want to update the display list when modifying or adding 
  }

  getUserSearchFilter(nom:string,mail:string,description:string,login:string,etat:string,role:string,type:string,dated:string|null,datef:string|null){
    this.urlParamsSearch="";
    if (nom!="" && nom!=null){
      this.urlParamsSearch=this.urlParamsSearch+"nom="+nom
    }
    if (mail!="" && mail!=null){
      this.urlParamsSearch=this.urlParamsSearch+"&mail="+mail
    } 
    if (description!="" && description!=null){
      this.urlParamsSearch=this.urlParamsSearch+"&description="+description
    }
    if(etat!=null){  
      this.urlParamsSearch=this.urlParamsSearch+"&etatInput="+etat
    }
    if(login!="" && login!=null){
      this.urlParamsSearch=this.urlParamsSearch+"&login="+login
    }
    if(role!="" && role!="0"){
      this.urlParamsSearch=this.urlParamsSearch+"&role="+role
    }
    if(type!="" && type!=null){
      this.urlParamsSearch=this.urlParamsSearch+"&type="+type
    }
    if(dated!="" && dated!=null){
      this.urlParamsSearch=this.urlParamsSearch+"&dated="+dated
    }
    if(datef!="" && datef!=null){
      this.urlParamsSearch=this.urlParamsSearch+"&datef="+datef
    }
    console.log(`${this.API_URL}/searchs?${this.urlParamsSearch}`)
    // this.http.get(`${this.baseURL}/searchs?${this.urlParamsSearch}`).toPromise().then(res => this.listusers = res as User[]);
    return this.http.get<User[]>((`${this.API_URL}/searchs?${this.urlParamsSearch}`));
  }

  
}
