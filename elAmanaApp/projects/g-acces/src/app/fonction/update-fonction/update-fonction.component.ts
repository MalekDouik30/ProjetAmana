import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Module } from '../../Models/Module';
import { Fonction } from '../../Models/Fonction';
import { FonctionService } from '../../services/fonction.service';

import { ModuleService } from '../../services/module.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-update-fonction',
  templateUrl: './update-fonction.component.html',
  styleUrls: ['./update-fonction.component.scss']
})
export class UpdateFonctionComponent implements OnInit {

  constructor(
    public fonService:FonctionService,
    public toaster:ToastrService,
    public dialog:MatDialog,
    public modService:ModuleService,
    public userService:UserService) { }

  listmodule: Module[] 
  etatFonction:any

  displayVerifPaswd=true
  displayUpdateFunction=false
  identifiedUserLogin:string

  resetForm(monForm:NgForm){
    monForm.form.reset();
    this.fonService.fromData = new Fonction();
  }

  onSubmit(monForm : NgForm){
    this.updateData(monForm)
    this.closeDialog(monForm)
    monForm.reset();
}

  updateData(monForm:NgForm){
    if (this.etatFonction=="true"){
      this.fonService.fromData.fonEtat=true
    }
    if (this.etatFonction=="false"){
      this.fonService.fromData.fonEtat=false
    }   
    this.fonService.putFonction().subscribe(
      res=>{
        this.resetForm(monForm);
        this.modService.refreshComponent()
        this.toaster.info("Fonction modifiée avec succès","Modification")
      },

      err => {
        this.toaster.error("Échec de modifier cette fonction","Modification")
        console.log(err);}
    );
  }

  closeDialog(monForm : NgForm){
    monForm.reset();
    this.dialog.closeAll();
  }

  
  ngOnInit(): void {
    this.modService.getModule().subscribe(res=>{
      this.listmodule=res as Module[]     
    })
    this.identifiedUserLogin=this.userService.getUserLoginInformation().decodedLogin
  }

  onSubmitVerifPswd(monForm : NgForm){
    this.userService.verifPassword(this.identifiedUserLogin,this.userService.fromData.utiMotPasse).subscribe( 
      res=>{
        this.displayVerifPaswd=false
        this.displayUpdateFunction=true
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













