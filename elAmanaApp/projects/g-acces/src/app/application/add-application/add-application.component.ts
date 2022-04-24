import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Application } from '../../Models/Application';
import { ApplicationService } from '../../services/application.service';

@Component({
  selector: 'app-add-application',
  templateUrl: './add-application.component.html',
  styleUrls: ['./add-application.component.scss']
})
export class AddApplicationComponent implements OnInit {

  constructor(public appService:ApplicationService, public toaster:ToastrService, public dialog:MatDialog) { }
  
  insertData(monForm:NgForm){
    this.appService.postApplication().subscribe(
      res=>{
        this.resetForm(monForm);
        this.appService.refreshComponent()
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
    this.appService.fromData = new Application();
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
