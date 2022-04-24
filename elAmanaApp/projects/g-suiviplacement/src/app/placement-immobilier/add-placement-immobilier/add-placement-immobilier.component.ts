import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { placement } from '../../Models/placement';
import { DelegationService } from '../../services/delegation.service';
import { NavbarService } from '../../services/navbar.service';
import { PlacementService } from '../../services/placement.service';

@Component({
  selector: 'app-add-placement-immobilier',
  templateUrl: './add-placement-immobilier.component.html',
  styleUrls: ['./add-placement-immobilier.component.scss']
})
export class AddPlacementImmobilierComponent implements OnInit {



  OrgHasError=true;

  constructor(
    public delegS: DelegationService,
    public placementS : PlacementService,
    private dialog:MatDialog,
    public toaster:ToastrService,
    public navbarS : NavbarService,
  ) { }

  ngOnInit(): void {
    this.delegS.getDelegation();

  }
  closeDialog(monForm : NgForm){
    this.dialog.closeAll();
    this.resetForm(monForm)

  }

  insertData(monForm:NgForm){
    this.placementS.fromData.pla_id_sous_placement=5
  
     this.placementS.fromData.pla_id_fonds = Number(localStorage.getItem("typeFondId"))
    this.placementS.fromData.pla_id_typ_placement =Number(localStorage.getItem("typePlacementId"))

    this.placementS.postPlacement().subscribe(
      res=>{

        //this.resetForm(monForm);
        this.placementS.refreshComponent()
        this.toaster.success("Délégation ajoutée avec succès","Ajout")
      },
      err => {
        this.toaster.error("Échec d'ajouter Placement Compte : ","Ajout")
        console.log(err);
      }
    );
  }
   //select required
   ValidateOrg(value :any){
    if(value === 0){
    this.OrgHasError=true;
    }else {
      this.OrgHasError=false;
    }
  }

  onSubmit(monForm : NgForm){

    this.insertData(monForm)
    this.closeDialog(monForm)
    monForm.reset();
}
  resetForm(monForm:NgForm){
    monForm.form.reset();
    this.placementS.fromData = new placement();
  }

}

