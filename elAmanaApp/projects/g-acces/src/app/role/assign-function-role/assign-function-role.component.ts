import { Component, OnInit,Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FonctionService } from '../../services/fonction.service';
import { NgForm } from '@angular/forms';
import { Role } from '../../Models/Role';
import { ToastrService } from 'ngx-toastr';
import { RoleFonctionService } from '../../services/role-fonction.service';
import { RoleFonction } from '../../Models/RoleFonction';
import { Fonction } from '../../Models/Fonction';
import { ModuleService } from '../../services/module.service';
import { ApplicationService } from '../../services/application.service';
import { Application } from '../../Models/Application';
import { Module } from '../../Models/Module';
import { RoleApplicationService } from '../../services/role-application.service';


@Component({
  selector: 'app-assign-function-role',
  templateUrl: './assign-function-role.component.html',
  styleUrls: ['./assign-function-role.component.scss']
})
export class AssignFunctionRoleComponent implements OnInit {

  role: any;
  counteur=0
  isChecked = false; 
  searchWord=""
  constructor(public serviceRA:RoleApplicationService,
    public serviceRF:RoleFonctionService,
    public fonService:FonctionService,
    public modService:ModuleService,
    public appService:ApplicationService,
    public toaster:ToastrService,
    public dialog:MatDialog,
    @Inject(MAT_DIALOG_DATA) public data:AssignFunctionRoleComponent  ) { }

    listApplications:Application[]
    listModules:Module[]
    listFonction:Fonction[]


  onSubmit(monForm:NgForm){
    monForm.value.fonId = Number(monForm.value.fonId) // Convert select option.value from string to int
    this.serviceRF.fromData.rolId=monForm.value.rolId
  
      this.serviceRF.postRoleFonction().subscribe(
        res=>{
          this.resetForm(monForm);
          this.serviceRF.getRoleFonction(this.data.role.idRole).then(data => console.log(data));// to Refresh after adding 
          //this.toaster.success("Fonction ajoutée avec succès ","Fonction")
        },
        err => {
          //this.toaster.error("Échec de l'ajout de la fonction ","Fonction")
          console.log(err);}
      );
    }

    onDelete(idRole:number,idFonction:number){
      this.serviceRF.deleteRoleFonction(idRole,idFonction).subscribe(
        res=>{
          this.serviceRF.getRoleFonction(this.data.role.idRole).then(data => console.log(data));
          // notification
          //this.toaster.success("Supprimer avec succes","Fonction")
        },
        err => {
          // notification
          //this.toaster.error("Échec de suppression","Error")
          console.log(err);
        });
      }
  
    resetForm(monForm:NgForm){
      monForm.form.reset();
      this.serviceRF.fromData = new RoleFonction();
    }
    verificationCheked(idFonction:number){  
      for(let  item of this.serviceRF.listrolefonction){
        if (idFonction == item.fonId){
          return true
        }
      }
        return false
     }
    checkCheckBoxvalue(event: { checked: any; }, fonId:number){
      var rolId = this.data.role.idRole

      this.serviceRF.fromData.rolId = rolId
      this.serviceRF.fromData.fonId = fonId


    if (event.checked == true ){
      //Assign role to function
      this.serviceRF.postRoleFonction().subscribe(
        res=>{
          //this.toaster.success("Fonction ajoutée avec succès ","Fonction")
        },
        err => {
          // notification
          //this.toaster.error("Échec de suppression","Error")
          console.log(err);
        });
    } 
    
    if (event.checked == false ){
       //Delete role from function
       this.onDelete(rolId,fonId)
    } 
  }

  
  closeDialog(){ 
    this.dialog.closeAll();
  }

  ngOnInit(): void {
  this.fonService.getFonction().subscribe(res=>{this.listFonction =res as Fonction[]})
  this.fonService.geFonction2()
  this.serviceRF.getRoleFonction(this.data.role.idRole).then(data => console.log(data)); // Affichage Role-Fonction  
  this.appService.getApplication().subscribe(res=> {this.listApplications = res as Application[]})
  this.modService.getModule().subscribe(res=> {this.listModules = res as Module[]})
  this.serviceRA.getRoleApplication(this.data.role.idRole).then(data => console.log(data)); // Affichage Role-Fonction  

  }

  /****************************************************************** */
  // Module
  verifModulechecked(idModule:Number){
    // to verif if check box is cheked or not on opning the component
    let fonctionarray=[]
    let verifExist=[]
    for(let f of this.listFonction){
      if (f.fonIdModule == idModule ){
        fonctionarray.push(f.fonId)
      }
    }
    for(let f of fonctionarray){
       if(this.serviceRF.listrolefonction.some(rf => rf.fonId == f && rf.rolId == this.data.role.idRole)){
        verifExist.push(true)
       }
    }
    if(verifExist.length == fonctionarray.length ){
      return true
    }
    return false
  } 

  checkModuleCheckBoxvalue(event: { checked: any; },idModule:Number){
    // to add or delet on clicking on checkbox
    if (event.checked == true ){
      for(let f of this.listFonction){
        if (f.fonIdModule === idModule ){
          this.serviceRF.fromData.rolId = this.data.role.idRole
          this.serviceRF.fromData.fonId=f.fonId
          this.serviceRF.postRoleFonction().subscribe(
            res=>{
              this.serviceRF.getRoleFonction(this.data.role.idRole)
              //this.toaster.success("Fonction ajoutée avec succès ","Fonction")
            },
            err => {
              //this.toaster.error("Échec de suppression","Error")
              console.log(err);
            });
        }
      }
    }
    if (event.checked == false ){
      for(let f of this.fonService.listfonction){
        if (f.fonIdModule === idModule ){
          this.onDelete(this.data.role.idRole,f.fonId)
        }
      }     
   }
  }
/****************************************************************** */
// Application
verifAppchecked(idApplication:Number){
  for(let  item of this.serviceRA.listroleApplication){
    if (idApplication == item.appId && this.data.role.idRole == item.rolId ){
      return true
    }
  }
    return false
}

checkAppCheckBoxvalue(event: { checked: any; },idApp:number){

  this.serviceRA.fromData.rolId = this.data.role.idRole
  this.serviceRA.fromData.appId = idApp

  if (event.checked == true ){
    //Assign role to function
    this.serviceRA.postRoleApplication().subscribe(
      res=>{
       // this.toaster.success("Application ajoutée avec succès ","Fonction")
      },
      err => {
        // notification
        //this.toaster.error("Échec de d'ajouter cette application","Error")
        console.log(err);
      });
  } 
  
  if (event.checked == false ){
     this.serviceRA.deleteRoleApplication(this.data.role.idRole,idApp).subscribe(
      res=>{
        let listfunction:any=[]
        for(let item of this.listModules){
          if (idApp == item.modApplication){ 
            for (let item2 of this.listFonction){
              if(item2.fonIdModule == item.modId ){
                listfunction.push(item2.fonId)
              }
            }
          }
        }
        // Delete function in Application when removing application
        for (let item of listfunction){
          this.onDelete(this.data.role.idRole,item)
        }
        this.serviceRA.getRoleApplication(this.data.role.idRole);
        this.serviceRF.getRoleFonction(this.data.role.idRole);

        //this.toaster.success("Supprimer avec succes","Fonction")
      },
      err => {
        //this.toaster.error("Échec de suppression","Error")
        console.log(err);
      });
  } 
}

}
