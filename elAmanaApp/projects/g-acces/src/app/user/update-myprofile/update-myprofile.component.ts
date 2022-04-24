import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthorizationWithoutRootService } from '../../services/authorization-without-root.service';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-update-myprofile',
  templateUrl: './update-myprofile.component.html',
  styleUrls: ['./update-myprofile.component.scss']
})
export class UpdateMyprofileComponent implements OnInit {

  filterDiv="";
  confirmPasswordVar:string;
  identifiedUserLogin:string;
  oldpasswordVar:string
  
  listfunctionalitiesInThisComponent=["modifier mon profil"]

   constructor(public router:Router ,public authService:AuthorizationWithoutRootService,public userService:UserService,public toaster:ToastrService) {
    this.identifiedUserLogin=this.userService.getUserLoginInformation().decodedLogin
    this.authService.getFunctionalities(this.listfunctionalitiesInThisComponent)
  }

  ShowDiv(divVal: string) {
    this.filterDiv = divVal;
  }

  changeUserPassword(resetPswdForm:NgForm){
    this.userService.verifPassword(this.identifiedUserLogin,resetPswdForm.value.ancienpassword).subscribe( 
    res =>{
      this.userService.changePassword(this.identifiedUserLogin,this.userService.fromData.utiMotPasse).subscribe(
        res=>{
          this.toaster.success("Votre mot de passe a été modifié avec succès vous pouvez vous connecter avec ce nouveau mot de passe","Modification")
          localStorage.removeItem("jwt");
          this.router.navigate(['gAcces/login']);
        },
        err => {
          this.toaster.error("Échec de la modification du mot de passe, réessayez","Modification Mot de passe")
          console.log(err);
          }
        );
      },
    err => {
      this.toaster.error("L'ancien mot de passe n'est pas correcte","Modification")
      console.log(err);
      }
  );
  }

  ngOnInit(): void {
    this.authService.getFunctionalities(this.listfunctionalitiesInThisComponent) 
  }

}
