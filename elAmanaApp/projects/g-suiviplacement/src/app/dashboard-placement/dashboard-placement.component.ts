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
import { MatTableDataSource } from '@angular/material/table';
import { FormatNumberPipe } from 'projects/shared-project/src/app/Models/FormatNumber';
import { ExportExcel } from 'projects/shared-project/src/app/Models/ExportExcel';
import { DetailsEmpService } from '../services/details-emp.service';

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

  //Table
  dataSource:MatTableDataSource<any>;

  // For Barchart3
  listNomEntrepriseCotes:string[]=[]
  listPrixJour:number[]=[]
  listPrixAchat:number[]=[]

  listDernierTauxPlacementParBanque:any[]=[]

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
   this. getDetailPlacementFinancier();
   this.getDetailPlacementImmobilier();
   this.totalRemunerationJourTriAnn();





   }

  /*
   countSumPlacement(typePlacementId:number,typeFond:number,typeSousPlacement:number,
    typeSousSousPlacement:number,typeAction:number){

      this.listPlacement=[]
      this.displayedColumns=[]
      this.displayedRowsSelected=""

      this.placementService.getPlacementResolver().subscribe(
        res=>{
          for(let item of res){
            if(typePlacementId == item.pla_id_typ_placement && typeFond == item.pla_id_fonds){
                if(typeSousPlacement == item.pla_id_sous_placement){
                  if(typeAction==0 && typeSousSousPlacement ==0 &&  item.pla_id_type_action!=6 &&  item.pla_id_type_action!=7){
                    this.displayedColumns = ["Institution Financière","Montant Dépot","Taux Profit %","Date Souscription","Date d'échance","Durée (année)",
                    "P.P.C à la date du jour", "P.P à la fin du trimestre comptable","P.P à la fin de l'année comptable"];

                    this.listPlacement.push(item)
                    this.displayedRowsSelected="Action1-5"

                  }
                  if(typeAction!=0 && typeSousSousPlacement ==0){
                    if(typeAction == item.pla_id_type_action && typeAction !=7){
                    this.displayedColumns = ["Société","Nombre d'action","Prix d'achat","pla_montant_depot","Montant investi","Date d'achat","Prix du jour",
                    "Prix d'achat", "Montant actualisé","+/-Value consommés à la date du jour","+/- Value à la fin du trimestre comptable","+/- Value à la fin de l'année comptable"];
                      this.listPlacement.push(item)
                      this.displayedRowsSelected="Action7"

                    }
                    if(typeAction == item.pla_id_type_action && typeAction ==7){
                      this.displayedRowsSelected="Action8"
                      this.listPlacement.push(item)
                      this.displayedColumns = ["Montant","Date d'acquisition","Valeur liquidative","+/- Value à la fin de l'année comptable"];
                    }

                  }
                  if(typeAction==0 && typeSousSousPlacement !=0){
                    if(typeSousSousPlacement == item.pla_id_sous_sous_placement){
                      this.listPlacement.push(item)
                      this.displayedRowsSelected="ActionSousSousPlacement"
                    }
                  }
              }
              if(typeSousPlacement != item.pla_id_sous_placement){
                // Placement Immobilier
                this.displayedRowsSelected="ActionImmobilier"
                this.displayedColumns = ["Délégation","Prix d'acquisition","Codification"]
                this.listPlacement.push(item)
              }


            }
          }
          console.log(this.listPlacement)
          //
        })
    }

    */


  /*
   countSumPlacementByAction(typePlacementId:number,typeFond:number,typeSousPlacement:number,
    typeSousSousPlacement:number,typeAction:number){

      let count=0
      let sumMontant=0
      let listAction:number[]=[]
      let listSSPlacement:number[]=[]

    this.placementService.getPlacementResolver().subscribe(
      res=>{
        for(let item of res){

          if(typePlacementId == item.pla_id_typ_placement && typeFond == item.pla_id_fonds && typeSousPlacement == item.pla_id_sous_placement){
              count = count + 1
              sumMontant = sumMontant + item.pla_montant_depot
              if(typeAction==0 && typeSousSousPlacement ==0){
               // l'utilisateur à clicqué sur type sous placement
               // Détecter dynamiquement les differentes actions

               if(!listAction.includes(item.pla_id_type_action)){
                listAction.push(item.pla_id_type_action)
               }
              }

              if(typeAction==0 && typeSousSousPlacement !=0){
                alert("VVVVVVVVVV")
                // l'utilisateur à clicqué sur type sous sous placement donc il veux avoir tous les actions correspondant à ce sous sous placement
                // Détecter dynamiquement les differentes actions
                if(!listAction.includes(item.pla_id_type_action)){
                 listAction.push(item.pla_id_type_action)
                }
               }
          }
        }
        // Displaying Action in dashbord
         if(listAction.length > 0){
          let libelleAction:string[]=[]
          let countByAction:number[]=[]
          let sumByAction:number[]=[]

            for (let item of listAction ){
              for(let item2 of this.typeActionService.listaction){
                 if(item == item2.typ_act_id){
                   libelleAction.push(item2.typ_act_libelle)
                  }
              }
              let count=0
              let sum=0
              for(let item3 of res){
                if(item == item3.pla_id_type_action){
                  count=count+1
                  sum=sum+item3.pla_montant_depot
                }
              }
              countByAction.push(count)
              sumByAction.push(sum)
            }
            console.log("*******************************************")
            console.log("CountFunction")
            console.log(libelleAction)
            console.log(countByAction)
            console.log(sumByAction)
            console.log("*******************************************")

            }
      },

      err=>{
        console.log(console.error());
      }
    );
   }
  */

   /***************************************************************** */
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
    getTodayDate():Date{
      let myDate = new Date();
      return myDate
    }
    calculateDiff(dateSouscription:string,currentDate:Date){
      let date = new Date(dateSouscription);
      let days = Math.floor(( date.getTime() - currentDate.getTime()) / 1000 / 60 / 60 / 24);
      return days;
    }

    calculeRenumerationAvecNbeJours(nbeJour :number,tauxProfit:number,montantDepot:number,nbeJourAnnee:number){
      let resultat = (((tauxProfit/100) * montantDepot) /nbeJourAnnee)*nbeJour
      return resultat
    }

    totalRemunerationJourTriAnn(){
      // Trimestre
      let trimestresComptable = [
        this.getTodayDate().getFullYear()+"/3/31",
        this.getTodayDate().getFullYear()+"/6/30",
        this.getTodayDate().getFullYear()+"/9/30",
        this.getTodayDate().getFullYear()+"/12/31"]
        let getDifferenceDates=[]

      // Annee
      let anneeComptable=this.getTodayDate().getFullYear()+"/12/31"

        // Trimestre
      for(let item of trimestresComptable){
        if(this.calculateDiff(item,this.getTodayDate())>=0){
          getDifferenceDates.push(this.calculateDiff(item,this.getTodayDate()))
        }
      }
        let nbeJourjoursTrimestreProchain = getDifferenceDates.reduce((a, b)=>Math.min(a, b));
        let nbeJourAnneeProchainne = this.calculateDiff(anneeComptable,this.getTodayDate())

        this.placementService.getPlacementResolver().subscribe(
          res=>{
            let nbejour=0
            for(let item of res){
              if(this.calculateDiff(item.pla_date_echeance,this.getTodayDate())>0){
              nbejour = Math.abs(this.calculateDiff(item.pla_date_souscription,this.getTodayDate()))
              this.varTotalRemunerationDateDuJour = this.varTotalRemunerationDateDuJour + this.calculeRenumerationAvecNbeJours(nbejour,item.pla_taux_profit,item.pla_montant_depot,365)
              this.varTotalRemunerationTrimestre  =  this.varTotalRemunerationTrimestre + this.calculeRenumerationAvecNbeJours(nbeJourjoursTrimestreProchain,item.pla_taux_profit,item.pla_montant_depot,365)
              this.varTotalRemunerationAnnee = this.varTotalRemunerationAnnee + this.calculeRenumerationAvecNbeJours(nbeJourAnneeProchainne,item.pla_taux_profit,item.pla_montant_depot,365)
            }
            }

            this.varTotalRemunerationTrimestre =  this.varTotalRemunerationDateDuJour+ this.varTotalRemunerationTrimestre
            this.varTotalRemunerationAnnee = this.varTotalRemunerationDateDuJour +  this.varTotalRemunerationAnnee
          }
        )
    }
    getPlacementByType(typePlacementId:number,typeFond:number,typeSousPlacement:number,
      typeSousSousPlacement:number,typeAction:number){
        this.listPlacement=[]
        this.displayedColumns = []
        this.placementService.getPlacementResolver().subscribe(
          res=>{
            if(typeAction == 5){
              // Compte rémunéré
              this.displayedColumns = ["Etablissement","Placements","Date Souscriptions","Taux d'intérêt %","Fonds","Nature","Montant dépot"];
            }
            if(typeAction == 6){
              // Action
              this.displayedRowsSelected ="AffichageParTypePlacementAction6"
              this.placementService.getPlacementResolverAction()
              this.displayedColumns = ["Etablissement","Placements","Date d'achat","Prix d'achat","Prix du jour","Montant dépot","Fonds","Nature"
              ,"Value consommés à la date du jour"];

            }
            if(typeAction == 7){
              //FCPR
              this.displayedRowsSelected ="AffichageParTypePlacementAction7"
              this.displayedColumns = ["Montant","Date d'acquisition","Valeur liquidative",
              "Value à la fin l'année comptable"]
            }
            if(typeAction == 1 || typeAction == 2 || typeAction == 3 ){
              this.displayedRowsSelected ="AffichageParTypePlacementAction1-3"
              this.displayedColumns = ["Etablissement","Placements","Date Souscriptions","Date d'échéance","Durée du Placement","Taux d'intérêt %","Fonds","Nature",
                    "Montant dépot","Value consommés à la date du jour","Value à la fin du trimestre comptable"," Value à la fin de l'année comptable"];
            }

            if(typePlacementId == 2){
              // Placement Immobilier
              this.displayedRowsSelected ="AffichageParTypePlacementImmoblier"
              this.displayedColumns = ["Placements","Date Souscriptions","Fonds","Montant dépot","Prix d'investisement"];
            }

            for(let item of res){
              if(typeAction == 4){
                // Emprunt Obligataire
                this.displayedRowsSelected ="AffichageParTypePlacementAction4"
                this.displayedColumns = ["Etablissement","Placements","Date Souscriptions","Date d'échéance","Durée du Placement","Taux d'intérêt %","Fonds","Nature",
                "Montant dépot","Hypothèse"];

                this.detailEmpService.getDetailsEmpResolver().subscribe(
                  res2=> {
                    let count=0
                    for(let i of res2){
                      if(i.pla_id == item.pla_id){
                        item.pla_action_cotee=2 // Ghacha dans l'affichage de: hypothese 1 ou 2 du Emprunts obligataires
                        count=count+1
                        this.displayedColumns.push("Rénumération année "+count)
                      }else{
                        item.pla_action_cotee=1 // Ghacha dans l'affichage de: hypothese 1 ou 2 du Emprunts obligataires
                      }
                    }
                  }
                )
              }
              if( typePlacementId== item.pla_id_typ_placement && item.pla_id_fonds==typeFond && typeSousPlacement == item.pla_id_sous_placement &&
                typeSousSousPlacement == item.pla_id_sous_sous_placement && item.pla_id_type_action == typeAction){
                  this.listPlacement.push(item)
              }
            }
          }
        )
      }

    selectedFilterTable(){
      this.listPlacement=[]
      this.displayedColumns=[]
      this.totaleMontantDepotTableau =  0
      this.totalRemunerationDateJourTableau=0
      this.totalRemunerationTrimestreComptableTableau=0
      this.totalRemunerationAnneeComptableTableau = 0
      this.totaleInteretBanqueTableau=0

      if(this.searchDisplayingFilter == 1){

        this.displayedRowsSelected="AffichageParTypePlacement"

        const myArray = this.typePlacement.split("+")
        let typePlacementId=Number(myArray[0])
        let typeFondId = Number(myArray[1])
        let typeSousPlacementId = Number(myArray[2])
        let typeSousSousPlacementId = Number(myArray[3])
        let typeActionId =Number(myArray[4])


        console.log("Type Placement :"+typePlacementId)
        console.log("Type Fonds :"+typeFondId)
        console.log("Type Sous Placement :"+ typeSousPlacementId)
        console.log("Type Sous sous Placement :" + typeSousSousPlacementId)
        console.log("Type Action Placement :"+ typeActionId)
        console.log("-------------------------------")

        this.getPlacementByType(typePlacementId,typeFondId,typeSousPlacementId,
          typeSousSousPlacementId,typeActionId)
      }

      if(this.searchDisplayingFilter == 2 && this.institutionFinanciereSelected!=0 ){
        this.placementService.getPlacementResolver().subscribe(
          res=>{
            for(let item of res){
              if(this.institutionFinanciereSelected == item.pla_organisme_societe){

                this.totaleMontantDepotTableau =  this.totaleMontantDepotTableau + item.pla_montant_depot
                this.totalRemunerationDateJourTableau=this.totalRemunerationDateJourTableau + item.pla_produits_placement_consommes_date_jour
                this.totalRemunerationTrimestreComptableTableau=this.totalRemunerationTrimestreComptableTableau + item.pla_produits_placement_consommes_trimestre_comptable
                this.totalRemunerationAnneeComptableTableau = this.totalRemunerationAnneeComptableTableau + item.pla_produits_placement_consommes_annee_comptable
                this.totaleInteretBanqueTableau=this.totaleInteretBanqueTableau + item.pla_taux_profit

                this.listPlacement.push(item)
                this.displayedRowsSelected="AffichageParInstitutionFinanciere"
                this.displayedColumns = ["Etablissement","Placements","Date Souscriptions","Date d'échéance","Durée du Placement","Taux d'intérêt %","Fonds","Nature",
                  "Montant dépot","Value consommés à la date du jour","Value à la fin du trimestre comptable"," Value à la fin de l'année comptable"];
              }
            }
          }
        )
      }
    }

   changeViewCard(viewPlacement:string){
    this.changeView=viewPlacement
  }

  calculeTauxRemuneration(){
    
  }



}
