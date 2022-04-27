import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';
import { placement } from '../Models/placement';
import { FormControl, NgForm } from '@angular/forms';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { PlacementService } from '../services/placement.service';
import { AddPlacementComponent } from './add-placement/add-placement.component';
import { UpdatePlacementComponent } from './update-placement/update-placement.component';
import {AddActionGratuiteComponent} from './add-action-gratuite/add-action-gratuite.component'
import { AuthorizationWithoutRootService } from 'projects/g-acces/src/app/services/authorization-without-root.service';
import { OrganismeService } from '../services/organisme.service';
import { TypeactionService } from '../services/typeaction.service';
import * as XLSX from "xlsx"
import { MatTableExporterDirective, MatTableExporterModule } from 'mat-table-exporter';
import { ExportExcel } from 'projects/shared-project/src/app/Models/ExportExcel';
import { FormatNumberPipe } from 'projects/shared-project/src/app/Models/FormatNumber';
import { IntermediaireBService } from '../services/intermediaire-b.service';



@Component({
  selector: 'app-placement',
  templateUrl: './placement.component.html',
  styleUrls: ['./placement.component.scss']
})
export class PlacementComponent implements OnInit {

  constructor(public dialog:MatDialog,
    public plaService:PlacementService,
    public typeActService:TypeactionService,
    public interBService: IntermediaireBService,
    public toaster:ToastrService,
    public _liveAnnouncer: LiveAnnouncer,
    public _MatPaginatorIntl: MatPaginatorIntl,
    public authService:AuthorizationWithoutRootService,
    public orgService:OrganismeService,
    public exportExcel:ExportExcel,
    public formatNumber:FormatNumberPipe ) { }



    listfunctionalitiesInThisComponent=["ajouter placement","rachat placement","valider placement","ajouter des actions gratuites"] // WARNING: The name of functionalities in this list must be the same in the function table
    displayedColumns: string[] ;
    dataSource:MatTableDataSource<any>;
    searchWord="" 
    filterDiv=""
    functionSearchfor : Function
    etatPlacement=true
    showTable="affiche1"

    sommepla_produits_placement_consommes_date_jour:number
    sommepla_produits_placement_consommes_trimestre_comptable:number
    sommepla_produits_placement_consommes_annee_comptable:number
    sommepla_value_consome_date_jour:number
    sommepla_value_consome_trimestre_comptable:number
    sommepla_value_consome_annee_comptable:number

    typeSousPlacementId:number
    typeSousSousPlacementId:number
    typeFondId:number
    typePlacementId:number
    typeAction=0
    typeActionPlacement=0

    myControl = new FormControl();
    filteredOptions: Observable<string[]>;
    

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator, { static: true } ) paginator :MatPaginator;
    @ViewChild(MatTableExporterDirective) matTableExporter: MatTableExporterDirective;

    listPlacement:placement[]=[]

  onCreate(){
    // Popup Ajouter Placement
    this.dialog.open(AddPlacementComponent,{
      maxHeight:"100vh"
    })
  }

  applyFilter($event:any){
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

  ngOnInit(): void {
    this.authService.getFunctionalities(this.listfunctionalitiesInThisComponent) 
    // Récuperer les ids des bouttons dans le navBar à partire de localItem 
    this.typeSousPlacementId=Number(localStorage.getItem("typeSousPlacementId"))
    this.typePlacementId= Number(localStorage.getItem("typePlacementId"))
    this.typeSousSousPlacementId=Number(localStorage.getItem("typeSousSousPlacementId"))
    this.typeFondId= Number(localStorage.getItem("typeFondId"))

    // Appeles des webServices organismes et typeAction pour l'affichage
    this.orgService.getOrganisme()
    this.typeActService.getTypeaction()
    //this.interBService.getinterB()
    this.getFiltreTypePlacement(this.typePlacementId,this.typeFondId,this.typeSousPlacementId,this.typeSousSousPlacementId,0)

    this._MatPaginatorIntl.itemsPerPageLabel="Placement par page" // Change text in Angular Material Paginator
  }


    importAsXlsx(fileName:string){
      this.matTableExporter.exportTable('xlsx', {fileName:fileName, sheet: 'sheet_name'});
    }

    updatePlacement(SelectedRecord:placement){
      this.plaService.fromData = SelectedRecord
      this.onUpdate();
    }
    onUpdate(){
      this.dialog.open(UpdatePlacementComponent,{
        maxHeight: '100vh',disableClose: true 
      });
    }


    selectFilter(){
      this.getFiltreTypePlacement(this.typePlacementId,this.typeFondId,this.typeSousPlacementId,this.typeSousSousPlacementId, this.typeAction)
    }

    getFiltreTypePlacement(idTypePlacement:number,idFonds:number,idSouplacement:number,idSousSousPlacement:number, idTypeAction:number){
      this.listPlacement=[]
      this.plaService.getPlacementResolver().subscribe(res=>{
        this.orgService.getOrganismeResolver().subscribe(res2=>{

          for(let p of res) {
            if(idTypePlacement == p.pla_id_typ_placement && 
            idFonds == p.pla_id_fonds && 
            idSouplacement == p.pla_id_sous_placement &&
            idSousSousPlacement == p.pla_id_sous_sous_placement &&
            idTypeAction == p.pla_id_type_action ){

              if(p.pla_action_cotee == this.typeActionPlacement){
                this.listPlacement.push(Object.assign({},p))
              }
            }

            //----// Pas de filtre
            if(idTypePlacement == p.pla_id_typ_placement && 
              idFonds == p.pla_id_fonds && 
              idSouplacement == p.pla_id_sous_placement &&
              idSousSousPlacement == p.pla_id_sous_sous_placement 
              && idTypeAction == 0){
                this.listPlacement.push(Object.assign({},p))
              }

          }

          this.dataSource= new MatTableDataSource(this.listPlacement)
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
        })

    })
     // filter 1: Contrat Moudharba - Titre participatif - Contrat Istethmar - Emprunt obligataire
    if(idTypeAction == 0 || idTypeAction == 1 || idTypeAction == 2 || idTypeAction == 3 || idTypeAction == 4 ){
      this.typeActionPlacement=0
      this.displayedColumns = ["pla_organisme_societe","pla_montant_depot","pla_taux_profit","pla_taux_complement","pla_date_souscription","pla_date_echeance","pla_duree","pla_produits_placement_consommes_date_jour", "pla_produits_placement_consommes_trimestre_comptable","pla_produits_placement_consommes_annee_comptable","pla_etat","updateButton"];
    }
    // filter 2: Compte rémunérer
    if(idTypeAction == 5){
      this.typeActionPlacement=0
      this.displayedColumns = ["pla_montant_depot","pla_taux_profit","pla_taux_complement","pla_date_souscription","pla_etat","updateButton"];
    }
    // filter 3 : Action
    if(idTypeAction == 6){
      // Action cotées
      if(this.typeActionPlacement==1){
        this.displayedColumns = ["pla_organisme_societe","nbe_action","prix_achat","pla_montant_depot",
        "pla_date_souscription","prix_jour","montant_actualise","pla_produits_placement_consommes_date_jour", "pla_produits_placement_consommes_trimestre_comptable","pla_produits_placement_consommes_annee_comptable","pla_etat","updateButton"];
      }
      // Action non cotées
      if(this.typeActionPlacement==2){
        this.displayedColumns = ["pla_organisme_societe","pla_nbr_action","pla_prix_achat","pla_montant_depot","pla_date_souscription","pla_etat","updateButton"];
      }
    }
    // filter 4 : FCPR
    if(idTypeAction == 7){
      this.typeActionPlacement=0
      this.displayedColumns = ["pla_montant_depot","pla_date_souscription","pla_Vliqui","pla_value_consome_annee_comptable","pla_interB","pla_etat","updateButton"];
    }
  }

  validatePlacement(id:number){
    this.plaService.fromData.pla_id = id
    this.plaService.validatePlacement().subscribe(
      res=>{
        this.plaService.refreshComponent()
        this.toaster.success("Placement validé","Validation")
      },
      err => {
        this.toaster.error("Échec de valider de placement","Validation")
        console.log(err);}
    );
  }

  addActionGratuite(SelectedRecord:placement){
    this.plaService.fromData = SelectedRecord
    this.dialog.open(AddActionGratuiteComponent,{
      maxHeight: '100vh',disableClose: true 
    });
  }

  onUpdateCalculeProfit(SelectedPlacement:placement){
    this.plaService.fromData=  Object.assign({},SelectedPlacement);
  
    if(SelectedPlacement.pla_calcule_profit_avec_taux_variable==false){
      this.plaService.fromData.pla_calcule_profit_avec_taux_variable=true
      this.plaService.putPlacement().subscribe(
        res=>{
          this.plaService.refreshComponent()
          this.toaster.success("Taux complément variable attribué au placement","Modification")
        },
        err => {
          this.toaster.error("Échec d'attribué le taux complément variable au placement'","Modification")
          console.log(err);
        }
      );
    }

    if(SelectedPlacement.pla_calcule_profit_avec_taux_variable==true){
      this.plaService.fromData.pla_calcule_profit_avec_taux_variable=false
      this.plaService.putPlacement().subscribe(
        res=>{
          this.plaService.refreshComponent()
          this.toaster.success("Taux complément variable supprimer","Modification")
        },
        err => {
          this.toaster.error("Échec de suppression taux complément variable","Modification")
          console.log(err);
        }
      );
    }
    

 
  }



    
      
}

