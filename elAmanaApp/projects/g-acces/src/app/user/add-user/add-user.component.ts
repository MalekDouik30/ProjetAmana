import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { RoleService } from '../../services/role.service';
import {MatDialog} from '@angular/material/dialog';
import { NgForm } from '@angular/forms';
import { User } from '../../Models/User';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { TypeutilisateurService } from '../../services/typeutilisateur.service';
import { DirectionService } from '../../services/direction.service';
import { AgenceService } from '../../services/agence.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {

  constructor(
    public ageService:AgenceService,
    public direcService:DirectionService, 
    public typeUtiService:TypeutilisateurService, 
    public service:UserService, 
    public serviceRole:RoleService, 
    public toaster:ToastrService, 
    private dialog:MatDialog, 
    public datePipe: DatePipe) { }
  confirmPasswordVar="";
  todayDate = this.datePipe.transform(new Date(),"dd-MM-yyyy")
  etatUser : any 

  insertData(monForm:NgForm){
    let date = new Date()
    this.service.fromData.utiDateCreation = this.datePipe.transform(date,"yyyy-MM-dd")||'{}';
    this.service.fromData.utiNbeEchecAuthentification=0
    this.service.fromData.utiEtat=true

    if (this.service.fromData.utiTypeUtilisateur==1){
      //Direction
      this.service.fromData.utiAgeIdAgence=0
    }
    if (this.service.fromData.utiTypeUtilisateur==2){
      // Agence
      this.service.fromData.utiEmpIdDirection=0
      this.service.fromData.utiEmpMatricule=0
    }

    if (this.service.fromData.utiRole==0){ 
      this.service.fromData.utiRole=1
    }
    this.service.postUtilisateur().subscribe(
      res=>{
        this.resetForm(monForm);
        this.service.refreshComponent()
        this.service.getUtilisateur();
        this.toaster.success("Compte utilisateur ajouté avec succès","Ajout")
      },

      err => {
        this.toaster.error("Échec d'ajouter compte utilisateur : "+ err.error.message,"Ajout")
        console.log(err);
      }
    );
  }
  resetForm(monForm:NgForm){
    monForm.form.reset();
    this.service.fromData = new User();
  }
  onSubmit(monForm : NgForm){

      this.insertData(monForm)
      this.closeDialog(monForm)
      monForm.reset();    
  }
  closeDialog(monForm : NgForm){ 
    this.dialog.closeAll();
    this.resetForm(monForm)
  }
  ngOnInit(): void {
    this.service.getUtilisateur();
    this.serviceRole.getRole(); // calling this function allows us to display the roles in select options in the user's addition
    this.typeUtiService.getTypeUtilisateur();
    this.direcService.getDirection();
    this.direcService.getDirection();
    this.ageService.getAgence();

  }

}
