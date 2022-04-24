import { LiveAnnouncer } from '@angular/cdk/a11y';
import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Module } from '../Models/Module';
import { ModuleService } from '../services/module.service';
import { AuthorizationWithoutRootService } from '../services/authorization-without-root.service';
import { AddModuleComponent } from './add-module/add-module.component';
import { UpdateModuleComponent } from './update-module/update-module.component';
import { ApplicationService } from '../services/application.service';
import { Application } from '../Models/Application';
import { Subject } from 'rxjs';
import { FonctionService } from '../services/fonction.service';

@Component({
  selector: 'app-module',
  templateUrl: './module.component.html',
  styleUrls: ['./module.component.scss']
})
export class ModuleComponent implements OnInit {

  listfunctionalitiesInThisComponent=["ajouter module","supprimer module","modifier module"] // WARNING: The name of functionalities in this list must be the same in the function table
  displayedColumns: string[] = ['modLibelle','modDescription','modApplication','updateButton','deleteButton'];
  dataSource:MatTableDataSource<any>;
  searchWord="" 
  filterDiv=""
  etatModule=true
  listapplication :Application[];



  constructor(public authService:AuthorizationWithoutRootService,
    public modService:ModuleService, 
    public dialog:MatDialog,
    public toaster:ToastrService,
    public datePipe: DatePipe,
    public _liveAnnouncer: LiveAnnouncer,
    public _MatPaginatorIntl: MatPaginatorIntl,
    public appService:ApplicationService,
    public fonService:FonctionService) {}

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator, { static: true } ) paginator :MatPaginator;
    
    onCreate(){
      this.dialog.open(AddModuleComponent,{
        maxHeight: '100vh'}
      );}
    
    populateForm(SelectedRecord:Module){
      this.modService.fromData=  Object.assign({},SelectedRecord);
      this.onUpdate();
    }
    
    onUpdate(){
      this.dialog.open(UpdateModuleComponent);
    }

    verifModuleBeforDeleting(idModule:number){
      var subject = new Subject<Boolean>();
      this.fonService.getFonction().subscribe(
        res=>{
          for(let item of res){
            if(item.fonIdModule == idModule && item.fonEtat == true){
              // true : Application have Active Module
              subject.next(true);
              return subject.asObservable()
            }
          }
          subject.next(false);
          return subject.asObservable();
        }
      )
      return subject.asObservable();     
    }

  onDelete(id:number){
    this.verifModuleBeforDeleting(id).subscribe(data => {        
      if (data==false){
        this.modService.deleteModule(id).subscribe(
          res=>{
            this.ngAfterViewInit()
            this.toaster.success("Supprimer avec succes","Suppression")
          },
          err => {
            this.toaster.error("Échec de suppression","Suppression")
            console.log(err);
            }
          );
        }
        else{
          this.toaster.error("Échec de la suppression, il y a des fonction actifs avec ce rôle")
        }
      })
    }

    
    ShowDiv(divVal: string) {
      this.filterDiv = divVal;
      this.etatModule=true
      // Display all Applications
      this.ngAfterViewInit()
    }
    
    search(functionSearchfor : NgForm){
      this.modService.getModuleSearch(
          functionSearchfor.value.libelle,
          functionSearchfor.value.etat,
          functionSearchfor.value.description,
          functionSearchfor.value.applicationId).subscribe(data=>{
            this.dataSource= new MatTableDataSource(data)
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
      });
    }
    
    announceSortChange(sortState: Sort) {
      if (sortState.direction) {
        this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
      } else {
        this._liveAnnouncer.announce('Sorting cleared');
      }
    }

    applyFilter($event:any){
      this.dataSource.filter=$event.target.value;
    }

    ngOnInit(): void {
      this.authService.getFunctionalities(this.listfunctionalitiesInThisComponent) 
      this.modService.getModule().subscribe(data=>{
      this.dataSource= new MatTableDataSource(data)
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    })
      this._MatPaginatorIntl.itemsPerPageLabel="Module par page" // Change text in Angular Material Paginator
      this.appService.getApplication().subscribe(res=>{
        this.listapplication=res as Application[]     
       })
     }

    ngAfterViewInit() {
        let listmodules: any = [ ];
        this.modService.getModule().subscribe(data=>{
          for(let item of data){
            if(item.modEtat==this.etatModule){
              listmodules.push(item)    
            }
          }
          this.dataSource= new MatTableDataSource(listmodules)
          //this.dataSource= new MatTableDataSource(data)
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
        })
      }

}
