import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { PlacementService } from '../../services/placement.service';

@Component({
  selector: 'app-add-action-gratuite',
  templateUrl: './add-action-gratuite.component.html',
  styleUrls: ['./add-action-gratuite.component.scss']
})
export class AddActionGratuiteComponent implements OnInit {

  totalActionVar=0
  constructor(public dialog:MatDialog, 
    public toaster:ToastrService,
    public plaService:PlacementService) { }

  ngOnInit(): void {

    this.totalActionVar=this.plaService.fromData.pla_nbre_action_gratuite + this.plaService.fromData.pla_nbr_action
  }



  closeDialog(monForm : NgForm){ 
    this.dialog.closeAll();
    //this.resetForm(monForm)
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

  resetForm(monForm:NgForm){
    monForm.form.reset();
   // this.intBService.fromData = new intermediaireB();
  }


  TotalAction(){
    this.totalActionVar=this.plaService.fromData.pla_nbre_action_gratuite + this.plaService.fromData.pla_nbr_action

  }

}
