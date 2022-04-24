import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Parametre } from '../../Models/Parametre';
import { ParametreService } from '../../services/parametre.service';

@Component({
  selector: 'app-update-parameter',
  templateUrl: './update-parameter.component.html',
  styleUrls: ['./update-parameter.component.scss']
})
export class UpdateParameterComponent implements OnInit {

  constructor(public paramService:ParametreService,public dialog:MatDialog, public toaster:ToastrService) { }
  
  ngOnInit(): void {}

  onSubmit(monForm:NgForm){
    this.paramService.putParametre().subscribe(
      res=>{
        this.resetForm(monForm);
        this.dialog.closeAll();
        this.paramService.getParametres();
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

  generatePassword(){
    var randPasswordPart1 = Array(10).fill("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxy").map(function(x) { return x[Math.floor(Math.random() * x.length)] }).join('');
    var randPasswordPart2 = Array(2).fill("!@#$&*").map(function(x) { return x[Math.floor(Math.random() * x.length)] }).join('');
    var randPasswordPart3 = Array(2).fill("0123456789").map(function(x) { return x[Math.floor(Math.random() * x.length)] }).join('');
    this.paramService.fromData.parMotPasseDefaut = randPasswordPart1+randPasswordPart2+randPasswordPart3
  }

}
