import { Component, OnInit, ViewChild ,ElementRef} from '@angular/core';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import { UserService } from '../services/user.service'
import { RoleService } from '../services/role.service';
import { User } from '../Models/User';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog'; // npm i @material/dialog
import { RoleFonctionService } from '../services/role-fonction.service'
import { ActivatedRoute } from '@angular/router';
import { AuthorizationWithoutRootService } from '../services/authorization-without-root.service';
import { AddUserComponent } from '../user/add-user/add-user.component';
import { UpdateUserComponent } from '../user/update-user/update-user.component';
import { ViewUserComponent } from '../user/view-user/view-user.component';
import { DateAdapter } from '@angular/material/core'; // Material Date Picker
//Angular Material Table for AngularMatHeaderSort
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Role } from '../Models/Role';
import { TypeutilisateurService } from '../services/typeutilisateur.service';
import { SharedService } from 'projects/shared-project/shared/shared.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})

export class UserComponent implements OnInit  {
  searchWord="" // var for search filter
  p :number = 1; // paginator
  filterDiv=""
  userSearchfor : User
  nameComponent:string
  listrole:Role[]

  // Material Date piker
  rangeDateCreation = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });
  etatutilisateur=true
  // We list the functionalities that we find in this component 
  listfunctionalitiesInThisComponent=["ajouter utilisateur","supprimer utilisateur","modifier utilisateur","initialiser utilisateur"] // WARNING: The name of functionalities in this list must be the same in the function table
 
  displayedColumns: string[] = ['utiNom', 'utiEmail','utiDescription','utiLogin','utiDateCreation','utiRole','updateButton','deleteButton','initializeButton','detailButton'];
  dataSource:MatTableDataSource<any>;
  dataToExport:any;

  constructor(public authService:AuthorizationWithoutRootService, 
    public route: ActivatedRoute,
    public rolService:RoleService,
    public utiService:UserService,
    public rolfonSerice:RoleFonctionService, 
    private _liveAnnouncer: LiveAnnouncer ,
    public toaster:ToastrService, 
    public dialog:MatDialog,
    public _MatPaginatorIntl: MatPaginatorIntl,
    public typeUtiService:TypeutilisateurService,
    public sharedService:SharedService,
    public dateAdapter: DateAdapter<Date>){ 
      this.dateAdapter.setLocale('fr');
    }

  @ViewChild('TABLE') table: ElementRef;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator, { static: true } ) paginator :MatPaginator;

  // Reset the form if everything went well in the addition
  resetForm(monForm:NgForm){
    monForm.form.reset();
    this.utiService.fromData = new User();
  }

  populateForm(SelectedRecord:User){
    this.utiService.fromData=  Object.assign({},SelectedRecord);
    // Object.assign({},nom du formulaire) : This saves us the instantaneous update of the data
    // call popup
    this.onUpdate();
  }

  onUpdate(){
    this.dialog.open(UpdateUserComponent,{
      maxHeight: '100vh'
    });
}

  onDelete(id:number){
  this.utiService.deleteUtilisateur(id).subscribe(
    res=>{
      this.utiService.refreshComponent();
      this.toaster.success("Compte utilisateur supprimé avec succès","Suppression")
    },
    err => {
      this.toaster.error("Échec de supprimer compte utilisateur","Suppression")
      console.log(err);
    }
  );
  }

  onInitialize (id:number){
    this.utiService.initializeUser(id).subscribe(
      res=>{
        this.utiService.getUtilisateur();
        // notification
        this.toaster.success("Compte utilisateur initialisé avec succès","Initialisation")
        this.ngAfterViewInit()
      },
      err => {
        // notification
        this.toaster.error("Échec d'initialisé compte utilisateur","Initialisation")
        console.log(err);
      }
    );
  }
  
  onDetailUser(SelectedRecord:User){
    this.utiService.fromData=  Object.assign({},SelectedRecord);
    this.dialog.open(ViewUserComponent,{
      maxWidth: '100vh',
    });
}
  onCreate(){
      this.dialog.open(AddUserComponent,{
      
        maxHeight: '100vh',    
    });
    }

  ShowDiv(divVal: string) {
      this.filterDiv = divVal;
      // Display all users
      this.etatutilisateur=true
      this.ngAfterViewInit()
      
  }
  convertDateToString(date:any){
    if(date!=null){
      var mounth = Number(date.getMonth())+1
      return date.getFullYear()+"-"+ mounth +"-"+ date.getDate(); 
    }
    else{
      return null
    }  
  }

  search(functionSearchfor : NgForm){
    if (functionSearchfor.value.etat =="true"){
      functionSearchfor.value.etat=true
      this.etatutilisateur=true
    }
    if (functionSearchfor.value.etat =="false"){
      functionSearchfor.value.etat=false
      this.etatutilisateur=false
    }
    this.utiService.getUserSearchFilter(functionSearchfor.value.nom,
      functionSearchfor.value.mail,
      functionSearchfor.value.description,
      functionSearchfor.value.login,
      functionSearchfor.value.etat,
      functionSearchfor.value.role,
      functionSearchfor.value.typeutilisateur,
      this.convertDateToString(this.rangeDateCreation.value.start),
      this.convertDateToString(this.rangeDateCreation.value.end)).subscribe(data=>{
        this.dataSource= new MatTableDataSource(data)
        this.dataToExport=data
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      });
     // functionSearchfor.form.reset();
  }

applyFilter($event:any){
  this.dataSource.filter=$event.target.value;
}

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  ngAfterViewInit() {
    let listutilisateurs: any = [ ];
    this.utiService.getUtilisateurResolver().subscribe(data=>{
      for(let item of data){
        if(item.utiEtat==this.etatutilisateur){
          listutilisateurs.push(item)    
        }
      }
      this.dataSource= new MatTableDataSource(listutilisateurs)
      this.dataToExport=listutilisateurs
      //this.dataSource= new MatTableDataSource(data)
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    })
  }

  ngOnInit() {
    this.utiService.getUtilisateur();
    this.rolService.getRole2();
    this.typeUtiService.getTypeUtilisateur();
    this._MatPaginatorIntl.itemsPerPageLabel="Utilisateur par page"
    this.authService.getFunctionalities(this.listfunctionalitiesInThisComponent) 

  }
 
  exportAsExcel() {
    var header =["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17"] 
    this.sharedService.exportToExcel("Utilisateur.xlsx",this.dataToExport,header)
  }
  


  

}














  