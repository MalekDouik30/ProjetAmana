import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApplicationService } from './application.service';
import { FonctionService } from './fonction.service';
import { RoleApplicationService } from './role-application.service';
import { RoleFonctionService } from './role-fonction.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationWithoutRootService {

  constructor(
    public appService:ApplicationService,
    public roleAppService:RoleApplicationService ,
    public rolefonService:RoleFonctionService ,
    public utiService:UserService, 
    public fonService:FonctionService ,
    public route: ActivatedRoute) { }
  
  listauthorizedApplication:boolean[] =[];
  listauthorizedFunctions:boolean[] =[];
  listauthorizedFunctionsForNavBar:boolean[] =[];

  getFunctionalities(listfunctionalitiesInThisComponent:string[]){
    this.rolefonService.getRoleFonctionAuth().subscribe({
      next: (result: any) => {
        this.fonService.getFonction().subscribe({
          next: (result2: any) => {
              // In this function we determine all the functionalities that the user can access.
              let listButton:boolean[] =[];
              for (let i = 0; i < listfunctionalitiesInThisComponent.length; i++){
                listButton.push(false)
              }
              let userIdrole=this.utiService.getUserLoginInformation().decodedRole
              let listfonctionbyIdRole=[]
              let listfonctionNames=[]
                // 1. Get id functionalities by user idrole from fonction-role table
              for(let item of result){
                if(item.rolId == userIdrole){
                  listfonctionbyIdRole.push(item.fonId)
                }
              }
              // 2. Get name functionalities by user idfon from fonction table
              for(let item of result2){
                for (let item2 of listfonctionbyIdRole){
                  if (item.fonId == item2 && item.fonEtat==true){
                    listfonctionNames.push(item.fonLibelle)
                  }
                }
              }
              for(var item in listfonctionNames){
                for(var item2  in listfunctionalitiesInThisComponent){
                  if(listfonctionNames[item]==listfunctionalitiesInThisComponent[item2]){
                    listButton[item2]=true
                    this.listauthorizedFunctions=listButton
                    console.log("Autorization buttons : ")
                    console.log(this.listauthorizedFunctions) 
                  }
                }
              }
          },
          error: (err: any) => {
            console.log(err);
          },
        })
      },
      error: (err: any) => {
        console.log(err);
      },
      complete: () => {
        console.log('complete');
      }
    }) 
  }
  
  getFunctionalitiesNavBar(listfunctionalitiesInThisComponent:string[]){
    this.rolefonService.getRoleFonctionAuth().subscribe({
      next: (result: any) => {
        this.fonService.getFonction().subscribe({
          next: (result2: any) => {
              // In this function we determine all the functionalities that the user can access.
              let listButton:boolean[] =[];
              for (let i = 0; i < listfunctionalitiesInThisComponent.length; i++){
                listButton.push(false)
              }
              let userIdrole=this.utiService.getUserLoginInformation().decodedRole
              let listfonctionbyIdRole=[]
              let listfonctionNames=[]
                // 1. Get id functionalities by user idrole from fonction-role table
              for(let item of result){
                if(item.rolId == userIdrole){
                  listfonctionbyIdRole.push(item.fonId)
                }
              }
              // 2. Get name functionalities by user idfon from fonction table
              for(let item of result2){
                for (let item2 of listfonctionbyIdRole){
                  if (item.fonId == item2){
                    listfonctionNames.push(item.fonLibelle)
                  }
                }
              }
              for(var item in listfonctionNames){
                for(var item2  in listfunctionalitiesInThisComponent){
                  if(listfonctionNames[item]==listfunctionalitiesInThisComponent[item2]){
                  
                    listButton[item2]=true
                    this.listauthorizedFunctionsForNavBar=listButton
                    console.log("Autorization buttons Nav Bar: ")
                    console.log(this.listauthorizedFunctionsForNavBar) 
                  }
                }
              }
          },
          error: (err: any) => {
            console.log(err);
          },
        })
      },
      error: (err: any) => {
        console.log(err);
      },
      complete: () => {
        console.log('complete');
      }
    }) 
  }

  getApplications(listApplicationInThisComponent:string[]){
    this.roleAppService.getRoleApplicationAuth().subscribe({
      next: (result: any) => {
        this.appService.getApplication().subscribe({
          next: (result2: any) => {
  
              // In this function we determine all the functionalities that the user can access.
              let listModulesButtons:boolean[] =[];
              for (let i = 0; i < listApplicationInThisComponent.length; i++){
                listModulesButtons.push(false)
              }
              let userIdrole=this.utiService.getUserLoginInformation().decodedRole
              let listApplicationbyIdRole=[]
              let listApplicationnNames=[]
              // 1. Get id Application by user idrole from application-role table
              for(let item of result){
                if(item.rolId == userIdrole){
                  listApplicationbyIdRole.push(item.appId)
                  }
              }
              // 2. Get name Application by user idApp from Application table
              for(let item of result2){
                for (let item2 of listApplicationbyIdRole){
            
                  if (item.appId == item2 && item.appEtat==true){
                    listApplicationnNames.push(item.appLibelle)

                  }
                }
              }
              for(var item in listApplicationnNames){
                for(var item2  in listApplicationInThisComponent){
                  if(listApplicationnNames[item]==listApplicationInThisComponent[item2]){
                    listModulesButtons[item2]=true
                    this.listauthorizedApplication=listModulesButtons
                    console.log("Autorization Application : ")
                    console.log(this.listauthorizedApplication) 
                  }
                }
              }
          },
          error: (err: any) => {
            console.log(err);
          },
        })
      },
      error: (err: any) => {
        console.log(err);
    },
      complete: () => {
        console.log('complete');
      }
    }) 
  }

}
