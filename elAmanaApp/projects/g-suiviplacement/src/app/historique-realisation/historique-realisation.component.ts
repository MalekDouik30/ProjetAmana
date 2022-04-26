import { LiveAnnouncer } from '@angular/cdk/a11y';
import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { HistoriqueRealisationService } from '../services/historique-realisation.service';
import { AuthorizationWithoutRootService } from 'projects/g-acces/src/app/services/authorization-without-root.service';
import { Subject } from 'rxjs';
import { AddHistoriqueRealisationComponent } from './add-historique-realisation/add-historique-realisation.component';
import { UpdateHistoriqueRealisationComponent } from './update-historique-realisation/update-historique-realisation.component';
import {HistoriqueRealisation} from '../Models/HistoriqueRealisation'
import { FormatNumberPipe } from 'projects/shared-project/src/app/Models/FormatNumber';

@Component({
  selector: 'app-historique-realisation',
  templateUrl: './historique-realisation.component.html',
  styleUrls: ['./historique-realisation.component.scss']
})
export class HistoriqueRealisationComponent implements OnInit {

  constructor(
    public dialog:MatDialog,
    public _liveAnnouncer: LiveAnnouncer,
    public _MatPaginatorIntl: MatPaginatorIntl,
    public histoRealisationService:HistoriqueRealisationService,
    public authService:AuthorizationWithoutRootService,
    public toaster:ToastrService,
    public formatNumber:FormatNumberPipe) { }

  

  listfunctionalitiesInThisComponent=["ajouter historique realisation","supprimer historique realisation","modifier historique realisation"]
  displayedColumns: string[] = ['montantTotalDepot','profitTotal','annee','updateButton','deleteButton'];
  dataSource:MatTableDataSource<any>;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator, { static: true } ) paginator :MatPaginator;

  

  onCreate(){
    this.dialog.open(AddHistoriqueRealisationComponent);
  }

  onDelete(SelectedRecord:HistoriqueRealisation){
    this.histoRealisationService.fromData=  Object.assign({},SelectedRecord);
    this.histoRealisationService.fromData.etat_histo_rea=false

    this.histoRealisationService.putHistoRealisation().subscribe(
      res=>{
        this.histoRealisationService.refreshComponent()
        this.toaster.success("Montant supprimé avec succès","Modification")
      },
      err => {
        this.toaster.error("Échec de suppression Montant","Modification")
        console.log(err);}
    );

  }
  onUpdate(){
    this.dialog.open(UpdateHistoriqueRealisationComponent);
  }

  onSelected(SelectedRecord:HistoriqueRealisation){
    this.histoRealisationService.fromData=  Object.assign({},SelectedRecord);
    this.onUpdate();
  }
  

  onSort(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
      }
    else {
      this._liveAnnouncer.announce('Sorting cleared');
      }
  }

  onFilter($event:any){
    this.dataSource.filter=$event.target.value;
  }
  
  ngOnInit(): void {
    this.authService.getFunctionalities(this.listfunctionalitiesInThisComponent) 
    this._MatPaginatorIntl.itemsPerPageLabel="Nombre de lignes par page"

    let listHistorique: any = [ ];
    this.histoRealisationService.getHistoRealisationResolver().subscribe(data=>{
    for(let item of data){
      if(item.etat_histo_rea==true){
        listHistorique.push(item)    
      }
    }
    this.dataSource= new MatTableDataSource(listHistorique)
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    })
   }

}
