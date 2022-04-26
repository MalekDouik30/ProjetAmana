import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { HistoriqueRealisation } from '../../Models/HistoriqueRealisation';
import { HistoriqueRealisationService } from '../../services/historique-realisation.service';

@Component({
  selector: 'app-add-historique-realisation',
  templateUrl: './add-historique-realisation.component.html',
  styleUrls: ['./add-historique-realisation.component.scss']
})
export class AddHistoriqueRealisationComponent implements OnInit {

  listAnnee:number[]=[]
  constructor(public hitstoRealisationService:HistoriqueRealisationService, 
    public toaster:ToastrService, 
    public dialog:MatDialog) { }

    insertData(monForm:NgForm){
      this.hitstoRealisationService.postHistoRealisation().subscribe(
        res=>{
          this.resetForm(monForm);
          this.hitstoRealisationService.refreshComponent()
          this.toaster.success("Montant ajouté avec succès","Ajout")
        },
        err => {
          this.toaster.error("Échec d'ajouter Montant : "+ err.error.message,"Ajout")
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
      this.hitstoRealisationService.fromData = new HistoriqueRealisation();
    }
  
    onSubmit(monForm : NgForm){
      if (this.hitstoRealisationService.fromData.id_histo_rea ==0 ){
        //Insert
        this.hitstoRealisationService.fromData.etat_histo_rea=true
        this.insertData(monForm)
        this.closeDialog(monForm)
        monForm.reset();    
      }
  }  

  ngOnInit(): void {
    let myDate = new Date();
    for(let i=2014; i<=myDate.getFullYear()-1;i++){
      this.listAnnee.push(i)
    }
    
  }

}
