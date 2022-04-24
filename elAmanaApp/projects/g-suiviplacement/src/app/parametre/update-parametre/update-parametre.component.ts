import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Parametre } from '../../Models/parametre';
import { ParametreService } from '../../services/parametre.service';

@Component({
  selector: 'app-update-parametre',
  templateUrl: './update-parametre.component.html',
  styleUrls: ['./update-parametre.component.scss']
})
export class UpdateParametreComponent implements OnInit {

  constructor(public paramService:ParametreService,public dialog:MatDialog, public toaster:ToastrService) { }

  ngOnInit(): void {}

  onSubmit(monForm:NgForm){
    this.paramService.putParametre().subscribe(
      res=>{
        this.resetForm(monForm);
        this.dialog.closeAll();
        this.paramService.getParametre();
        this.toaster.info("Paramètre modifié avec succès","Modification")
      },
      err => {
        this.toaster.error("Échec de modifier Paramètre","Modification")
        console.log(err);
      }
    );
  }
  resetForm(monForm:NgForm){
    monForm.form.reset();
    this.paramService.fromData = new Parametre();
  }
  closeDialog(){
    this.dialog.closeAll();
  }



}
