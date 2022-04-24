import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from 'projects/shared-project/shared/shared.service';
import { Subject } from 'rxjs';
import { Agence } from '../Models/Agence';
import { AgenceService } from '../services/agence.service';
import { AuthorizationWithoutRootService } from '../services/authorization-without-root.service';
import { UserService } from '../services/user.service';
import { AddAgenceComponent } from './add-agence/add-agence.component';
import { UpdateAgenceComponent } from './update-agence/update-agence.component';

@Component({
  selector: 'app-agence',
  templateUrl: './agence.component.html',
  styleUrls: ['./agence.component.scss']
})
export class AgenceComponent implements OnInit {

  listfunctionalitiesInThisComponent=["ajouter agence","supprimer agence","modifier agence"] // WARNING: The name of functionalities in this list must be the same in the function table
  displayedColumns: string[] = ['ageCode','ageLibelle','ageCodification','updateButton','deleteButton'];
  dataSource:MatTableDataSource<any>;
  searchWord="" 
  filterDiv=""
  functionSearchfor : Function
  etatAgence=true
  dataToExport:any;

  constructor(public dialog:MatDialog,
    public ageService:AgenceService,
    public userService:UserService,
    public toaster:ToastrService,
    public _liveAnnouncer: LiveAnnouncer,
    public _MatPaginatorIntl: MatPaginatorIntl,
    public authService:AuthorizationWithoutRootService,
    public sharedService:SharedService) { }
  
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator, { static: true } ) paginator :MatPaginator;

  onCreate(){
    this.dialog.open(AddAgenceComponent,{
      maxHeight: '100vh'}
    );
  }
      
  populateForm(SelectedRecord:Agence){
    this.ageService.fromData=  Object.assign({},SelectedRecord);
    this.onUpdate();
  }
  
  onUpdate(){
    this.dialog.open(UpdateAgenceComponent);
  }

  verifAppBeforDeleting(idAge:number){
    var subject = new Subject<Boolean>();
    this.userService.getUtilisateurResolver().subscribe(
      res=>{
        for(let item of res){
          if(item.utiAgeIdAgence == idAge && item.utiEtat == true){
            // true : Agence have Active User
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
        this.ageService.deleteAgence(id).subscribe(
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
      this.etatAgence=true
      // Display all Applications
      this.ngAfterViewInit()
    }
    

    search(functionSearchfor : NgForm){
          /*
      this.ageService.getApplicationSearch(
          functionSearchfor.value.libelle,
          functionSearchfor.value.description,
          functionSearchfor.value.etat).subscribe(data=>{
            this.dataToExport=data
            this.dataSource= new MatTableDataSource(data)
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
      });
       */
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

    ngAfterViewInit() {
      let listagences: any = [ ];
      this.ageService.getAgenceResolver().subscribe(data=>{
        for(let item of data){
          if(item.ageEtat==this.etatAgence){
            listagences.push(item)    
          }
        }
        this.dataSource= new MatTableDataSource(listagences)
        //this.dataSource= new MatTableDataSource(data)
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      })
    }

    ngOnInit(): void {
      // Hiden buttons according to the roles  
      this.authService.getFunctionalities(this.listfunctionalitiesInThisComponent) 
      this.ageService.getAgenceResolver().subscribe(data=>{
      this.dataToExport=data
      this.dataSource= new MatTableDataSource(data)
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    })
      // this.listApplication = this.route.snapshot.data.listApplications; // Resolver
      // this.dataSource= new MatTableDataSource(this.listApplication)
        this._MatPaginatorIntl.itemsPerPageLabel="Agences par page" // Change text in Angular Material Paginator
     }

     exportAsExcel() {
      var header =['',''] 
      this.sharedService.exportToExcel("Application.xlsx",this.dataToExport,header)
    }

}
