import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginatorIntl, MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { AuthorizationWithoutRootService } from '../services/authorization-without-root.service';
import { AddRoleComponent } from './add-role/add-role.component';
import { UpdateRoleComponent } from './update-role/update-role.component';
import { Role } from '../Models/Role';
import { RoleService } from '../services/role.service';
import { UserService } from '../services/user.service';
import { Subject } from 'rxjs';
import { AssignFunctionRoleComponent } from './assign-function-role/assign-function-role.component'

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent implements OnInit {

  listfunctionalitiesInThisComponent=["ajouter role","supprimer role","modifier role","attribuer fonction role"] // WARNING: The name of functionalities in this list must be the same in the function table
  displayedColumns: string[] = ['rolLibelle','rolDescription','updateButton','deleteButton','affectRFButton'];
  dataSource:MatTableDataSource<any>;
  searchWord="" 
  filterDiv=""
  functionSearchfor : Role
  etatRole=true
  listrole:Role[];

  constructor(public authService:AuthorizationWithoutRootService,
    public rolService:RoleService, 
    public utiService:UserService,
    public toaster:ToastrService, 
    public dialog:MatDialog,
    public userService:UserService,
    public _liveAnnouncer: LiveAnnouncer,
    public _MatPaginatorIntl: MatPaginatorIntl) {}

    
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator, { static: true } ) paginator :MatPaginator;

    onCreate(){
      this.dialog.open(AddRoleComponent,{
        maxHeight: '100vh',    
    });
    }
    populateForm(SelectedRecord:Role){
      this.rolService.fromData=  Object.assign({},SelectedRecord);
      this.onUpdate();
    }

    onUpdate(){
        this.dialog.open(UpdateRoleComponent);
    }

  // Popup for asseign role - fonction
    onAsseignRoleFonction(id:number,nom:string){
     const dialogConfig = new MatDialogConfig();
    // pass data to MatDialog popup
     dialogConfig.data = 
     {
      role:{
         "idRole": id,
         "nomRole": nom,
        }
     };
     const dialogSubTaskRef = this.dialog.open(AssignFunctionRoleComponent, dialogConfig);
    }

    verifRoleBeforDeleting(idRole:number){
      var subject = new Subject<Boolean>();
      this.userService.getUtilisateurResolver().subscribe(
        res=>{
          for(let item of res){
            if(item.utiRole == idRole && item.utiEtat == true){
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
    this.verifRoleBeforDeleting(id).subscribe(data => {        
      if (data==false){
        this.rolService.deleteRole(id).subscribe(
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
          this.toaster.error("Échec de la suppression, il y a des utilisateurs actifs avec ce rôle")
        }
      })
    }
        
    ShowDiv(divVal: string) {
      this.filterDiv = divVal;
      this.etatRole=true
      // Display all Applications
      this.ngAfterViewInit()
    }

    search(functionSearchfor : NgForm){
      this.rolService.getRoleSearch(
          functionSearchfor.value.libelle,
          functionSearchfor.value.etat,
          functionSearchfor.value.description).subscribe(data=>{
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
      this.rolService.getRole().subscribe(data=>{
      this.dataSource= new MatTableDataSource(data)
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    })
      this._MatPaginatorIntl.itemsPerPageLabel="Role par page" // Change text in Angular Material Paginator
    }

    ngAfterViewInit() {
      let listrole: any = [ ];
      this.rolService.getRole().subscribe(data=>{
        for(let item of data){
          if(item.rolEtat==this.etatRole){
            listrole.push(item)    
          }
        }
        this.dataSource= new MatTableDataSource(listrole)
        //this.dataSource= new MatTableDataSource(data)
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      })
    }



}
