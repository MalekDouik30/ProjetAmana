import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from '../Models/User';
import { AuthentificationService } from '../services/authentification.service';
import { ParametreService } from '../services/parametre.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  invalidLogin: boolean;
  etatutilisateur :boolean;
  errorMessage :string;
  utilisateurId=0;
  number_times_to_authenticate:number
  defaultPassword:string;
  changeView="loginView"
  confirmPasswordVar:string;
  identifiedUserLogin:string;

  userLogin:User = new User() 

  constructor(public authService: AuthentificationService, 
    public router: Router,
    public userService:UserService,
    public paramService : ParametreService,
    public toaster:ToastrService) {  }

  loginFunction(monForm:NgForm) {
    // get Get the global parameters : number of authentication attempts + the default password
    try{
      for(let item of this.paramService.listparametres){
        this.number_times_to_authenticate = item.parNbeTentativeAuthentification
        this.defaultPassword=item.parMotPasseDefaut
      }
    }
    catch{
      this.toaster.error("Erreur de connexion à la base de données","Erreur de connexion")
    }


    this.authService.postlogin().subscribe(
      (res) => {
        const token = (<any>res).token;

      // Get User information :
      let decodeToken = JSON.parse(window.atob(token.split('.')[1])); 
      const decodedName = decodeToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name']
      const decodedLogin = decodeToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname']
      const decodedMail = decodeToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress']
      const decodedRole = decodeToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
      const decodedEtat = decodeToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/authorizationdecision']
      const decodedId = decodeToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']
      this.utilisateurId=Number(decodedId);
      
      // if this account is not bloked
      if (decodedEtat=="True"){
        this.etatutilisateur=false;
        this.invalidLogin = false;
      
        if(monForm.value.password === this.defaultPassword){
          // if the password given by the user during authentication is the default password in the global parameters table 
          // this.router.navigate(['/reset-password']);
          this.identifiedUserLogin=monForm.value.login
          this.changeView="ResetPasswordView"

           // store a variable in a localstorage to test on it in page redirection in authentification.service  canActivate()
        }
        else{
          localStorage.setItem('jwt', token);
          this.router.navigate(['/']);
        }      
      }
      // if this account is bloked
      if (decodedEtat=="False"){
        this.etatutilisateur=true
      } 
      },
      (err) => {
        this.invalidLogin = true;
        console.log(err);
        this.errorMessage=err.error.message;
      }
    );
  }

  ngOnInit(): void {
    this.paramService.getParametres()
  }
 
  changeUserPassword(resetPswdForm:NgForm){
   this.userService.changePassword(this.identifiedUserLogin,this.userService.fromData.utiMotPasse).subscribe(
     res=>{
       this.toaster.success("Votre mot de passe a été modifié avec succès vous pouvez vous connecter avec ce nouveau mot de passe","Modification")
       this.router.navigate(['login']);
       this.changeView="loginView"
     },

     err => {
       this.toaster.error("Échec de la modification du mot de passe, réessayez","Modification")
       console.log(err);}
   );
 }

}
