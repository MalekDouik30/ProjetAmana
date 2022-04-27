import { Component, OnInit } from '@angular/core';
import { PlacementService } from '../services/placement.service';
import { placement } from '../Models/placement';
import { TypeplacementService } from '../services/typeplacement.service';
import Chart from 'chart.js/auto';
import { TypefondService } from '../services/typefond.service';
import { TypesousplacementService } from '../services/typesousplacement.service';
import { TypesoussousplacementService } from '../services/typesoussousplacement.service';
import { TypeactionService } from '../services/typeaction.service';
import { OrganismeService } from '../services/organisme.service';
import { FormatNumberPipe } from 'projects/shared-project/src/app/Models/FormatNumber';
import { ExportExcel } from 'projects/shared-project/src/app/Models/ExportExcel';
import { DetailsEmpService } from '../services/details-emp.service';
import { HistoriqueRealisationService } from '../services/historique-realisation.service';

@Component({
  selector: 'app-dashboard-placement',
  templateUrl: './dashboard-placement.component.html',
  styleUrls: ['./dashboard-placement.component.scss']
})
export class DashboardPlacementComponent implements OnInit {

  /** test github*/
  varMalek=0
  varSarra="sarra test"

  /** Fin test gith**/
  typePlacement=""
  montantPlacementGlobal=0;
  nbrePlacementGlobal=0;
  nbrePlacementByType:number[]=[];
  nbrePlacementByBanque:number[]=[];
  nbrePlacementByAction:number[]=[];
  nbrePlacementByAction_Action:number[]=[];
  montantPlacementByType:number[]=[]
  montantPlacementByBanque:number[]=[]
  moyenneTauxPlacementByBanque:number[]=[]
  montantPlacementByAction:number[]=[]
  montantPlacementByAction_Action:number[]=[]
  listTypePlacementLibelle:string[]=[]
  listBanqueLibelle:string[]=[]
  listActionLibelle:string[]=[]
  listFondsLibelle:string[]=[]

  nbrePlacementImmobilierByAction:number[]=[]
  montantPlacementImmobilierByAction:number[]=[]

  listActionLibelle_Action:string[]=[]
  displayedColumns :string[]
  displayedRowsSelected:string
  listPlacement:placement[]=[]

  searchDisplayingFilter=0
  institutionFinanciereSelected=0

  varTotalRemunerationDateDuJour=0
  varTotalRemunerationTrimestre=0
  varTotalRemunerationAnnee=0

  totaleMontantDepotTableau = 0
  totalRemunerationDateJourTableau=0
  totalRemunerationTrimestreComptableTableau=0
  totalRemunerationAnneeComptableTableau = 0
  totaleInteretBanqueTableau=0

  // For Barchart3
  listNomEntrepriseCotes:string[]=[]
  listPrixJour:number[]=[]
  listPrixAchat:number[]=[]

  // Taux Profit
  listDernierTauxPlacementParBanque:any[]=[]
  tauxProfitMoyen=0
  tauxProfitPondere=0
  // Historique realisation
  totalMontantDepot=0
  totalMontantProfit=0
  // Taux Réalisation
  tauxRealisationMontantDepot:any
  tauxRealisationMontantProfitDateJour:any
  tauxRealisationMontantProfitTrimestre:any
  tauxRealisationMontantProfitAnnee:any


  changeView="";

  constructor(
    public placementService:PlacementService,
    public typePlacementService: TypeplacementService,
    public typeFondService: TypefondService,
    public typeSousPlacementService : TypesousplacementService,
    public typeSousSousPlacementService:TypesoussousplacementService,
    public typeActionService:TypeactionService,
    public organismeService:OrganismeService,
    public detailEmpService:DetailsEmpService,
    public histoService:HistoriqueRealisationService,
    public formatNumber:FormatNumberPipe,
    public exportExcel:ExportExcel
   ) { }

   ngOnInit(): void {
    this.typePlacementService.getTypeplacement();
    this.typeFondService.getTypefond();
    this.typeSousPlacementService.getTypeSplacement();
    this.typeSousSousPlacementService.getTypeSSplacement();
    this.typeActionService.getTypeaction();
    this.organismeService.getOrganisme();
    this.detailEmpService.getDetailsEmp()

   this.placementService.getDernierTauxPlacementParBanque().subscribe(
     res=>{
       for(let item of res){
        this.listDernierTauxPlacementParBanque.push(item)
       }
     }
   );

   this.getMontantNbeTotalePlacement();
   this.getAction();
   this.getDetailPlacementFinancier();
   this.getDetailPlacementImmobilier();
   this.calculateTauxProfit();

 
   }
  
   
   getMontantNbeTotalePlacement(){
    let listTypePlacementId:number[]=[]
    let listPlacementBanqueId:number[]=[];
    let totalTauxPlacementByBanque:number[]=[]

    this.placementService.getPlacementResolver().subscribe(
      res=>{
        for(let item of res){
          // 1
          this.nbrePlacementGlobal = this.nbrePlacementGlobal+1
          this.montantPlacementGlobal = this.montantPlacementGlobal+item.pla_montant_depot
          this.varTotalRemunerationDateDuJour = this.varTotalRemunerationDateDuJour + item.pla_produits_placement_consommes_date_jour
          this.varTotalRemunerationTrimestre =this.varTotalRemunerationTrimestre + item.pla_produits_placement_consommes_trimestre_comptable
          this.varTotalRemunerationAnnee =this.varTotalRemunerationAnnee + item.pla_produits_placement_consommes_annee_comptable
          // 2. Get Count and Sum By TypePlacement
          if(!listTypePlacementId.includes(item.pla_id_typ_placement)){
            listTypePlacementId.push(item.pla_id_typ_placement)
          }

          this.typePlacementService.getTypeplacementResolver().subscribe(
            res2=>{
              for(let item2 of res2){
                for(let item3 of listTypePlacementId ){
                  if(item2.typ_pla_id == item3){
                    if(!this.listTypePlacementLibelle.includes(item2.typ_pla_libelle)){
                      this.listTypePlacementLibelle.push(item2.typ_pla_libelle)
                    }
                  }
                }
              }
            }
          )

          // 3.Get the number of investments in each bank / the total amount invested in each bank.
          if(!listPlacementBanqueId.includes(item.pla_organisme_societe)){
            if(item.pla_organisme_societe!=0){
              listPlacementBanqueId.push(item.pla_organisme_societe)
            }
          }
          this.organismeService.getOrganismeResolver().subscribe(
            res3=>{
              // continuite de 3
          for(let item of listPlacementBanqueId){

            for(let item3 of res3){
                if(item3.org_id == item){
                  if(!this.listBanqueLibelle.includes(item3.org_libelle)){
                    this.listBanqueLibelle.push(item3.org_libelle)
                  }
                } 
            }

            let count =0
            let sum =0
            let sumTauxPlacement=0
            for(let item2 of res){
              if(item == item2.pla_organisme_societe){
                count=count+1
                sum=sum+item2.pla_montant_depot
                sumTauxPlacement=sumTauxPlacement+item2.pla_taux_profit
              }
            }
            this.nbrePlacementByBanque.push(count)
            this.montantPlacementByBanque.push(sum)
            totalTauxPlacementByBanque.push(sumTauxPlacement)
          }

          totalTauxPlacementByBanque.forEach((value, index)=>{
            this.moyenneTauxPlacementByBanque.push(value/this.nbrePlacementByBanque[index])
          })



          /*
        listActionId.forEach((value, index)=>{
          if(value ==6){
            this.nbrePlacementByAction_Action.push(this.nbrePlacementByAction[index])
            this.montantPlacementByAction_Action.push(this.montantPlacementByAction[index])
            this.listActionLibelle_Action.push("Actions")

            this.nbrePlacementByAction.splice(index,1)
            this.montantPlacementByAction.splice(index,1)
            this.listActionLibelle.splice(index,1)
          }

        }) */
          /*Bar chart */
           new Chart("BarChart", {
            type: 'bar',
            data : {
              labels:  this.listBanqueLibelle,
              datasets: [{
                  data:  this.montantPlacementByBanque,
                  backgroundColor: [
                    'rgba(248,155	,58, 0.5)',
                    'rgba(0,145,97, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(102, 76, 85,0.5)',
                    'rgba(153, 102, 255, 0.5)',
                    'rgba(255, 159, 64, 0.5)'
                ],
                borderColor: [
                  'rgba(248,155	,58, 1)',
                  'rgba(0,145,97, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(102, 76, 85,1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
              }]
          },
          options: {
            plugins: {
              legend: {
                display: false
              }
            }
          }

        })
         /*End Bar chart */
         /*Bar chart2 */
        new Chart("BarChartTaux", {
          type: 'bar',
          data : {
            labels:  this.listBanqueLibelle,
            datasets: [{
                data:  this.moyenneTauxPlacementByBanque,
                backgroundColor: [
                  'rgba(248,155	,58, 0.5)',
                  'rgba(0,145,97, 0.5)',
                  'rgba(255, 206, 86, 0.5)',
                  'rgba(102, 76, 85,0.5)',
                  'rgba(153, 102, 255, 0.5)',
                  'rgba(255, 159, 64, 0.5)'
              ],
              borderColor: [
                'rgba(248,155	,58, 1)',
                'rgba(0,145,97, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(102, 76, 85,1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
              ],
              borderWidth: 1
            }]
        },
        options: {
          plugins: {
            legend: {
              display: false
            }
          }
        }
      })
         /*Pie chart */

         var chart1 = new Chart("PieChartCountBanque", {
          type: 'doughnut',
          data : {
            labels: this.listBanqueLibelle,
            datasets: [{
                data: this.nbrePlacementByBanque,
                backgroundColor: [
                  'rgba(248,155	,58, 0.5)',
                  'rgba(0,145,97, 0.5)',
                  'rgba(255, 206, 86, 0.5)',
                  'rgba(102, 76, 85,0.5)',
                  'rgba(153, 102, 255, 0.5)',
                  'rgba(255, 159, 64, 0.5)'
              ],
              borderColor: [
                'rgba(248,155	,58, 1)',
                'rgba(0,145,97, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(102, 76, 85,1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
              ],
            }],
        },
      })

    }
    )
  }
  this.getHistoriqueRealisation()
  })
      this.placementService.getPlacementResolver().subscribe(
        res=>{
          // continuite de 2
          for(let item of listTypePlacementId){
            let count =0
            let sum =0
            for(let item2 of res){
              if(item == item2.pla_id_typ_placement){
                count=count+1
                sum=sum+item2.pla_montant_depot
              }
            }
            this.nbrePlacementByType.push(count)
            this.montantPlacementByType.push(sum)
          }
      }
    )
   }


   getAction(){
    // Action doonnees pour la bar chart :
     this.placementService.getPlacementResolverAction().subscribe(
      res=>{
        for(let item of res){
          if(item.pla_action_cotee==1){
            this.listNomEntrepriseCotes.push(item.pla_societe)
            this.listPrixJour.push(item.pla_prix_jour)
            this.listPrixAchat.push(item.pla_prix_achat)
        }
      }
       /*Bar chart3 */
       new Chart("BarChartPrixAction", {
        type: 'bar',
        data : {
          labels:  this.listNomEntrepriseCotes,
          datasets: [{
              data:  this.listPrixAchat,
              indexAxis: 'y',
              backgroundColor: [
                'rgba(248,155	,58, 0.5)',
                'rgba(0,145,97, 0.5)',
                'rgba(255, 206, 86, 0.5)',
                'rgba(102, 76, 85,0.5)',
                'rgba(153, 102, 255, 0.5)',
                'rgba(255, 159, 64, 0.5)'
            ],
            borderColor: [
              'rgba(248,155	,58, 1)',
              'rgba(0,145,97, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(102, 76, 85,1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
          },
          {
            data: this.listPrixJour,
            indexAxis: 'y',
            backgroundColor: [
              'rgba(248,155	,58, 0.5)',
              'rgba(0,145,97, 0.5)',
              'rgba(255, 206, 86, 0.5)',
              'rgba(102, 76, 85,0.5)',
              'rgba(153, 102, 255, 0.5)',
              'rgba(255, 159, 64, 0.5)'
          ],
          borderColor: [
            'rgba(248,155	,58, 1)',
            'rgba(0,145,97, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(102, 76, 85,1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }

        ]
      },
      options: {
        plugins: {
          legend: {
            display: false
          }
        }
      }
    })
    }
  )
 }
   getDetailPlacementFinancier(){
    let listActionId:number[]=[];
    this.placementService.getPlacementResolver().subscribe(
      res=>{
        for(let item of res){
          if(item.pla_id_type_action!=0  ){
            if(!listActionId.includes(item.pla_id_type_action)){
              listActionId.push(item.pla_id_type_action)
            }
          }
        }
        for(let item of listActionId){
          let count=0
          let sum=0
          for(let item2 of res){
            if(item == item2.pla_id_type_action){
              count=count+1
              sum=sum+item2.pla_montant_depot
            }
          }
          this.nbrePlacementByAction.push(count)
          this.montantPlacementByAction.push(sum)
        }

        this.typeActionService.getTypeactionResolver().subscribe(
          res=>{
            for(let item of res){
              for(let item2 of listActionId){
                if(item.typ_act_id ==item2 ){
                  this.listActionLibelle.push(item.typ_act_libelle)
                }
              }
            }
          }
        )

        listActionId.forEach((value, index)=>{
          if(value ==6){
            this.nbrePlacementByAction_Action.push(this.nbrePlacementByAction[index])
            this.montantPlacementByAction_Action.push(this.montantPlacementByAction[index])
            this.listActionLibelle_Action.push("Actions")

            this.nbrePlacementByAction.splice(index,1)
            this.montantPlacementByAction.splice(index,1)
            this.listActionLibelle.splice(index,1)
          }

        })

   }
  )
  }

  getDetailPlacementImmobilier(){
    let listFondsId:number[]=[];
    this.placementService.getPlacementResolver().subscribe(
      res=>{
        for(let item of res){
          if(item.pla_id_typ_placement == 2){
            if(!listFondsId.includes(item.pla_id_fonds)){
              listFondsId.push(item.pla_id_fonds)
            }
          }
        }
        for(let item of listFondsId){
          let count=0
          let sum=0
          for(let item2 of res){
            if(item == item2.pla_id_fonds &&  item2.pla_id_typ_placement == 2){
              count=count+1
              sum=sum+item2.pla_montant_depot
            }
          }
          this.nbrePlacementImmobilierByAction.push(count)
          this.montantPlacementImmobilierByAction.push(sum)
        }

        this.typeFondService.getTypefondResolver().subscribe(
          res=>{
            for(let item of res){
              for(let item2 of listFondsId){
                if(item.typ_fon_id ==item2 ){
                  this.listFondsLibelle.push(item.type_fon_libelle)
                }
              }
            }
          }
        )
      }
    )
  }

  getDiffDaysBetween2Date(date1:any,date2:any){
    // Calculer la difference de jours entre 2 date.
    var Time = date2.getTime() - date1.getTime(); 
    var Days = Time / (1000 * 3600 * 24);
    return Math.floor(Days)
  }

  getTodayDate():Date{
      let myDate = new Date();
      return myDate
  }

  VerifLapYear()
  {
    // Vérifier si l'année précédente est une année bissextile ou non 
    let year = this.getTodayDate().getFullYear();

    if (((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0))
    {
      return 366;
    }
    return 365;
  }

  changeViewCard(viewPlacement:string){
    this.changeView=viewPlacement
  }

  calculateTauxProfit(){
    // Fonction pour calculer les differnts taux de profit
    let totalDepot=0
    let sommeMontantxTaux=0
    let count=0
    this.placementService.getPlacementResolver().subscribe(
      res=>{
        for(let item of res){
          let dateSouscription = new Date(item.pla_date_souscription)
          if(dateSouscription.getFullYear() == this.getTodayDate().getFullYear() ){
            this.tauxProfitMoyen= this.tauxProfitMoyen+item.pla_taux_profit
            totalDepot = totalDepot+item.pla_montant_depot
            sommeMontantxTaux=sommeMontantxTaux + (item.pla_montant_depot * item.pla_taux_profit)
            count =count+1
          }
        }
        this.tauxProfitMoyen = this.tauxProfitMoyen/count
        this.tauxProfitPondere = sommeMontantxTaux / totalDepot
      }
    )
  }

  getHistoriqueRealisation(){
    // Historique de réalisation pour avoir le Montant dépot total placements / Produits total des placements dans l'année précedente
    this.histoService.getHistoRealisationResolver().subscribe(
      res=>{
        for(let item of res ){
          if(Number(item.annee_histo_rea) == this.getTodayDate().getFullYear()){
            this.totalMontantDepot=item.montant_depot_histo_rea
            this.totalMontantProfit=item.profit_histo_rea

            // Date du jour
            this.tauxRealisationMontantDepot = this.CalculateTauxDeRealisationToday(this.totalMontantDepot,this.totalMontantProfit,this.varTotalRemunerationDateDuJour,this.montantPlacementGlobal)?.tauxRealisationDepot 
            this.tauxRealisationMontantProfitDateJour = this.CalculateTauxDeRealisationToday(this.totalMontantDepot,this.totalMontantProfit,this.varTotalRemunerationDateDuJour,this.montantPlacementGlobal)?.tauxRealisationProfitInThisDay
            // Annee comptable
            this.tauxRealisationMontantProfitAnnee= this.CalculateTauxDeRealisationYear(this.totalMontantProfit,this.varTotalRemunerationAnnee) 
            // Trimestre comptable
            this.tauxRealisationMontantProfitTrimestre = this.CalculateTauxDeRealisationTrimestre(this.totalMontantProfit,this.varTotalRemunerationTrimestre) 
          }
        }
      }
    )
  }

  CalculateTauxDeRealisationToday(montantDepotToAchieve:number,montantProfitToAchieve:number,remunerationDateDuJourCurrentDate:number,montantDepotCurrentDate:number){
    let firstDayOfYear = new Date("01/01/"+this.getTodayDate().getFullYear());
    if(montantDepotToAchieve!=0 && montantProfitToAchieve!=0){
      // Montants de la même période de l'année précédente 
      let montantProfitInThisDay= (montantProfitToAchieve * this.getDiffDaysBetween2Date(firstDayOfYear,this.getTodayDate()) ) / this.VerifLapYear()
      // Taux de realisation
      let tauxRealisationProfitInThisDay = (remunerationDateDuJourCurrentDate *100) / montantProfitInThisDay
      let tauxRealisationDepot = (montantDepotCurrentDate * 100) / montantDepotToAchieve
      return { tauxRealisationProfitInThisDay,tauxRealisationDepot }
    }
    return null;
  }

  CalculateTauxDeRealisationYear(montantProfitToAchieve:number,remunerationDateDuJourCurrentYear:number){
    let tauxRealisation= (remunerationDateDuJourCurrentYear *100) / montantProfitToAchieve
    return tauxRealisation 
  }

  CalculateTauxDeRealisationTrimestre(montantProfitToAchieve:number,remunerationTrimestreCurrentYear:number){
    let firstDayOfYear = new Date("01/01/"+this.getTodayDate().getFullYear());
    
    let montantToAcheiveInThisTrimestre = (montantProfitToAchieve * 
      (this.getDiffDaysBetween2Date(firstDayOfYear,this.getTodayDate()) + this.getProchainTrimestreComptable())) / 
      this.VerifLapYear()
      let tauxRealisation = (remunerationTrimestreCurrentYear *100) / montantToAcheiveInThisTrimestre
      return tauxRealisation

  }

  getProchainTrimestreComptable(){
    // Trimestre
    let trimestresComptable = [
      this.getTodayDate().getFullYear()+"/3/31",
      this.getTodayDate().getFullYear()+"/6/30",
      this.getTodayDate().getFullYear()+"/9/30",
      this.getTodayDate().getFullYear()+"/12/31"
    ]
    let getDifferenceDates=[]
    for(let item of trimestresComptable){
      let myDate = new Date(item) 
      if(this.getDiffDaysBetween2Date(this.getTodayDate(),myDate)>=0){
        getDifferenceDates.push(this.getDiffDaysBetween2Date(this.getTodayDate(),myDate))
      }
    }
    let nbeJourjoursTrimestreProchain = getDifferenceDates.reduce((a, b)=>Math.min(a, b));
    return nbeJourjoursTrimestreProchain
  }





}
