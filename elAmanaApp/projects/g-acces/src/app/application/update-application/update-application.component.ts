import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ApplicationService } from '../../services/application.service';
import { Application } from '../../Models/Application';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-update-application',
  templateUrl: './update-application.component.html',
  styleUrls: ['./update-application.component.scss']
})
export class UpdateApplicationComponent implements OnInit {

  constructor(
    public appService:ApplicationService,
    public toaster:ToastrService,
    public dialog:MatDialog,
    public userService:UserService) { }

  etatApplication:any
  displayVerifPaswd=true
  displayUpdateApplication=false
  identifiedUserLogin:string

  resetForm(monForm:NgForm){
    monForm.form.reset();
    this.appService.fromData = new Application();
  }

  updateData(monForm:NgForm){

    this.appService.putApplication().subscribe(
      res=>{
        this.resetForm(monForm);
        this.appService.refreshComponent()
        this.toaster.info("Application modifiée avec succès","Modification")
      },

      err => {
        this.toaster.error("Échec de modifier application","Modification")
        console.log(err);}
    );
  }

  onSubmit(monForm : NgForm){
      // Here we declare a new variable because the value obtained from option select has a type string which causes a problem with the funActive variable which is of type boolean so we must convert to a boolean function befor sending a request
      if(this.etatApplication == "true"){
        this.appService.fromData.appEtat = true
      }
      if(this.etatApplication == "false"){
        this.appService.fromData.appEtat = false
      }
      // update User
      this.updateData(monForm)
      this.closeDialog(monForm)
      // cleaning the form
      monForm.reset();
  }

  closeDialog(monForm : NgForm){
    monForm.reset();
    this.dialog.closeAll();
  }


  ngOnInit(): void {
    this.identifiedUserLogin=this.userService.getUserLoginInformation().decodedLogin

  }

  onSubmitVerifPswd(monForm : NgForm){
    this.userService.verifPassword(this.identifiedUserLogin,this.userService.fromData.utiMotPasse).subscribe( 
      res=>{
        this.displayVerifPaswd=false
        this.displayUpdateApplication=true
      },
      err=>{
        this.toaster.error("Le mot de passe n'est pas correct, veuillez réessayer","Vérification")
        console.log(err);
      }
    )
  }
  closeDialog2(monForm : NgForm){
    monForm.reset();
    this.dialog.closeAll();
  }

}
