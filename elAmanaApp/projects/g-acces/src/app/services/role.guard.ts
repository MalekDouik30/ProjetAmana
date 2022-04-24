import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, of } from 'rxjs';
import { take } from 'rxjs/operators';
import { AuthorizationWithRootService } from './authorization-with-root.service';
import { FonctionService } from './fonction.service';
import { RoleFonctionService } from './role-fonction.service';
import { UserService } from './user.service';


@Injectable({
  providedIn: 'root'
})

export class RoleGuard implements CanActivate {
  constructor(public authrootService:AuthorizationWithRootService,public router: Router,public utiService:UserService,public rolfonSerice:RoleFonctionService,
    public fonService:FonctionService,public route: ActivatedRoute,public jwtHelper :JwtHelperService) {}
  
  nameComponent:string;
  canActivate(route: ActivatedRouteSnapshot):Observable<boolean> { 
    const token = localStorage.getItem("jwt");  
    // verif if token is expired
    if(token && this.jwtHelper.isTokenExpired(token)){
      this.router.navigate(["gAcces/login"]);
      return of(false)
    }  
      this.nameComponent=this.checkUserLogin(route)
      return this.authrootService.getComponentRoot(this.nameComponent).pipe(take(1));
      //return true
  }

  checkUserRole(){
    return this.utiService.getUserLoginInformation().decodedRole
  }

   checkUserLogin(route: ActivatedRouteSnapshot){
    let nameComponent=route.data.role
    return nameComponent
  }
  
}



