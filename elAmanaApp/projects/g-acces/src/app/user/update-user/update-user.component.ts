import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { User } from '../../Models/User';
import { AgenceService } from '../../services/agence.service';
import { DirectionService } from '../../services/direction.service';
import { RoleService } from '../../services/role.service';
import { TypeutilisateurService } from '../../services/typeutilisateur.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.scss']
})
export class UpdateUserComponent implements OnInit {

  constructor(public service:UserService, 
    public serviceRole:RoleService, 
    public toaster:ToastrService,
    public dialog:MatDialog,
    public datePipe: DatePipe,
    public ageService:AgenceService,
    public direcService:DirectionService, 
    public typeUtiService:TypeutilisateurService) { }
  confirmPasswordVar="";

  todayDate = this.datePipe.transform(new Date(),"dd-MM-yyyy")
  etatUser : any 

 

  resetForm(monForm:NgForm){
    monForm.form.reset();
    this.service.fromData = new User();
  }

  updateData(monForm:NgForm){
    if( this.service.fromData.utiTypeUtilisateur ==1 ){
      this.service.fromData.utiAgeIdAgence=1
    }
    if( this.service.fromData.utiTypeUtilisateur ==2 ){
      this.service.fromData.utiEmpIdDirection=1
      this.service.fromData.utiEmpMatricule=0
    }
    this.service.putUtilisateur().subscribe(
      res=>{
        this.resetForm(monForm);
        this.service.refreshComponent()
        this.toaster.info("Compte utilisateur modifié avec succès","Modification")
      },

      err => {
        this.toaster.error("Échec de modifier compte utilisateur","Modification")
        console.log(err);}
    );
  }

  onSubmit(monForm : NgForm){
      // Here we declare a new variable because the value obtained from option select has a type string which causes a problem with the funActive variable which is of type boolean so we must convert to a boolean function befor sending a request
      if(this.etatUser == "true"){
        this.service.fromData.utiEtat = true
      }
      if(this.etatUser == "false"){
        this.service.fromData.utiEtat = false
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

    this.service.getUtilisateur();
    this.serviceRole.getRole(); // calling this function allows us to display the roles in select options in the user's addition
    this.typeUtiService.getTypeUtilisateur();
    this.direcService.getDirection();
    this.ageService.getAgence();
  }

}
