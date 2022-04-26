import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { HistoriqueRealisation } from '../../Models/HistoriqueRealisation';
import { HistoriqueRealisationService } from '../../services/historique-realisation.service';

@Component({
  selector: 'app-update-historique-realisation',
  templateUrl: './update-historique-realisation.component.html',
  styleUrls: ['./update-historique-realisation.component.scss']
})
export class UpdateHistoriqueRealisationComponent implements OnInit {

  listAnnee:number[]=[]
  constructor(public hitstoRealisationService:HistoriqueRealisationService, 
    public toaster:ToastrService, 
    public dialog:MatDialog) { }

    updateData(monForm:NgForm){
      this.hitstoRealisationService.putHistoRealisation().subscribe(
        res=>{
          this.resetForm(monForm);
          this.hitstoRealisationService.refreshComponent()
          this.toaster.info("Montant modifié avec succès","Modification")
        },
  
        err => {
          this.toaster.error("Échec de modifier Montant","Modification")
          console.log(err);}
      );
    }
    closeDialog(monForm : NgForm){ 
      this.dialog.closeAll();
      this.resetForm(monForm)
    }
  
    resetForm(monForm:NgForm){
      monForm.form.reset();
      this.hitstoRealisationService.fromData = new HistoriqueRealisation();
    }
  
    onSubmit(monForm : NgForm){
      if (this.hitstoRealisationService.fromData.id_histo_rea !=0 ){
        this.updateData(monForm)
        this.closeDialog(monForm)
        monForm.reset(); 
      }
  }  

  ngOnInit(): void {
    let myDate = new Date();
    for(let i=2014; i<myDate.getFullYear()-1;i++){
      this.listAnnee.push(i)
    }
    
  }

}
