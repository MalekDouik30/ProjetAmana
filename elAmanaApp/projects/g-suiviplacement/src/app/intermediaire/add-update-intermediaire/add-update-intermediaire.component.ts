import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { intermediaireB } from '../../Models/intermediaireB';
import { IntermediaireBService } from '../../services/intermediaire-b.service';

@Component({
  selector: 'app-add-update-intermediaire',
  templateUrl: './add-update-intermediaire.component.html',
  styleUrls: ['./add-update-intermediaire.component.scss']
})
export class AddUpdateIntermediaireComponent implements OnInit {

  constructor(public intBService:IntermediaireBService, public toaster:ToastrService, public dialog:MatDialog) { }
  ngOnInit(): void {
  }

  insertData(monForm:NgForm){
    this.intBService.postInterBourse().subscribe(
      res=>{
        this.resetForm(monForm);
        this.intBService.refreshComponent()
        this.toaster.success("Intermediaire ajoutée avec succès","Ajout")
      },
      err => {
        this.toaster.error("Échec d'ajouter Intermediaire : "+ err.error.message,"Ajout")
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
    this.intBService.fromData = new intermediaireB();
  }

  onSubmit(monForm : NgForm){
    if (this.intBService.fromData.inB_id ==0 ){
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
    this.intBService.putInterBourse().subscribe(
      res=>{
        this.resetForm(monForm);
        this.intBService.refreshComponent()
        this.toaster.info("Intermediaire modifiée avec succès","Modification")
      },

      err => {
        this.toaster.error("Échec de modifier Intermediaire","Modification")
        console.log(err);}
    );
  }

}
