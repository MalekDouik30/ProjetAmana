import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

// Application gestion Access
import { UserComponent } from 'projects/g-acces/src/app/user/user.component';
import { LoginComponent } from 'projects/g-acces/src/app/login/login.component';
import { RoleComponent } from 'projects/g-acces/src/app/role/role.component';
import { FonctionComponent } from 'projects/g-acces/src/app/fonction/fonction.component';
import { HistoriqueUtilisateurComponent } from 'projects/g-acces/src/app/historique-utilisateur/historique-utilisateur.component';
import { DashboardComponent } from 'projects/g-acces/src/app/dashboard/dashboard.component';
import { ModuleComponent } from 'projects/g-acces/src/app/module/module.component';
import { ApplicationComponent } from 'projects/g-acces/src/app/application/application.component';
import { GlobalParameterComponent } from 'projects/g-acces/src/app/global-parameter/global-parameter.component';
import { UpdateMyprofileComponent } from 'projects/g-acces/src/app/user/update-myprofile/update-myprofile.component';
import { AgenceComponent } from 'projects/g-acces/src/app/agence/agence.component';
import { DirectionComponent } from 'projects/g-acces/src/app/direction/direction.component';

import {RoleGuard} from 'projects/g-acces/src/app/services/role.guard'

// Application gestion stock
import { ProductComponent } from 'projects/g-stock/src/app/product/product.component';

// Application Shared Module 
import { ErrorPageComponent } from 'projects/shared-project/src/app/error-page/error-page.component';
import { AuthentificationService } from 'projects/g-acces/src/app/services/authentification.service';

// Application Suivi de placement
import { PlacementComponent } from 'projects/g-suiviplacement/src/app/placement/placement.component';
import { PlacementImmobilierComponent } from 'projects/g-suiviplacement/src/app/placement-immobilier/placement-immobilier.component';
import { DashboardPlacementComponent } from 'projects/g-suiviplacement/src/app/dashboard-placement/dashboard-placement.component';
import { SimulateurPlacementComponent } from 'projects/g-suiviplacement/src/app/simulateur-placement/simulateur-placement.component';
import { ParametreComponent } from 'projects/g-suiviplacement/src/app/parametre/parametre.component';
import { InstitutionFinanciereComponent } from 'projects/g-suiviplacement/src/app/institution-financiere/institution-financiere.component';
import { IntermediaireComponent } from 'projects/g-suiviplacement/src/app/intermediaire/intermediaire.component';
import { TotalPlacementComponent } from 'projects/g-suiviplacement/src/app/total-placement/total-placement.component';



const routes: Routes = [
  /* Projet Gestion d'accès*/
  { path: '',component:HomeComponent,canActivate:[AuthentificationService]},
  { path: '404',component:ErrorPageComponent},
  { path: 'gAcces/login', component:LoginComponent },
  { path: 'gAcces/user', component:UserComponent,canActivate:[RoleGuard], data: {role: "afficher utilisateur" } },
  { path: 'gAcces/role', component:RoleComponent,canActivate:[RoleGuard], data: {role:"afficher role" } },
  { path: 'gAcces/fonction', component:FonctionComponent,canActivate:[RoleGuard], data: {role: "afficher fonction" }, /*resolve:{ listfonctions : FonctionDataResolverResolver },*/},
  { path: 'gAcces/historique_utilisateur', component:HistoriqueUtilisateurComponent,canActivate:[RoleGuard], data: {role:"afficher historique utilisateur" }},
  { path: 'gAcces/dashboard_utilisateur', component:DashboardComponent,canActivate:[AuthentificationService] },
  { path: 'gAcces/module', component:ModuleComponent,canActivate:[RoleGuard], data: {role:"afficher module" }},
  { path: 'gAcces/application', component:ApplicationComponent,canActivate:[RoleGuard], data: {role:"afficher application" } },
  { path: 'gAcces/global_parameter', component:GlobalParameterComponent,canActivate:[RoleGuard], data: {role:"afficher parametre" } },
  { path: 'gAcces/update_myProfile', component:UpdateMyprofileComponent,canActivate:[RoleGuard],data: {role:"modifier mon profil"} },
  { path: 'gAcces/agence', component:AgenceComponent,canActivate:[RoleGuard], data: {role:"afficher agence" } },
  { path: 'gAcces/direction', component:DirectionComponent,canActivate:[RoleGuard], data: {role:"afficher direction" } },
 /* Projet gestion de stock*/
  { path: 'gStock/produit', component:ErrorPageComponent,canActivate:[AuthentificationService] },
  /* Projet Suivi des placements*/
  { path: 'gPlacement/dashboard_placement', component:DashboardPlacementComponent ,canActivate:[RoleGuard],data: {role:"afficher dashboard placement" }},
  { path: 'gPlacement/placement', component:PlacementComponent ,canActivate:[RoleGuard], data: {role:"afficher placement" }},
  { path: 'gPlacement/placement-immoblier', component:PlacementImmobilierComponent,canActivate:[RoleGuard], data: {role:"afficher placement" } },
  { path: 'gPlacement/simulateur_placement', component:SimulateurPlacementComponent,canActivate:[RoleGuard], data: {role:"afficher simulateur placement" } },
  { path: 'gPlacement/parametre_placement', component:ParametreComponent,canActivate:[RoleGuard], data: {role:"afficher parametre placement" } },
  { path: 'gPlacement/institutionFinanciere_placement', component:InstitutionFinanciereComponent,canActivate:[RoleGuard], data: {role:"afficher institution financiere" } },
  { path: 'gPlacement/intermediaire_placement', component:IntermediaireComponent,canActivate:[RoleGuard], data: {role:"afficher intermediaire" } },
  { path: 'gPlacement/total_placement', component:TotalPlacementComponent,canActivate:[RoleGuard], data: {role:"afficher intermediaire" } }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
