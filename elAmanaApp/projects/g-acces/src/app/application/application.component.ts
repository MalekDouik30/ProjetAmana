import { LiveAnnouncer } from '@angular/cdk/a11y';
import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from 'projects/shared-project/shared/shared.service';
import { Subject } from 'rxjs';
import { Application } from '../Models/Application';
import { ApplicationService } from '../services/application.service';
import { AuthorizationWithoutRootService } from '../services/authorization-without-root.service';
import { ModuleService } from '../services/module.service';
import { AddApplicationComponent } from './add-application/add-application.component';
import { UpdateApplicationComponent } from './update-application/update-application.component';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.scss']
})
export class ApplicationComponent implements OnInit {

  listfunctionalitiesInThisComponent=["ajouter application","supprimer application","modifier application"] // WARNING: The name of functionalities in this list must be the same in the function table
  displayedColumns: string[] = ['appLibelle','appDescription','updateButton','deleteButton'];
  dataSource:MatTableDataSource<any>;
  searchWord="" 
  filterDiv=""
  functionSearchfor : Function
  etatapplication=true
  dataToExport:any;

  constructor(public authService:AuthorizationWithoutRootService,
    public appService:ApplicationService, 
    public modService:ModuleService,
    public dialog:MatDialog,
    public toaster:ToastrService,
    public datePipe: DatePipe,
    public _liveAnnouncer: LiveAnnouncer,
    public _MatPaginatorIntl: MatPaginatorIntl,
    public sharedService:SharedService) {}

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator, { static: true } ) paginator :MatPaginator;
    
    onCreate(){
      this.dialog.open(AddApplicationComponent,{
        maxHeight: '100vh'}
      );}
    
    populateForm(SelectedRecord:Application){
      this.appService.fromData=  Object.assign({},SelectedRecord);
      this.onUpdate();
    }
    
    onUpdate(){
      this.dialog.open(UpdateApplicationComponent);
    }

    verifAppBeforDeleting(idApp:number){
      var subject = new Subject<Boolean>();
      this.modService.getModule().subscribe(
        res=>{
          for(let item of res){
            if(item.modApplication == idApp && item.modEtat == true){
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
    this.verifAppBeforDeleting(id).subscribe(data => {        
      if (data==false){
        this.appService.deleteApplication(id).subscribe(
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
          this.toaster.error("Échec de la suppression, il y a des modules actifs avec ce rôle")
        }
      })
    }
    
    ShowDiv(divVal: string) {
      this.filterDiv = divVal;
      this.etatapplication=true
      // Display all Applications
      this.ngAfterViewInit()
    }
    
    search(functionSearchfor : NgForm){
      this.appService.getApplicationSearch(
          functionSearchfor.value.libelle,
          functionSearchfor.value.description,
          functionSearchfor.value.etat).subscribe(data=>{
            this.dataToExport=data
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

     // Serach Function : Angular Material Table Filter
    applyFilter($event:any){
      this.dataSource.filter=$event.target.value;
    }

    ngOnInit(): void {
      // Hiden buttons according to the roles  
      this.authService.getFunctionalities(this.listfunctionalitiesInThisComponent) 
      this.appService.getApplication().subscribe(data=>{
      this.dataToExport=data
      this.dataSource= new MatTableDataSource(data)
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    })
      // this.listApplication = this.route.snapshot.data.listApplications; // Resolver
      // this.dataSource= new MatTableDataSource(this.listApplication)
        this._MatPaginatorIntl.itemsPerPageLabel="Applications par page" // Change text in Angular Material Paginator
     }

    ngAfterViewInit() {
        let listapplications: any = [ ];
        this.appService.getApplication().subscribe(data=>{
          for(let item of data){
            if(item.appEtat==this.etatapplication){
              listapplications.push(item)    
            }
          }
          this.dataSource= new MatTableDataSource(listapplications)
          //this.dataSource= new MatTableDataSource(data)
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
        })
      }

      exportAsExcel() {
        var header =['',''] 
        this.sharedService.exportToExcel("Application.xlsx",this.dataToExport,header)
      }

}
