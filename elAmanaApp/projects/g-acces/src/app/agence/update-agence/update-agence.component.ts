import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Agence } from '../../Models/Agence';
import { AgenceService } from '../../services/agence.service';

@Component({
  selector: 'app-update-agence',
  templateUrl: './update-agence.component.html',
  styleUrls: ['./update-agence.component.scss']
})
export class UpdateAgenceComponent implements OnInit {

  constructor(
    public ageService:AgenceService,
    public toaster:ToastrService,
    public dialog:MatDialog) { }

  etatAgence:any
  identifiedUserLogin:string

  resetForm(monForm:NgForm){
    monForm.form.reset();
    this.ageService.fromData = new Agence();
  }

  updateData(monForm:NgForm){

    this.ageService.putAgence().subscribe(
      res=>{
        this.resetForm(monForm);
        this.ageService.refreshComponent()
        this.toaster.info("Agence modifiée avec succès","Modification")
      },

      err => {
        this.toaster.error("Échec de modifier agence","Modification")
        console.log(err);}
    );
  }

  onSubmit(monForm : NgForm){
      // Here we declare a new variable because the value obtained from option select has a type string which causes a problem with the funActive variable which is of type boolean so we must convert to a boolean function befor sending a request
      if(this.etatAgence == "true"){
        this.ageService.fromData.ageEtat = true
      }
      if(this.etatAgence == "false"){
        this.ageService.fromData.ageEtat = false
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
  }




}
