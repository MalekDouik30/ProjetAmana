import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { FonctionService } from './fonction.service';
import { RoleFonctionService } from './role-fonction.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationWithRootService {

  constructor(public rolefonService:RoleFonctionService ,public utiService:UserService, public fonService:FonctionService ,public router: Router) { }
  res:boolean
  //Promise<any>
  getComponentRoot(componentRole:string):Observable<boolean>{
    var subject = new Subject<boolean>();
    this.rolefonService.getRoleFonctionAuth().subscribe({
      next: (result: any) => {
        this.fonService.getFonction().subscribe({
          next: (result2: any) => {
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
                if (item.fonId == item2 && item.fonEtat==true ){
                  listfonctionNames.push(item.fonLibelle)
                }
              }
            }
            for(let item of listfonctionNames){
              // convert item.fonNom from undifinded to string & remove sapce to compare
              item =item.replace(/\s/g, "").toLowerCase();
              componentRole =componentRole.replace(/\s/g, "").toLowerCase();
                if (item == componentRole){
                  subject.next(true);                  
                  return subject.asObservable(); 
                }
            }
            subject.next(false);
            localStorage.removeItem("jwt");
            this.router.navigate(['gAcces/login']);
            return subject.asObservable();
        
          }
        })
      }
    })
    return subject.asObservable();
  }
}
