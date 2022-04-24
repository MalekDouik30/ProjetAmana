import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { placement } from '../Models/placement';
import { DetailsEmpService } from '../services/details-emp.service';
import { IntermediaireBService } from '../services/intermediaire-b.service';
import { OrganismeService } from '../services/organisme.service';
import { PlacementService } from '../services/placement.service';
import { TypeactionService } from '../services/typeaction.service';
import { TypecoteeService } from '../services/typecotee.service';

@Component({
  selector: 'app-simulateur-placement',
  templateUrl: './simulateur-placement.component.html',
  styleUrls: ['./simulateur-placement.component.scss']
})
export class SimulateurPlacementComponent implements OnInit {
  //required select
OrgHasError=true;
listProduitPlacement:number[]=[]
listeAnnee:number[]=[]


constructor(
  public typeactionS : TypeactionService,
  public organismeS : OrganismeService,
  public placementS : PlacementService,
  private dialog:MatDialog,
  public datepipe:DatePipe,
  public typeC: TypecoteeService,
  public interB : IntermediaireBService,
  public detaisEmpS: DetailsEmpService,

) {  }
selecthypothese=0

ngOnInit(): void {
  this.typeactionS.getTypeaction();
  this.organismeS.getOrganisme();
  this.typeC.getTypeCotee();
  this.placementS.fromData.pla_id_typ_placement = Number(localStorage.getItem("typePlacementId"))
  this.placementS.fromData.pla_id_fonds = Number(localStorage.getItem("typeFondId"))
  this.placementS.fromData.pla_id_sous_placement = Number(localStorage.getItem("typeSousPlacementId"))
  this.placementS.fromData.pla_id_sous_sous_placement = Number(localStorage.getItem("typeSousSousPlacementId"))


  this.placementS.getNameEntreprise();

}
//select required
ValidateOrg(value :any){
  if(value === 0){
  this.OrgHasError=true;
  }else {
    this.OrgHasError=false;
  }
}
///////////////////////////////////////////////////////////////////////////

//close dialog
closeDialog(monForm : NgForm){
  this.dialog.closeAll();
  this.resetForm(monForm);
  //window.location.reload();
}
///////////////////////////////////////////////////////////////////////////

//insert data

///////////////////////////////////////////////////////////////////////////
// confirm form

///////////////////////////////////////////////////////////////////////////

// reset from
resetForm(monForm:NgForm){
  monForm.form.reset();
  this.placementS.fromData = new placement();
}
///////////////////////////////////////////////////////////////////////////
//reset champs form
resetTypeAction(monForm:NgForm){

  //this.placementS.fromData.pla_id_type_action=0;
  this.placementS.fromData.pla_organisme_societe=0;

  this.placementS.fromData.pla_taux_profit=0;
  //this.placementS.fromData.pla_id_type_action=0;
  this.placementS.fromData.pla_prix_jour=0;
  this.placementS.fromData.pla_value_consome_date_jour=0;
  this.placementS.fromData.pla_value_consome_trimestre_comptable=0;
  this.placementS.fromData.pla_value_consome_annee_comptable= 0;

 this.placementS.fromData.pla_societe=" ";
 this.placementS.fromData.pla_nbr_action=0;
 this.placementS.fromData.pla_prix_achat=0;
 this.placementS.fromData.pla_montant_depot=0;
 this.placementS.fromData.pla_date_souscription=" ";
 this.placementS.fromData.pla_date_echeance=" ";
 this.placementS.fromData.pla_mois=0;
 this.placementS.fromData.pla_produits_placement_consommes_ech_final=0;
}


///////////////////////////////////////////////////////////////////////////
//Clcuper produit placement compte rémunéré
/*
oncalculeCompteR(){
  if(this.placementS.fromData.pla_montant_depot!=null && this.placementS.fromData.pla_taux_profit!=null){
  let MntD = this.placementS.fromData.pla_montant_depot
  let taux = this.placementS.fromData.pla_taux_profit
  let res = MntD*taux
  this.placementS.fromData.pla_value_consome_annee_comptable=res
  }

}*/
///////////////////////////////////////////////////////////////////////////
/*************************************************************************/
//calculer le montant depot action cotee

onCalculeMntD1(){
  if(this.placementS.fromData.pla_prix_achat!=null && this.placementS.fromData.pla_nbr_action!=null){
  var PrixA = this.placementS.fromData.pla_prix_achat
  var NbrA =this.placementS.fromData.pla_nbr_action
  var res = PrixA*NbrA
  this.placementS.fromData.pla_montant_depot=res

}
}
///////////////////////////////////////////////////////////////////////////
//calculer le montant depot
onCalculeMntD():any{
  if(this.placementS.fromData.pla_prix_achat!=null && this.placementS.fromData.pla_nbr_action!=null&& this.placementS.fromData.pla_prix_jour!=null){
  let PrixJ=this.placementS.fromData.pla_prix_jour
  //this.placementS.fromData.pla_prix_achat=PrixJ
  var PrixA = this.placementS.fromData.pla_prix_achat
  var NbrA =this.placementS.fromData.pla_nbr_action
  var res = PrixA*NbrA
  this.placementS.fromData.pla_montant_depot=res
  //this.placementS.fromData.pla_value_consome_date_jour=res
  //return res
    let NbrJ =this.placementS.fromData.pla_prix_jour
    let res1 = NbrA*NbrJ
    this.placementS.fromData.pla_montant_actualise=res1
    var result = res1-res
    this.placementS.fromData.pla_value_consome_date_jour=result
    return res1
    //  +/-value à la date du jour

    /*if(this.placementS.fromData.pla_value_consome_date_jour >0){
         this.placementS.fromData.pla_value_consome_date_jour=this.placementS.fromData.pla_montant_depot
    }*/
  }
}
///////////////////////////////////////////////////////////////////////////
//calculer le montant Actualisé

onCalculeMntDA(){

   if(this.placementS.fromData.pla_prix_achat!=null && this.placementS.fromData.pla_prix_jour!=null){
  let NbrA =this.placementS.fromData.pla_nbr_action
  let NbrJ =this.placementS.fromData.pla_prix_jour
  let res1 = NbrA*NbrJ
  this.placementS.fromData.pla_montant_actualise=res1
  let res=this.onCalculeMntD()
  //+/-value
  var result = res1 - res
  this.placementS.fromData.pla_value_consome_date_jour=result
  //let PrixJ=this.placementS.fromData.pla_prix_jour
  //this.placementS.fromData.pla_prix_achat=PrixJ

}

}
///////////////////////////////////////////////////////////////////////////
//retourner  nombres de jours entre une date bien détéminée

addDays(days : number,futureDate:Date): Date{
  futureDate.setDate(futureDate.getDate() + days);
  return futureDate;
}
////////////////////////////////////////////////////////////////////////////
//retourner  nombres de jours entre une date bien détéminée

/*
elBarakaCalcule(days : number,futureDate:Date): Date{
  futureDate.setDate(futureDate.getDate() - days);
  return futureDate;
}*/

////////////////////////////////////////////////////////////////////////////
// *Difference entre 2 dates = nombres de jours  (date souscription- date systéme )

CalculerDiffDate(){
  let myDateS = new Date(this.placementS.fromData.pla_date_souscription)

  let dateSys=new Date()
  var Diff_temps = myDateS.getTime() - dateSys.getTime()

  var Diff_jours = Diff_temps / (1000 * 3600 * 24)
  //console.log("fffffffffffff")

  //console.log(Diff_jours)
  Diff_jours= Math.abs(Math.trunc(Diff_jours))
  //console.log("date difference ")
  //console.log(Diff_jours)
  return Diff_jours
}
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
//ajouter nombre de mis à date systéme
oncalculeMois():Date{

  var m = this.placementS.fromData.pla_mois;
  var d=new Date(this.placementS.fromData.pla_date_souscription); // date du jour
  m= (d.getMonth() + m );
  d.setMonth(m);
  return d
  }
////////////////////////////////////////////////////////////////////////////////////
// *Difference entre 2 dates = nombres de jours  (date souscription- date antérieur)

CalculerDiffDateDuree(){
  let myDateS = this.oncalculeMois()

  let dateSys=new Date(this.placementS.fromData.pla_date_souscription)
  var Diff_temps = myDateS.getTime() - dateSys.getTime()

  var Diff_jours = Diff_temps / (1000 * 3600 * 24)
 // console.log(Diff_jours)
  Diff_jours= Math.abs(Math.trunc(Diff_jours))
  console.log("Difference entre 2 dates = nombres de jours  (date souscription- date antérieur)")
  console.log(Diff_jours)
  return Diff_jours
}
////////////////////////////////////////////////////////////////////////////////////
// *Difference entre 2 dates = nombres de jours  (date souscription-31/12/annee)

CalculerDiffDate2(){
  //let myDateS = new Date(this.placementS.fromData.pla_date_souscription)

  let dateSys=new Date(this.placementS.fromData.pla_date_souscription)
  let dateSys2= dateSys.getFullYear()+"/12/31"
  var Diff_temps = dateSys.getTime() - new Date(dateSys2).getTime()
  var Diff_jours = (Diff_temps / (1000 * 3600 * 24) )
  Diff_jours= Math.abs(Math.trunc(Diff_jours)-2)
  //console.log("Difference entre 2 dates = nombres de jours  (date souscription-31/12/annee)")
 // console.log(Diff_jours)
  return Diff_jours

}
////////////////////////////////////////////////////////////
//calculer produits placements fin echeance

CalculerDiffecheance(){
  let myDateS = new Date(this.placementS.fromData.pla_date_echeance)

  let dateSys=new Date(this.placementS.fromData.pla_date_souscription)
  var Diff_temps = myDateS.getTime() - new Date(dateSys).getTime()
  var Diff_jours = (Diff_temps / (1000 * 3600 * 24) )
  Diff_jours= Math.abs(Math.trunc(Diff_jours))
  //console.log("Difference entre 2 dates = nombres de jours  (date souscription-date echeance)")
 // console.log(Diff_jours)
  return Diff_jours

}
//////////////////////////////////////////////////////////////////
//Vérifier si annee bisextille ou non
CalculerAnneeBisextille():any{
  let myDateS = new Date(this.placementS.fromData.pla_date_souscription)
  let myDateS1= myDateS.getFullYear()
  if (myDateS1 / 4 == 0)
  { if ( 100 / myDateS1 == 0 )
     { if ( 400 / myDateS1  ==0)
     {
      var res =366
      return res
      }
    }
  } else
  {
      var res =365
      return res
  }
}
VerifAnneeBisextille():any{
  let annee= this.placementS.fromData.pla_duree
  let myDateS = new Date(this.placementS.fromData.pla_date_souscription)
  let annee_actuel= myDateS.getFullYear()
  let listannee:number[]=[]
  let listnombrejours:number[]=[]
// remlir liste des années
  for(let i=0;i<annee;i++){
    if(i==0){
      listannee.push(annee_actuel)

    }else
    {
      listannee.push(annee_actuel +i)
    }
    console.log(listannee)

  }
  // remlir liste des nombres des jours

  for(let i=0 ;i < listannee.length ; i++){
  /*if (listannee[i] % 4 == 0)
    {
      if ( 100 / listannee[i]  == 0 )
      {
        if ( 400/ listannee[i] == 0)
        {
          alert("512")
          var res =366
          listnombrejours.push(res)
        }
      }
    }
   else
    {
      var res =365
      listnombrejours.push(res)
    }
    */
    if ((listannee[i] % 4 == 0) && (listannee[i] % 100 !=0 || listannee[i] % 400 ==0) ) {
      listnombrejours.push(366)
    }
    else{
      listnombrejours.push(365)
    }
}
listnombrejours[0]=listnombrejours[0]-1

console.log(listnombrejours)
var sum = listnombrejours.reduce((acc, cur) => acc + cur, 0);
console.log(sum)
return sum

}
//////////////////////////////////////////////////////////////////
//calculer PPDateJour
CalculerPPDateJour(){
  let MntD = this.placementS.fromData.pla_montant_depot
  let taux = this.placementS.fromData.pla_taux_profit
  var s1 =this.CalculerAnneeBisextille()
  var result = ((MntD*taux)/100)/s1
  var result1 = (this.CalculerDiffDate())
  var result2 = result*result1
  var result3 = result2.toFixed(3)
  this.placementS.fromData.pla_produits_placement_consommes_date_jour=Number(result3)
}

//////////////////////////////////////////////////////////////////
//calculer PPTrimestreCom


CalculerPPTrimestreCom(){
 // let MntD = this.placementS.fromData.pla_montant_depot
  //let taux = this.placementS.fromData.pla_taux_profit
  //var s1 =this.CalculerAnneeBisextille()
  //var result = ((MntD*taux)/100)/s1
  //var result1 = (90/s1)
  var res1 = this.CalculeTrimestre().toFixed(3)
  //console.log("calcule trimestre")
  //console.log(res1)
  //var resfinal = res1.toFixed(3)
  //console.log(resfinal)

  this.placementS.fromData.pla_produits_placement_consommes_trimestre_comptable=Number(res1)
  //this.CalculeTrimestre()
}
//////////////////////////////////////////////////////////////////
//calculer CalculerPPAnneeCom
CalculerPPAnneeCom(){
  let MntD = this.placementS.fromData.pla_montant_depot

  let taux = this.placementS.fromData.pla_taux_profit

  var s1 =this.CalculerAnneeBisextille()
 // console.log("CalculerPPAnneeCom : annee ")
 // console.log(s1)
  var result = ((MntD*taux)/100)/s1
 // console.log("resultat CalculerPPAnneeCom ((MntD*taux)/100)/s1")
  var a1=this.CalculerDiffDate2()

 // console.log("calculer difference CalculerPPAnneeCom")
 // console.log(a1)
  var resfinal = result*a1
//  console.log("calculer resultat final CalculerPPAnneeCom ")
 // console.log(resfinal)
  var res1 = resfinal.toFixed(3)
 // console.log(res1)

  this.placementS.fromData.pla_produits_placement_consommes_annee_comptable=Number(res1)

}
/////////////////////////////////
//calculer CalculerPPFinEcheance
CalculerPPFinEcheance(){
  let MntD = this.placementS.fromData.pla_montant_depot
  let taux = this.placementS.fromData.pla_taux_profit

  var s1 =this.CalculerAnneeBisextille()
  var result = ((MntD*taux)/100)/s1
  var a1=this.CalculerDiffecheance()
  //console.log("calcule date echeance")
  //console.log(a1)
  //Calculer annee
  if(this.placementS.fromData.pla_organisme_societe==1 && this.placementS.fromData.pla_duree!=0 ){

    var result = ((MntD*taux)/100)/(s1)
   // console.log("calculer resulet fin echenace annee")
    //console.log(result)

    var a1=this.CalculerDiffecheance() -2
   // console.log("calcule date echeance annee")
   // console.log(a1)

  }
  //calcule mois
  if(this.placementS.fromData.pla_duree==0 && this.placementS.fromData.pla_mois!==0){

    var result = ((MntD*taux)/100)/(s1)
   // console.log("calculer resulet fin echenace")
  //  console.log(result)
    var a1=this.CalculerDiffDateDuree()
  //  console.log("calcule date echeance")
   // console.log(a1)
    var resfinal = result*a1
    var res1 = resfinal.toFixed(3)
    this.placementS.fromData.pla_produits_placement_consommes_ech_final=Number(res1)
    this.placementS.fromData.pla_produits_placement_consommes_annee_comptable=Number(res1)


  }
  if(this.placementS.fromData.pla_organisme_societe==2||this.placementS.fromData.pla_organisme_societe==3||this.placementS.fromData.pla_organisme_societe==4){
    var result = ((MntD*taux)/100)/(s1)
   // console.log("calculer resulet fin echenace")
   // console.log(result)
    var a1=this.CalculerDiffecheance()
  //  console.log("calcule date echeance")
  //  console.log(a1)
  }
 // console.log("result 1")
 // console.log(result)
  //console.log("aaaaaaaaaaaaaaaaaaaa")
  //console.log(a1)
  var resfinal = result*a1
 // console.log("result final")
 // console.log(resfinal)
  var res1 = resfinal.toFixed(3)
 // console.log(res1)

  this.placementS.fromData.pla_produits_placement_consommes_ech_final=Number(res1)
  if(this.placementS.fromData.pla_organisme_societe==1||this.placementS.fromData.pla_organisme_societe==2||this.placementS.fromData.pla_organisme_societe==3||this.placementS.fromData.pla_organisme_societe==4){
  //this.placementS.fromData.pla_produits_placement_consommes_annee_comptable=Number(res1)
  }
  //this.placementS.fromData.pla_produits_placement_consommes_annee_comptable=Number(res1)
}

////////////////////////////////////////////////////////////////////////
// calculer date d'échance
onCalculeDateEchance(){

  if(this.placementS.fromData.pla_organisme_societe!=0 && this.placementS.fromData.pla_date_souscription!=null && (this.placementS.fromData.pla_duree!=0 || this.placementS.fromData.pla_mois!=0 )){
    this.calculeEmpruntObligataire()
    /* el baraka */
    /*if(this.placementS.fromData.pla_organisme_societe == 1){
      let myDate = new Date(this.placementS.fromData.pla_date_souscription)

      let numberDays = this.placementS.fromData.pla_duree*365
      var futureDate = this.addDays(numberDays,myDate)
      futureDate=this.elBarakaCalcule(this.placementS.fromData.pla_duree*2,futureDate)
      let resCalculeEchance=this.datepipe.transform(futureDate, 'yyyy-MM-dd') || '{}';
      this.placementS.fromData.pla_date_echeance =resCalculeEchance

    }*/
    /////////////////////////////////////////////////////////////////////////////////
    if(this.placementS.fromData.pla_organisme_societe != 0 && this.placementS.fromData.pla_duree!=0 && this.placementS.fromData.pla_mois !=0){
      let myDate = new Date(this.placementS.fromData.pla_date_souscription)
      var s1 =this.CalculerAnneeBisextille()
      let numberDays = this.VerifAnneeBisextille() + this.CalculerDiffDateDuree()
      console.log("number days anne +month")
      console.log(numberDays)
      var futureDate = this.addDays(numberDays,myDate)
      let resCalculeEchance=this.datepipe.transform(futureDate , 'yyyy-MM-dd') || '{}';
      this.placementS.fromData.pla_date_echeance = resCalculeEchance

    }
    if(this.placementS.fromData.pla_organisme_societe != 0 && this.placementS.fromData.pla_duree == 0 && this.placementS.fromData.pla_mois !=0){
      let myDate = new Date(this.placementS.fromData.pla_date_souscription)
      let s1 =this.CalculerAnneeBisextille()
      let numberDays =  this.CalculerDiffDateDuree() -1
      console.log("number days months")
      console.log(numberDays)
      var futureDate = this.addDays(numberDays,myDate)
      let resCalculeEchance=this.datepipe.transform(futureDate , 'yyyy-MM-dd') || '{}';
      this.placementS.fromData.pla_date_echeance = resCalculeEchance
    }

      if(this.placementS.fromData.pla_organisme_societe != 0 && this.placementS.fromData.pla_duree !=0 && this.placementS.fromData.pla_mois ==0){
        let myDate = new Date(this.placementS.fromData.pla_date_souscription)
        let s1 =this.CalculerAnneeBisextille()
        console.log("annee")
        console.log(s1)
       // let numberDays = (this.placementS.fromData.pla_duree*(s1) +this.VerifAnneeBisextille() )
       let numberDays = this.VerifAnneeBisextille();
        console.log("nombre jours")
        console.log(numberDays)
        var futureDate = this.addDays(numberDays,myDate)
        let resCalculeEchance=this.datepipe.transform(futureDate , 'yyyy-MM-dd') || '{}';
        this.placementS.fromData.pla_date_echeance = resCalculeEchance
      }


    this.CalculerPPDateJour()
    this.CalculerPPAnneeCom()
    this.CalculerPPTrimestreCom()
    this.CalculerPPFinEcheance()


  }



}
/*
formaterDate(){
  this.placementS.fromData.pla_date_souscription=this.datepipe.transform(this.placementS.fromData.pla_date_souscription, 'yyyy-MM-dd') || '{}';

}*/
///////////////////////////////////////////////////////////////
// recupere prix du jour (web scraping)
getTodayPrice(nomEntreprise:string){

  this.placementS.getPriceAction(nomEntreprise).subscribe(
    res=>{
      this.placementS.fromData.pla_prix_jour=Number(res)
    },
    err=>{
      this.placementS.fromData.pla_prix_jour=0
    }
  )
  /*
  if(this.placementS.fromData.pla_societe!=null){
    this.placementS.getPriceAction(nomEntreprise)

    this.placementS.fromData.pla_prix_jour =  Number(this.placementS.prixEntreprise)
  }
  else{
    this.placementS.fromData.pla_prix_jour=0
  }*/

}

detectChangeTypePlacement(){
  this.placementS.fromData.pla_organisme_societe =0;
  this.placementS.fromData.pla_interB =0;
  this.placementS.fromData.pla_societe="";
  this.placementS.fromData.pla_montant_depot=0;
  this.placementS.fromData.pla_taux_profit =0;
  this.placementS.fromData.pla_date_souscription="";
  this.placementS.fromData.pla_date_echeance ="";
  this.placementS.fromData.pla_duree =0;
  this.placementS.fromData.pla_taux_retenue =0;
  this.placementS.fromData.pla_action_cotee =0;
  this.placementS.fromData.pla_nbr_action =0;
  this.placementS.fromData.pla_Vliqui=0;
  this.placementS.fromData.pla_prix_achat =0;
  this.placementS.fromData.pla_prix_jour =0;
  this.placementS.fromData.pla_montant_actualise=0;
  this.placementS.fromData.pla_value_consome_date_jour =0;
  this.placementS.fromData.pla_value_consome_trimestre_comptable =0;
  this.placementS.fromData.pla_value_consome_annee_comptable =0;
  this.placementS.fromData.pla_produits_placement_consommes_date_jour =0;
  this.placementS.fromData.pla_produits_placement_consommes_trimestre_comptable =0;
  this.placementS.fromData.pla_produits_placement_consommes_annee_comptable =0;
  this.placementS.fromData.taux_moudharba =0;
  //pla_prix_Aqui=0;
  this.placementS.fromData.pla_mont_inve=0;
  this.placementS.fromData.pla_delegation=0;
  this.placementS.fromData.pla_mois=0;
  this.placementS.fromData.pla_produits_placement_consommes_ech_final=0;
}
/////////////////////////////////////////////////////////////////
//emprunts obligataires
calculeEmpruntObligataire(){

  this.listProduitPlacement=[]
  this.listeAnnee=[]

  let montant=this.placementS.fromData.pla_montant_depot
  let duree=this.placementS.fromData.pla_duree
  let taux=this.placementS.fromData.pla_taux_profit


  let myList2:number[]=[]

  let getCurrentYear=  new Date().getFullYear()

    for (let i = 0; i <duree; i++) {
      if(i==0){
        this.listProduitPlacement.push( (montant/duree) + (montant*(taux/100)) )
        myList2.push(montant)
      }
      if(i!=0){

        myList2.push(myList2[i-1]-(montant/duree))
        this.listProduitPlacement.push(myList2[i]*(taux/100)+(montant/duree))
      }
    }

    for (let i = 0; i <duree; i++) {
      this.listeAnnee.push(getCurrentYear)
      getCurrentYear=getCurrentYear+1
    }


 // return{listProduitPlacement,listeAnnee}
}

///////////////////////////////////////////////////////
/*trimestre*/
getTodayDate():Date{
      let myDate = new Date();
      return myDate
    }
    calculateDiff(dateSouscription:string,currentDate:Date){
      let date = new Date(dateSouscription);
      let days = Math.floor(( date.getTime() - currentDate.getTime()) / 1000 / 60 / 60 / 24);
     // console.log("days")
     // console.log(days)
      return Math.abs(days);
    }

    calculeRenumerationAvecNbeJours(nbeJour :number,tauxProfit:number,montantDepot:number,nbeJourAnnee:number){
     // console.log(nbeJour)
     // console.log(tauxProfit)
     // console.log(montantDepot)
     // console.log(nbeJourAnnee)

      let resultat = (((tauxProfit/100) * montantDepot) /nbeJourAnnee)*nbeJour

     // console.log("resultat trimestre")
     // console.log(resultat)
      return resultat
    }


    CalculeTrimestre():any{
      // Trimestre
      let trimestresComptable = [
        this.getTodayDate().getFullYear()+"/3/31",
        this.getTodayDate().getFullYear()+"/6/30",
        this.getTodayDate().getFullYear()+"/9/30",
        this.getTodayDate().getFullYear()+"/12/31"]
        let getDifferenceDates=[]



        // Trimestre
      for(let item of trimestresComptable){
        if(this.calculateDiff(item,this.getTodayDate())>=0){
          getDifferenceDates.push(this.calculateDiff(item,this.getTodayDate()))
        }
      }
        let nbeJourjoursTrimestreProchain = getDifferenceDates.reduce((a, b)=>Math.min(a, b)) +this.calculateDiff(this.placementS.fromData.pla_date_souscription ,this.getTodayDate()) ;

        this.placementS.fromData.pla_produits_placement_consommes_trimestre_comptable  =  this.calculeRenumerationAvecNbeJours(nbeJourjoursTrimestreProchain,this.placementS.fromData.pla_taux_profit,this.placementS.fromData.pla_montant_depot,365)
      //  console.log("resss final")
      //  console.log(this.placementS.fromData.pla_produits_placement_consommes_trimestre_comptable)
 return this.placementS.fromData.pla_produits_placement_consommes_trimestre_comptable
        //this.varTotalRemunerationTrimestre =  this.varTotalRemunerationDateDuJour+ this.varTotalRemunerationTrimestre




}


}
