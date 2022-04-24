import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Application } from '../../Models/Application';
import { Module } from '../../Models/Module';
import { ApplicationService } from '../../services/application.service';
import { ModuleService } from '../../services/module.service';

@Component({
  selector: 'app-update-module',
  templateUrl: './update-module.component.html',
  styleUrls: ['./update-module.component.scss']
})
export class UpdateModuleComponent implements OnInit {

  listapplication: Application[] 
  etatModule:any
  constructor(public modService:ModuleService,
    public toaster:ToastrService,
    public dialog:MatDialog,
    public appService:ApplicationService) { }

  etatApplication:any

  resetForm(monForm:NgForm){
    monForm.form.reset();
    this.modService.fromData = new Module();
  }

  updateData(monForm:NgForm){

    this.modService.putModule().subscribe(
      res=>{
        this.resetForm(monForm);
        this.modService.refreshComponent()
        this.toaster.info("Module modifié avec succès","Modification")
      },

      err => {
        this.toaster.error("Échec de modifier ce module","Modification")
        console.log(err);}
    );
  }

  onSubmit(monForm : NgForm){
    if (this.etatModule=="true"){
      this.modService.fromData.modEtat=true
    }
    if (this.etatModule=="false"){
      this.modService.fromData.modEtat=false

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
    this.appService.getApplication().subscribe(res=>{
      this.listapplication=res as Application[]     
    })
  }

}
