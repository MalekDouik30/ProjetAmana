import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthorizationWithoutRootService } from 'projects/g-acces/src/app/services/authorization-without-root.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(public router: Router,public authService:AuthorizationWithoutRootService ) { }
  listApplicationInThisComponent=["Application gestion d'accès","Application gestion de stock","Application demande de cotation"
  ,"Application suivi des placements","Application gestion de caisse","Application RH"] // WARNING: The name of functionalities in this list must be the same in the function table

  appGSuiviPlacement(){
    this.router.navigate(['gPlacement/dashboard_placement']);
  }
  appGStock(){
    this.router.navigate(['gStock/produit']);
  }
  appGAcces(){
    this.router.navigate(['gAcces/dashboard_utilisateur']);
  }
  appGDemandeCotation(){
    this.router.navigate(['404']);
  }
  appGRh(){
    this.router.navigate(['404']);
  }
  appGSuiviCaisse(){
    this.router.navigate(['404']);
  }

  ngOnInit(): void {
    this.authService.getApplications(this.listApplicationInThisComponent) 
    this.dispalyApplications(5000)
    window.location.replace('#0')
  }

  dispalyApplications(numberSecondes:number){
    setTimeout (() => {
      if(window.location.toString().includes("#0")){
      
        window.location.replace('#menu')
      }

   }, numberSecondes);
  }

}
