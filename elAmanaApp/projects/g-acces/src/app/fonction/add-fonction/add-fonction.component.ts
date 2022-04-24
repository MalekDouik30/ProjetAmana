import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Application } from '../../Models/Application';
import { Fonction } from '../../Models/Fonction';
import { Module } from '../../Models/Module';
import { ApplicationService } from '../../services/application.service';
import { FonctionService } from '../../services/fonction.service';
import { ModuleService } from '../../services/module.service';

@Component({
  selector: 'app-add-fonction',
  templateUrl: './add-fonction.component.html',
  styleUrls: ['./add-fonction.component.scss']
})
export class AddFonctionComponent implements OnInit {

  listModule: Module[] 
  listModuleFilter: any=[];
  listApplication: Application[] 

  constructor(public fonService:FonctionService, 
    public toaster:ToastrService, 
    public dialog:MatDialog,
    public modService:ModuleService,
    public appService:ApplicationService) { }
  
  insertData(monForm:NgForm){
    console.log("88888888888888888888")
    console.log(this.fonService.fromData.fonLibelle)
    console.log(this.fonService.fromData.fonEtat)
    console.log(this.fonService.fromData.fonDescription)
    console.log(this.fonService.fromData.fonIdModule)
    this.fonService.postFonction().subscribe(
      res=>{
        this.resetForm(monForm);
        this.fonService.refreshComponent()
        this.toaster.success("Fonction ajouté avec succès","Ajout")
      },
      err => {
        this.toaster.error("Échec d'ajouter cette fonction : "+ err.error.message,"Ajout")
        console.log(err);
      }
    );
  }
  resetForm(monForm:NgForm){
    monForm.form.reset();
    this.fonService.fromData = new Fonction();
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


  onChange(deviceValue:any) {
    this.listModuleFilter=[];
    this.modService.getModule().subscribe(res=>{

      for(let i of this.listModule){
        if (i.modApplication == deviceValue.target.value ){
          this.listModuleFilter.push(i)
        }
      }
    })
}

  ngOnInit(): void {
  this.modService.getModule().subscribe(res=>{
    this.listModule = res as Module[]     
  })

  this.appService.getApplication().subscribe(res=>{
    this.listApplication = res as Application[]     
  })
  }

}
