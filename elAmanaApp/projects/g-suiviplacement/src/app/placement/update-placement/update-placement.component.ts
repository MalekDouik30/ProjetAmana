import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { placement } from '../../Models/placement';
import { PlacementService } from '../../services/placement.service';

@Component({
  selector: 'app-update-placement',
  templateUrl: './update-placement.component.html',
  styleUrls: ['./update-placement.component.scss']
})
export class UpdatePlacementComponent implements OnInit {

  constructor(
    public dialog:MatDialog,
    public plaService:PlacementService,
    public toaster:ToastrService) { }

    countChangeMontRachat=0

    choixUpdate=1

  ngOnInit(): void {

  }

  closeDialog(monForm : NgForm){ 
    this.dialog.closeAll();
    this.resetForm(monForm)
  }

  resetForm(monForm:NgForm){
    monForm.form.reset();
    this.plaService.fromData = new placement();
  }
  updateData(monForm:NgForm){

    this.plaService.putPlacement().subscribe(
      res=>{
        this.resetForm(monForm);
        this.plaService.refreshComponent()
        this.toaster.info("Placement Racheté","Modification")
      },

      err => {
        this.toaster.error("Échec de Rachat","Modification")
        console.log(err);}
    );

  }
  onSubmit(monForm : NgForm){
        this.updateData(monForm)
        this.closeDialog(monForm)
        monForm.reset();
  }

  calculRachat(){
    this.countChangeMontRachat=this.countChangeMontRachat+1
    if(this.countChangeMontRachat == 1 && this.plaService.fromData.pla_montant_rachat!=null){
        this.plaService.fromData.pla_montant_avant_rachat = this.plaService.fromData.pla_montant_depot
      }


      this.plaService.fromData.pla_montant_depot = this.plaService.fromData.pla_montant_avant_rachat - this.plaService.fromData.pla_montant_rachat

      if(this.plaService.fromData.pla_montant_depot == 0){
        this.plaService.fromData.pla_etat = "rachat total"
      }


      if(this.plaService.fromData.pla_montant_depot < 0){
        this.plaService.fromData.pla_montant_depot =0
      }

      if(this.plaService.fromData.pla_montant_depot!=0){
        this.plaService.fromData.pla_etat = "rachat partiel"
      }

      
      if(this.plaService.fromData.pla_montant_rachat==0 || this.plaService.fromData.pla_montant_rachat == null){
        this.plaService.fromData.pla_etat = "en cours"
      }
    }

  



    

  }


