import { LiveAnnouncer } from '@angular/cdk/a11y';
import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { AuthorizationWithoutRootService } from 'projects/g-acces/src/app/services/authorization-without-root.service';
import { ExportExcel } from 'projects/shared-project/src/app/Models/ExportExcel';
import { Subject } from 'rxjs';
import { intermediaireB } from '../Models/intermediaireB';
import { IntermediaireBService } from '../services/intermediaire-b.service';
import { PlacementService } from '../services/placement.service';
import { AddUpdateIntermediaireComponent } from './add-update-intermediaire/add-update-intermediaire.component';

@Component({
  selector: 'app-intermediaire',
  templateUrl: './intermediaire.component.html',
  styleUrls: ['./intermediaire.component.scss']
})
export class IntermediaireComponent implements OnInit {

  listfunctionalitiesInThisComponent=["ajouter intermediaire","supprimer intermediaire","modifier intermediaire"]
  displayedColumns: string[] = ['inB_libelle','updateButton','deleteButton'];
  dataSource:MatTableDataSource<any>;

  constructor(public dialog:MatDialog,
    public toaster:ToastrService,
    public _liveAnnouncer: LiveAnnouncer,
    public _MatPaginatorIntl: MatPaginatorIntl,
    public intBService:IntermediaireBService,
    public authService:AuthorizationWithoutRootService,
    public datepipe: DatePipe,
    public placementService:PlacementService,
    public exportExcel:ExportExcel) { }
  
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator, { static: true } ) paginator :MatPaginator;

  onCreate(){
    this.dialog.open(AddUpdateIntermediaireComponent);
  }
      
  populateForm(SelectedRecord:intermediaireB){
    this.intBService.fromData=  Object.assign({},SelectedRecord);
    this.onUpdate();
  }
  
  onUpdate(){
    this.dialog.open(AddUpdateIntermediaireComponent);
  }

  verifAppBeforDeleting(idInstitution:number){
    var subject = new Subject<Boolean>();
    this.placementService.getPlacementResolver().subscribe(
      res=>{
        for(let item of res){
          let dateEchance = new Date(item.pla_date_echeance);
          let currentDate = new Date();
  
          if( dateEchance.getTime() < currentDate.getTime() && item.pla_organisme_societe == idInstitution){
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
      if (data==true){
        this.intBService.deleteInterBourse(id).subscribe(
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

announceSortChange(sortState: Sort) {
  if (sortState.direction) {
    this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    }
  else {
    this._liveAnnouncer.announce('Sorting cleared');
    }
}

applyFilter($event:any){
  this.dataSource.filter=$event.target.value;
}

ngAfterViewInit() {
  let listIntermediaire: any = [ ];
  this.intBService.getInterBourseResolver().subscribe(data=>{
  for(let item of data){
    listIntermediaire.push(item)    
  }
  this.dataSource= new MatTableDataSource(listIntermediaire)
  this.dataSource.sort = this.sort;
  this.dataSource.paginator = this.paginator;
  })
}

ngOnInit(): void {
  this.authService.getFunctionalities(this.listfunctionalitiesInThisComponent) 
  this._MatPaginatorIntl.itemsPerPageLabel="Intermédiaire par page"
 }

}
