import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Module } from '../../Models/Module';
import { ModuleService } from '../../services/module.service';
import { ApplicationService } from '../../services/application.service';
import { Application } from '../../Models/Application';

@Component({
  selector: 'app-add-module',
  templateUrl: './add-module.component.html',
  styleUrls: ['./add-module.component.scss']
})
export class AddModuleComponent implements OnInit {

  listapplication: Application[] 
  constructor(public modService:ModuleService, 
    public toaster:ToastrService, 
    public dialog:MatDialog,
    public appService:ApplicationService) { }
  
  insertData(monForm:NgForm){
    this.modService.postModule().subscribe(
      res=>{
        this.resetForm(monForm);
        this.modService.refreshComponent()
        this.toaster.success("Application ajouté avec succès","Ajout")
      },

      err => {
        this.toaster.error("Échec d'ajouter cette application : "+ err.error.message,"Ajout")
        console.log(err);
      }
    );
  }
  
  resetForm(monForm:NgForm){
    monForm.form.reset();
    this.modService.fromData = new Module();
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

  this.appService.getApplication().subscribe(res=>{
    this.listapplication=res as Application[]     
  })

  }

}
