import { Component, OnInit } from '@angular/core';
import { TypeutilisateurService  } from '../services/typeutilisateur.service';
import { User } from '../Models/User';
import { UserService } from '../services/user.service';
import { TypeUtilisateur } from '../Models/TypeUtilisateur';
import { ModuleService } from '../services/module.service';
import { ApplicationService } from '../services/application.service';
import { FonctionService } from '../services/fonction.service';
import { Module } from '../Models/Module';
import { Application } from '../Models/Application';
import { Fonction } from '../Models/Fonction';
import { Role } from '../Models/Role';
import { RoleService } from '../services/role.service';

import Chart from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(
    public userService:UserService,
    public modService:ModuleService,
    public appService:ApplicationService,
    public fonService:FonctionService,
    public rolService:RoleService,
    public typeUtiService:TypeutilisateurService,
    ) {}

  listTypesUtilisateur: TypeUtilisateur[];
  listUtilisateurs: User[];
  listmodules: Module[];
  listapplications: Application[];
  listfonctions: Fonction[];
  listroles: Role[];

   arrayTypesCount:number[]=[];
   arrayTypesLibelle:string[]=[];

   ngOnInit(): void {
    this.typeUtiService.getTypeUtilisateurResolver().subscribe(res=>{this.listTypesUtilisateur=res})
    this.userService.getUtilisateurResolver().subscribe(res=>{
      let arrayTypes:number[]=[];
      this.listUtilisateurs = res    
      for(let item of res){
       if(!arrayTypes.includes(item.utiTypeUtilisateur)){
        arrayTypes.push(item.utiTypeUtilisateur)}
      }
      for(let item of arrayTypes){
        let a=0
        for(let item2 of res){
          if(item ===item2.utiTypeUtilisateur ){
            a=a+1}
        }
        this.arrayTypesCount.push(a)    
      }
      // get libelle 
      try {
        for(let item of arrayTypes){
          for(let i of this.listTypesUtilisateur){
            if(item == i.idTypeUti){
              this.arrayTypesLibelle.push(i.libelleTypeUti)}
          }
        }
      } catch(e) {
        window.location.reload();
      } 
        // CHART
        var myChart = new Chart("myChart", {
          type: 'doughnut',
          data : {
            datasets: [{
                data: this.arrayTypesCount,
                backgroundColor: [
                  'rgba(248, 155, 58, 0.8)',
                  'rgba(63, 40, 48, 0.8)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(255, 159, 64, 0.2)'
              ],
              borderColor: [
                  'rgba(248, 155, 58, 1)',
                  'rgba(63, 40, 48, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)'
              ],
              borderWidth: 1
            }],
            labels: this.arrayTypesLibelle,
        },
        })
        // END CHART
      })

      this.modService.getModule().subscribe(res=>{
        this.listmodules = res
      })
      this.appService.getApplication().subscribe(res=>{
        this.listapplications = res
      })
      this.fonService.getFonction().subscribe(res=>{
        this.listfonctions = res
      })
      this.rolService.getRole().subscribe(res=>{
        this.listroles = res
      })
  
    }

    

  

}
