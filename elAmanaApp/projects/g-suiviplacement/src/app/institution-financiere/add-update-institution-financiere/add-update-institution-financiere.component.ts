import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { organisme } from '../../Models/organisme';
import { OrganismeService } from '../../services/organisme.service';

@Component({
  selector: 'app-add-update-institution-financiere',
  templateUrl: './add-update-institution-financiere.component.html',
  styleUrls: ['./add-update-institution-financiere.component.scss']
})
export class AddUpdateInstitutionFinanciereComponent implements OnInit {

  constructor(public orgService:OrganismeService, public toaster:ToastrService, public dialog:MatDialog) { }
  ngOnInit(): void {
  }

  insertData(monForm:NgForm){
    this.orgService.postOrganisme().subscribe(
      res=>{
        this.resetForm(monForm);
        this.orgService.refreshComponent()
        this.toaster.success("Institution ajoutée avec succès","Ajout")
      },
      err => {
        this.toaster.error("Échec d'ajouter Institution : "+ err.error.message,"Ajout")
        console.log(err);
      }
    );
  }
  
  closeDialog(monForm : NgForm){ 
    this.dialog.closeAll();
    this.resetForm(monForm)
  }

  resetForm(monForm:NgForm){
    monForm.form.reset();
    this.orgService.fromData = new organisme();
  }

  onSubmit(monForm : NgForm){
    if (this.orgService.fromData.org_id ==0 ){
      //Insert
      this.insertData(monForm)
      this.closeDialog(monForm)
      monForm.reset();    
    }
    else{
      // Update
      this.updateData(monForm)
      this.closeDialog(monForm)
      monForm.reset();
    }
  }

  updateData(monForm:NgForm){
    this.orgService.putOrganisme().subscribe(
      res=>{
        this.resetForm(monForm);
        this.orgService.refreshComponent()
        this.toaster.info("Institution modifiée avec succès","Modification")
      },

      err => {
        this.toaster.error("Échec de modifier Institution","Modification")
        console.log(err);}
    );
  }



}
