import { Component, OnInit ,ViewChild} from '@angular/core';
import { AddPlacementImmobilierComponent } from './add-placement-immobilier/add-placement-immobilier.component';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';
import { placement } from '../Models/placement';
import { FormControl, NgForm } from '@angular/forms';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PlacementService } from '../services/placement.service';
import { MatTableExporterDirective } from 'mat-table-exporter';
import { delegation } from '../Models/delegation';
import { DelegationService } from '../services/delegation.service';
import * as XLSX from "xlsx"

@Component({
  selector: 'app-placement-immobilier',
  templateUrl: './placement-immobilier.component.html',
  styleUrls: ['./placement-immobilier.component.scss']
})
export class PlacementImmobilierComponent implements OnInit {
  private _liveAnnouncer: any;
  options: any;

  constructor(
    public dialog:MatDialog,
    public plaService:PlacementService,
    public delegationService:DelegationService,
    public placementService:PlacementService,
    public _MatPaginatorIntl: MatPaginatorIntl,
    ) { }


    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator, { static: true } ) paginator :MatPaginator;
    @ViewChild(MatTableExporterDirective) matTableExporter: MatTableExporterDirective;
    
    listfunctionalitiesInThisComponent=["ajouter delegation","modifier delegation","modifier delegation"] // WARNING: The name of functionalities in this list must be the same in the function table
    typeFondId=0
    typePlacementId=0
    displayedColumns: string[] ;
    dataSource:MatTableDataSource<any>;

  ngOnInit(): void {
    this.typeFondId= Number(localStorage.getItem("typeFondId"))
    this.typePlacementId=Number(localStorage.getItem("typePlacementId"))

    this._MatPaginatorIntl.itemsPerPageLabel="Placement par page"
    this.delegationService.getDelegation()

    let listplacement: any = [ ];
    this.plaService.getPlacementResolver().subscribe(data=>{
      for(let item of data){
        if( item.pla_id_fonds == this.typeFondId && item.pla_id_typ_placement== this.typePlacementId){ 
          listplacement.push(item)
          this.displayedColumns = ["pla_delegation","pla_prix_Aqui","pla_mont_inve"]
        }
      }
      this.dataSource= new MatTableDataSource(listplacement)
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    })

  }

  onCreate(){
    // Popup Ajouter Placement
    this.dialog.open(AddPlacementImmobilierComponent,{
      maxHeight:"100vh"
    })
  }

  
  applyFilter($event:any){
    // Filtre recherche Angular material
    this.dataSource.filter=$event.target.value;

  }

  announceSortChange(sortState: Sort) {
    // Tri Angular material table
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  ngAfterViewInit() {
    let listplacement: any = [ ];
    this.plaService.getPlacementResolver().subscribe(data=>{
      for(let item of data){
        if( item.pla_id_fonds == this.typeFondId && item.pla_id_typ_placement== this.typePlacementId){ 
          listplacement.push(item)
          this.displayedColumns = ["pla_delegation","pla_montant_depot","pla_mont_inve"]
        }
      }
      this.dataSource= new MatTableDataSource(listplacement)
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    })

  }

  importAsXlsx(fileName:string){
    this.matTableExporter.exportTable('xlsx', {fileName:fileName, sheet: 'sheet_name'});
  }



}
