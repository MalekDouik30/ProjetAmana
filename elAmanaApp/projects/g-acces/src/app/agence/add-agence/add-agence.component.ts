import { Component, OnInit } from '@angular/core';
import { AgenceService } from '../../services/agence.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { NgForm } from '@angular/forms';
import { Agence } from '../../Models/Agence';

@Component({
  selector: 'app-add-agence',
  templateUrl: './add-agence.component.html',
  styleUrls: ['./add-agence.component.scss']
})
export class AddAgenceComponent implements OnInit {

  constructor(public ageService:AgenceService, public toaster:ToastrService, public dialog:MatDialog) { }
  
  insertData(monForm:NgForm){
    this.ageService.postAgence().subscribe(
      res=>{
        this.resetForm(monForm);
        this.ageService.refreshComponent()
        this.toaster.success("Agence ajouté avec succès","Ajout")
      },

      err => {
        this.toaster.error("Échec d'ajouter cette agence : "+ err.error.message,"Ajout")
        console.log(err);
      }
    );
  }
  
  resetForm(monForm:NgForm){
    monForm.form.reset();
    this.ageService.fromData = new Agence();
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
  }

}
