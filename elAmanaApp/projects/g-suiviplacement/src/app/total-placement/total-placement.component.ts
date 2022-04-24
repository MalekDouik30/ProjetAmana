import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import { OrganismeService } from '../services/organisme.service';
import { DateAdapter } from '@angular/material/core'; // Material Date Picker
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { PlacementService } from '../services/placement.service';
import { TypeactionService } from '../services/typeaction.service';
import { TypefondService } from '../services/typefond.service';
import { TypesousplacementService } from '../services/typesousplacement.service';
import { DatePipe } from '@angular/common';
import { FormatNumberPipe } from 'projects/shared-project/src/app/Models/FormatNumber';
import { TypeplacementService } from '../services/typeplacement.service';
import { TypesoussousplacementService } from '../services/typesoussousplacement.service';
import { DetailsEmpService } from '../services/details-emp.service';
import { MatTableExporterDirective } from 'mat-table-exporter';

@Component({
  selector: 'app-total-placement',
  templateUrl: './total-placement.component.html',
  styleUrls: ['./total-placement.component.scss']
})
export class TotalPlacementComponent implements OnInit {

  constructor(
    public organismeService:OrganismeService,
    public _liveAnnouncer: LiveAnnouncer,
    public dateAdapter: DateAdapter<Date>,
    public plaService:PlacementService,
    public typeActionService:TypeactionService,
    public typeFondService: TypefondService,
    public typeSousPlacementService : TypesousplacementService,
    public typePlacementService: TypeplacementService,
    public typeSousSousPlacementService:TypesoussousplacementService,
    public detailEmpService:DetailsEmpService,
    public typefondService: TypefondService,
    public datepipe: DatePipe,
    public formatNumber:FormatNumberPipe,
    public _MatPaginatorIntl: MatPaginatorIntl) { }

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator, { static: true } ) paginator :MatPaginator;
  @ViewChild(MatTableExporterDirective) matTableExporter: MatTableExporterDirective;

  filterDiv=""
  searchDisplayingFilter:number
  showFilterDiv="withoutFilter"
  typePlacementFilterSelected=""
  // Filter selected variables
  institutionFinanciereFilterSelected=0
  typefondsFilterSelected=0

  etatPlacementFilterSelected=""
  // Material Date piker
  rangeDateCreation = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  currentYear=new Date().getFullYear()

  // Angular material table
  displayedColumns: string[] = ['placement', 'dateSouscription','dateEchance','duree','taux_interet','fonds','nature','Mnt_depot','etablissement','produit_fin_annee_comptable'];
  dataSource:MatTableDataSource<any>;

   listplacements: any = [];
 // Object to display in table
  placementvar = {
    placement:"",
    dateSouscription:"",
    dateEchance:"",
    duree:0,
    taux_interet:0,
    fonds:"",
    nature:"",
    Mnt_depot:0,
    etablissement:"",
    produit_fin_annee_comptable:0,
  }

  initializeFiltres(){
    this.institutionFinanciereFilterSelected=0
    this.etatPlacementFilterSelected=""
    this.typePlacementFilterSelected=""
    this.typefondsFilterSelected=0

    this.rangeDateCreation = new FormGroup({
      start: new FormControl(),
      end: new FormControl(),
    });
  }

  ShowDiv(decision:string){
    this.showFilterDiv=decision

    if(decision=='withoutFilter'){
      // initialize all filters
      this.initializeFiltres()
      this.displayPlacement(false,false,false,false,false)
    }
  }

  selectedFilterPlacement(){
    // Filter 1 : Institution financière
    if(this.institutionFinanciereFilterSelected!=0){
      this.typePlacementFilterSelected=""
      this.displayPlacement(true, false,false,false,false)
    }
    // Filter 2 : Date Placement
    if(this.rangeDateCreation.value.start!=null){
      this.typePlacementFilterSelected=""
      this.displayPlacement(false, false,false,true,false)
    }
    // Filter 3 : Etat Placement
    if(this.etatPlacementFilterSelected!=""){
      this.typePlacementFilterSelected=""
      this.displayPlacement(false, false,true,false,false)
    }
    // Filter 4 : Typle Placement
    if(this.typePlacementFilterSelected!="" ){
      this.displayPlacement(false, true,false,false,false)
    }
    // Filter 5 : Typle fonds
    if(this.typefondsFilterSelected!=0 ){
      this.displayPlacement(false,false,false,false,true)
    }

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
      this.displayPlacement(false,false,false,false,false)

    }

  ngOnInit(): void {
    this.organismeService.getOrganisme()
    this.typeActionService.getTypeaction();
    this._MatPaginatorIntl.itemsPerPageLabel="placments par page"
  }

  displayPlacement(parTypeInstitutionFinanciere:boolean, parType:boolean,parEtat:boolean,parDate:boolean,parfonds:boolean ){
    this.listplacements= [];
    // Pas de Filtre tous les placements :------------------------------------------------------------
    if(!parTypeInstitutionFinanciere && !parType && !parEtat && !parDate && !parfonds){
      this.plaService.getPlacementResolver().subscribe(data=>{
        this.typeActionService.getTypeactionResolver().subscribe(data2=>{
          this.typeFondService.getTypefondResolver().subscribe(data4=>{
            this.typeSousPlacementService.getTypeSplacementResolver().subscribe(data5=>{
              this.organismeService.getOrganismeResolver().subscribe(data6=>{
                for(let p of data){
                  this.fillDataToMatTable(p,data2,data4,data5,data6)
                  this.listplacements.push(Object.assign({},this.placementvar))
                }
              this.dataSource= new MatTableDataSource(this.listplacements)
              this.dataSource.sort = this.sort;
              this.dataSource.paginator = this.paginator;
            })
          })
        })
      })
    })
  }
    // Filtre par institution financiere :------------------------------------------------------------
    if(parTypeInstitutionFinanciere){
      this.plaService.getPlacementResolver().subscribe(data=>{
        this.typeActionService.getTypeactionResolver().subscribe(data2=>{
          this.typeFondService.getTypefondResolver().subscribe(data4=>{
            this.typeSousPlacementService.getTypeSplacementResolver().subscribe(data5=>{
              this.organismeService.getOrganismeResolver().subscribe(data6=>{

                  for(let p of data){
                    if(p.pla_organisme_societe == this.institutionFinanciereFilterSelected){
                      this.fillDataToMatTable(p,data2,data4,data5,data6)
                      this.listplacements.push(Object.assign({},this.placementvar))
                  }
                }
                this.dataSource= new MatTableDataSource(this.listplacements)
                this.dataSource.sort = this.sort;
                this.dataSource.paginator = this.paginator;
            })
          })
        })
      })
    })
    }
      // Filtre par type fonds :------------------------------------------------------------
      if(parfonds){
        this.plaService.getPlacementResolver().subscribe(data=>{
          this.typeActionService.getTypeactionResolver().subscribe(data2=>{
            this.typeFondService.getTypefondResolver().subscribe(data4=>{
              this.typeSousPlacementService.getTypeSplacementResolver().subscribe(data5=>{
                this.organismeService.getOrganismeResolver().subscribe(data6=>{

                    for(let p of data){
                      if(p.pla_id_fonds== this.typefondsFilterSelected){
                        this.fillDataToMatTable(p,data2,data4,data5,data6)
                        this.listplacements.push(Object.assign({},this.placementvar))
                    }
                  }
                  this.dataSource= new MatTableDataSource(this.listplacements)
                  this.dataSource.sort = this.sort;
                  this.dataSource.paginator = this.paginator;
              })
            })
          })
        })
      })
      }
    // Filtre par Etat :----------------------------------------------------------------------
    if( parEtat){
      this.plaService.getPlacementResolver().subscribe(data=>{
        this.typeActionService.getTypeactionResolver().subscribe(data2=>{
          this.typeFondService.getTypefondResolver().subscribe(data4=>{
            this.typeSousPlacementService.getTypeSplacementResolver().subscribe(data5=>{
              this.organismeService.getOrganismeResolver().subscribe(data6=>{
                    for(let p of data){
                      if(p.pla_etat == this.etatPlacementFilterSelected){
                        this.fillDataToMatTable(p,data2,data4,data5,data6)
                        this.listplacements.push(Object.assign({},this.placementvar))
                    }
                  }
                  this.dataSource= new MatTableDataSource(this.listplacements)
                  this.dataSource.sort = this.sort;
                  this.dataSource.paginator = this.paginator;
            })
          })
        })
      })
    })
    }

    // Filtre par Date placement :------------------------------------------------------------
    if(parDate){
      let dateD=Date.parse(this.rangeDateCreation.value.start);

      let formateDateD =this.datepipe.transform(dateD, 'yyyy-MM-dd')||'{}';
      let dateF=Date.parse(this.rangeDateCreation.value.end);

      console.log( "Date début " + new Date(formateDateD));
      console.log( "Date Fin " + new Date(dateF));

      this.plaService.getPlacementResolver().subscribe(data=>{
        this.typeActionService.getTypeactionResolver().subscribe(data2=>{
          this.typeFondService.getTypefondResolver().subscribe(data4=>{
            this.typeSousPlacementService.getTypeSplacementResolver().subscribe(data5=>{
              this.organismeService.getOrganismeResolver().subscribe(data6=>{
                for(let p of data){
                  let dateSouscription = Date.parse(p.pla_date_souscription)
                  //console.log( "Date Souscription " + new Date(dateSouscription));
                  if( dateSouscription >=dateD && dateSouscription< dateF ){
                    // 1.type placement
                    for(let ta of data2){
                      if(p.pla_id_type_action == ta.typ_act_id){
                        this.placementvar.placement=ta.typ_act_libelle
                      }
                    }
                    //8. Etablissement
                    for(let o of data6){
                      if(o.org_id==p.pla_organisme_societe){
                        this.placementvar.etablissement=o.org_libelle
                      }
                    }
                    if( p.pla_id_type_action == 6 && p.pla_action_cotee == 1){
                      this.placementvar.placement="Action cotées"
                      //8. Etablissement
                      this.placementvar.etablissement=p.pla_societe
                    }
                    if( p.pla_id_type_action == 6 && p.pla_action_cotee == 2){
                      this.placementvar.placement="Action non cotées"
                      //8. Etablissement
                      this.placementvar.etablissement=p.pla_societe
                    }
                    if( p.pla_id_typ_placement ==2 ){
                      this.placementvar.placement="Placement immobilier"
                    }
                    // 2.Date souscription
                    this.placementvar.dateSouscription =this.datepipe.transform(p.pla_date_souscription, 'dd/MM/yyyy') ||'{}';
                    // 3.Date souscription
                    this.placementvar.dateEchance=this.datepipe.transform(p.pla_date_echeance, 'dd/MM/yyyy') ||'{}';

                    // 4.Durée du placement
                    this.placementvar.duree=p.pla_duree
                    // 5.Taux du placement
                    this.placementvar.taux_interet=p.pla_taux_profit
                    // 6.Fonds
                    for(let f of data4){
                      if(f.typ_fon_id==p.pla_id_fonds){
                        this.placementvar.fonds=f.type_fon_libelle
                      }
                    }
                    // 7. Nature
                    for(let tsp of data5){
                      if(tsp.typ_sous_pla_id==p.pla_id_sous_placement){
                        this.placementvar.nature=tsp.typ_sous_pla_libelle
                      }
                    }
                    // 9. VN 31/12/2020
                    this.placementvar.produit_fin_annee_comptable=p.pla_produits_placement_consommes_annee_comptable
                    this.listplacements.push(Object.assign({},this.placementvar))

                  }
                this.dataSource= new MatTableDataSource(this.listplacements)
                this.dataSource.sort = this.sort;
                this.dataSource.paginator = this.paginator;

              }
            })
          })
        })
      })
    })
    }

    // Filtre par Type placement :------------------------------------------------------------
    if(parType){

      this.plaService.getPlacementResolver().subscribe(data=>{
        this.typeActionService.getTypeactionResolver().subscribe(data2=>{
          this.typeFondService.getTypefondResolver().subscribe(data4=>{
            this.typeSousPlacementService.getTypeSplacementResolver().subscribe(data5=>{
              this.organismeService.getOrganismeResolver().subscribe(data6=>{

                for(let p of data){
                  // recherche par type placement type placement
                  if(this.getTypePlacementFromSelect(this.typePlacementFilterSelected).typeFondId == 0 ){

                    if(p.pla_id_typ_placement ==this.getTypePlacementFromSelect(this.typePlacementFilterSelected).typePlacementId){
                      this.fillDataToMatTable(p,data2,data4,data5,data6)
                      this.listplacements.push(Object.assign({},this.placementvar))
                    }
                  }

                  if(this.getTypePlacementFromSelect(this.typePlacementFilterSelected).typeFondId != 0  && this.getTypePlacementFromSelect(this.typePlacementFilterSelected).typeSousPlacementId == 0 ){

                    if(p.pla_id_typ_placement ==this.getTypePlacementFromSelect(this.typePlacementFilterSelected).typePlacementId
                    && p.pla_id_fonds ==this.getTypePlacementFromSelect(this.typePlacementFilterSelected).typeFondId){
                      this.fillDataToMatTable(p,data2,data4,data5,data6)
                      this.listplacements.push(Object.assign({},this.placementvar))
                    }
                  }
                  //recherche par type placement type fonds
                  if(this.getTypePlacementFromSelect(this.typePlacementFilterSelected).typeSousPlacementId != 0  && this.getTypePlacementFromSelect(this.typePlacementFilterSelected).typeSousSousPlacementId == 0  && this.getTypePlacementFromSelect(this.typePlacementFilterSelected).typeActionId == 0 ){

                    if(p.pla_id_typ_placement ==this.getTypePlacementFromSelect(this.typePlacementFilterSelected).typePlacementId
                    && p.pla_id_fonds ==this.getTypePlacementFromSelect(this.typePlacementFilterSelected).typeFondId
                    && p.pla_id_sous_placement == this.getTypePlacementFromSelect(this.typePlacementFilterSelected).typeSousPlacementId){
                      this.fillDataToMatTable(p,data2,data4,data5,data6)
                      this.listplacements.push(Object.assign({},this.placementvar))
                    }
                  }
                   //recherche par type placement type sous placement
                  if(this.getTypePlacementFromSelect(this.typePlacementFilterSelected).typeSousSousPlacementId != 0 && this.getTypePlacementFromSelect(this.typePlacementFilterSelected).typeActionId == 0){

                    if(p.pla_id_typ_placement ==this.getTypePlacementFromSelect(this.typePlacementFilterSelected).typePlacementId
                    && p.pla_id_fonds ==this.getTypePlacementFromSelect(this.typePlacementFilterSelected).typeFondId
                    && p.pla_id_sous_placement ==this.getTypePlacementFromSelect(this.typePlacementFilterSelected).typeSousPlacementId
                    && p.pla_id_sous_sous_placement ==this.getTypePlacementFromSelect(this.typePlacementFilterSelected).typeSousSousPlacementId){
                      this.fillDataToMatTable(p,data2,data4,data5,data6)
                      this.listplacements.push(Object.assign({},this.placementvar))
                    }
                  }
                  // recherche par type placement type sous sous placement
                  if(this.getTypePlacementFromSelect(this.typePlacementFilterSelected).typeActionId != 0 ){

                    if(p.pla_id_typ_placement ==this.getTypePlacementFromSelect(this.typePlacementFilterSelected).typePlacementId
                    && p.pla_id_fonds ==this.getTypePlacementFromSelect(this.typePlacementFilterSelected).typeFondId
                    && p.pla_id_sous_placement ==this.getTypePlacementFromSelect(this.typePlacementFilterSelected).typeSousPlacementId
                    && p.pla_id_sous_sous_placement ==this.getTypePlacementFromSelect(this.typePlacementFilterSelected).typeSousSousPlacementId
                    && p.pla_id_type_action == this.getTypePlacementFromSelect(this.typePlacementFilterSelected).typeActionId){
                      this.fillDataToMatTable(p,data2,data4,data5,data6)
                      this.listplacements.push(Object.assign({},this.placementvar))
                    }
                  }
                }
                  this.dataSource= new MatTableDataSource(this.listplacements)
                  this.dataSource.sort = this.sort;
                  this.dataSource.paginator = this.paginator;
            })
          })
        })
      })
    })
    }

  }

  dateRangeChange(dateRangeStart: HTMLInputElement, dateRangeEnd: HTMLInputElement) {

    this.rangeDateCreation.value.start=dateRangeStart.value;
    this.rangeDateCreation.value.end=dateRangeEnd.value;
    if(this.rangeDateCreation.value.start!=null){
      this.selectedFilterPlacement()
    }
  }

  importAsXlsx(fileName:string){
    const timeSpan = new Date().toISOString();
    this.matTableExporter.exportTable('xlsx', {fileName:fileName+"_"+timeSpan, sheet: 'sheet_name'});
  }

  getTypePlacementFromSelect(typePlacement:string){
    const myArray = typePlacement.split("+")
    let typePlacementId=Number(myArray[0])
    let typeFondId = Number(myArray[1])
    let typeSousPlacementId = Number(myArray[2])
    let typeSousSousPlacementId = Number(myArray[3])
    let typeActionId =Number(myArray[4])
    return{typePlacementId,typeFondId,typeSousPlacementId,typeSousSousPlacementId,typeActionId}

  }

  fillDataToMatTable(p:any,data2:any,data4:any,data5:any,data6:any){
      // 1.type placement
      for(let ta of data2){
        if(p.pla_id_type_action == ta.typ_act_id){
          this.placementvar.placement=ta.typ_act_libelle
        }
      }
       //8. Etablissement
      for(let o of data6){
        if(o.org_id==p.pla_organisme_societe){
          this.placementvar.etablissement=o.org_libelle
        }
      }
      if( p.pla_id_type_action == 6 && p.pla_action_cotee == 1){
        this.placementvar.placement="Action cotées"
         //8. Etablissement
        this.placementvar.etablissement=p.pla_societe
      }
      if( p.pla_id_type_action == 6 && p.pla_action_cotee == 2){
        this.placementvar.placement="Action non cotées"
        //8. Etablissement
        this.placementvar.etablissement=p.pla_societe
      }
      if( p.pla_id_typ_placement ==2 ){
        this.placementvar.placement="Placement immobilier"
      }
      // 2.Date souscription
      this.placementvar.dateSouscription =this.datepipe.transform(p.pla_date_souscription, 'dd/MM/yyyy') ||'{}';
      // 3.Date souscription
      this.placementvar.dateEchance=this.datepipe.transform(p.pla_date_echeance, 'dd/MM/yyyy') ||'{}';

      // 4.Durée du placement
      this.placementvar.duree=p.pla_duree
      // 5.Taux du placement
      this.placementvar.taux_interet=p.pla_taux_profit
      // 6.Fonds
      for(let f of data4){
        if(f.typ_fon_id==p.pla_id_fonds){
          this.placementvar.fonds=f.type_fon_libelle
        }
        if(f.typ_fon_id==1){
          this.placementvar.nature="Actionnaire"
        }
      }
      // 7. Nature
      for(let tsp of data5){
        if(tsp.typ_sous_pla_id==p.pla_id_sous_placement){
          this.placementvar.nature=tsp.typ_sous_pla_libelle

        }

      }
      // 7. montant depot
      this.placementvar.Mnt_depot=p.pla_montant_depot

      // 9. VN 31/12/2020
      this.placementvar.produit_fin_annee_comptable=p.pla_produits_placement_consommes_annee_comptable

  }

}
