import { LiveAnnouncer } from '@angular/cdk/a11y';
import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginatorIntl, MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Fonction } from '../Models/Fonction';
import { AuthorizationWithoutRootService } from '../services/authorization-without-root.service';
import { FonctionService } from '../services/fonction.service';
import { ModuleService } from '../services/module.service';
import { AddFonctionComponent } from './add-fonction/add-fonction.component';
import { UpdateFonctionComponent } from './update-fonction/update-fonction.component';
import { Module } from '../Models/Module';
import { ApplicationService } from '../services/application.service';
import { Application } from '../Models/Application';
import { SharedService } from 'projects/shared-project/shared/shared.service';

@Component({
  selector: 'app-fonction',
  templateUrl: './fonction.component.html',
  styleUrls: ['./fonction.component.scss']
})
export class FonctionComponent implements OnInit {

  listfunctionalitiesInThisComponent=["ajouter fonction","supprimer fonction","modifier fonction"] // WARNING: The name of functionalities in this list must be the same in the function table
  displayedColumns: string[] = ['fonLibelle','fonDescription','fonIdModule','fonApplication','updateButton','deleteButton'];
  dataSource:MatTableDataSource<any>;
  searchWord="" 
  filterDiv=""
  functionSearchfor : Function
  listeModule :Module[];
  listeApplication :Application[];
  etatFonction=true;
  dataToExport:any;


constructor(public authService:AuthorizationWithoutRootService,
  public fonservice:FonctionService, 
  public dialog:MatDialog,
  public toaster:ToastrService,
  public datePipe: DatePipe,
  public _liveAnnouncer: LiveAnnouncer,
  public _MatPaginatorIntl: MatPaginatorIntl,
  public modService:ModuleService,
  public appService:ApplicationService,
  public sharedService:SharedService ) {}

@ViewChild(MatSort) sort: MatSort;
@ViewChild(MatPaginator, { static: true } ) paginator :MatPaginator;

onCreate(){
  this.dialog.open(AddFonctionComponent,{
    maxHeight: '100vh',    
});
}

populateForm(SelectedRecord:Fonction){
  this.fonservice.fromData=  Object.assign({},SelectedRecord);
  this.onUpdate();
}

onUpdate(){
  this.dialog.open(UpdateFonctionComponent);
}

onDelete(id:number){
  this.fonservice.deleteFonction(id).subscribe(
    res=>{
      this.ngAfterViewInit()
      // notification
      this.toaster.success("Supprimer avec succes","Suppression")
    },
    err => {
      // notification
      this.toaster.error("Échec de suppression","Suppression")
      console.log(err);
    }
  );
}

ShowDiv(divVal: string) {
    this.filterDiv = divVal;
    // Display all fonctions
    this.ngAfterViewInit()
  }

search(functionSearchfor : NgForm){
    this.fonservice.getFonctionSearch(
      functionSearchfor.value.libelle,
      functionSearchfor.value.description,
      functionSearchfor.value.etat,
      functionSearchfor.value.moduleName).subscribe(data=>{
        this.dataSource= new MatTableDataSource(data)
        this.dataToExport=data
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      });
      //functionSearchfor.form.reset()
  }

announceSortChange(sortState: Sort) {
  if (sortState.direction) {
    this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
  } else {
    this._liveAnnouncer.announce('Sorting cleared');
  }
}
 // Serach Function : Angular Material Table Filter
applyFilter($event:any){
  this.dataSource.filter=$event.target.value;
}
  ngOnInit(): void {
    this.authService.getFunctionalities(this.listfunctionalitiesInThisComponent) 
    this.fonservice.getFonction().subscribe(data=>{
      this.dataToExport=data
      this.dataSource= new MatTableDataSource(data)
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    })
  // this.listFonction = this.route.snapshot.data.listfonctions; // Resolver
  // this.dataSource= new MatTableDataSource(this.listFonction)
    this._MatPaginatorIntl.itemsPerPageLabel="Fonctions par page"

    this.modService.getModule().subscribe(res=>{
      this.listeModule=res as Module[]
    })
    this.appService.getApplication().subscribe(res=>{
      this.listeApplication=res as Application[]
    })
    
 }
  
ngAfterViewInit() {
  let listfonction: any = [ ];
  this.fonservice.getFonction().subscribe(data=>{
    for(let item of data){
      if(item.fonEtat==this.etatFonction){
        listfonction.push(item)    
      }
    }
      this.dataSource= new MatTableDataSource(listfonction)
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    })
}

exportAsExcel() {
  var header =['',''] 
  this.sharedService.exportToExcel("Fonction.xlsx",this.dataToExport,header)
}


}
