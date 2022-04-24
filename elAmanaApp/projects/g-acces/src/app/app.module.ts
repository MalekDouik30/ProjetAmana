import { ModuleWithProviders, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRouting } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover'; // Popup Delete
import { Ng2SearchPipeModule } from 'ng2-search-filter'; // search
import {MatSortModule} from '@angular/material/sort'; //   Tri table : ng add @angular/materiall
import { MatPaginatorModule } from '@angular/material/paginator'; 
import { JwtModule } from '@auth0/angular-jwt';
import { DatePipe } from '@angular/common';
import {NgxPaginationModule} from 'ngx-pagination' // Paginator
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSelectModule} from '@angular/material/select';
import { SharedprojectModule } from 'projects/shared-project/src/app/app.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { ToastrModule } from 'ngx-toastr';
import { MatInputModule } from '@angular/material/input';
// Charts
import {BrowserAnimationsModule} from '@angular/platform-browser/animations' 
import { NgxChartsModule } from '@swimlane/ngx-charts';// npm i @swimlane/ngx-charts@18.0.0 // npm install @types/d3 --save-dev

/* Select option search*/ 
//import { NgSelectModule } from '@ng-select/ng-select'; // npm i @ng-select/ng-select
import {MatDatepickerModule} from '@angular/material/datepicker'; // datePicker
import {MatNativeDateModule} from '@angular/material/core'; //  datePicker
import { NgxSliderModule } from '@angular-slider/ngx-slider';//Slider  // npm i @angular-slider/ngx-slider
export function tokenGetter(){
  return localStorage.getItem("jwt");
}


import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { UserComponent } from './user/user.component';
import { RoleComponent } from './role/role.component';
import { FonctionComponent } from './fonction/fonction.component';
import { HistoriqueUtilisateurComponent } from './historique-utilisateur/historique-utilisateur.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ModuleComponent } from './module/module.component';
import { ApplicationComponent } from './application/application.component';
import { NavbarUserComponent } from './navbar-user/navbar-user.component';
import { AddUserComponent } from './user/add-user/add-user.component';
import { UpdateUserComponent } from './user/update-user/update-user.component';
import { UpdateMyprofileComponent } from './user/update-myprofile/update-myprofile.component';
import { ViewUserComponent } from './user/view-user/view-user.component';



//import { AppModule } from '../../../../src/app/app.module';
//import { HeaderComponent } from '../../../../src/app/header/header.component';

import { gStockSharedModule } from 'projects/g-stock/src/app/app.module';
import { AddFonctionComponent } from './fonction/add-fonction/add-fonction.component';
import { UpdateFonctionComponent } from './fonction/update-fonction/update-fonction.component';
import { AddApplicationComponent } from './application/add-application/add-application.component';
import { UpdateApplicationComponent } from './application/update-application/update-application.component';
import { AddModuleComponent } from './module/add-module/add-module.component';
import { UpdateModuleComponent } from './module/update-module/update-module.component';
import { AddRoleComponent } from './role/add-role/add-role.component';
import { UpdateRoleComponent } from './role/update-role/update-role.component';
import { AssignFunctionRoleComponent } from './role/assign-function-role/assign-function-role.component';
import { GlobalParameterComponent } from './global-parameter/global-parameter.component';
import { UpdateParameterComponent } from './global-parameter/update-parameter/update-parameter.component';
import { AgenceComponent } from './agence/agence.component';
import { DirectionComponent } from './direction/direction.component';
import { AddAgenceComponent } from './agence/add-agence/add-agence.component';
import { UpdateAgenceComponent } from './agence/update-agence/update-agence.component';
import { AddDirectionComponent } from './direction/add-direction/add-direction.component';
import { UpdateDirectionComponent } from './direction/update-direction/update-direction.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UserComponent,
    RoleComponent,
    FonctionComponent,
    HistoriqueUtilisateurComponent,
    DashboardComponent,
    ModuleComponent,
    ApplicationComponent,
    NavbarUserComponent,
    AddUserComponent,
    UpdateUserComponent,
    UpdateMyprofileComponent,
    ViewUserComponent,
    AddFonctionComponent,
    UpdateFonctionComponent,
    AddApplicationComponent,
    UpdateApplicationComponent,
    AddModuleComponent,
    UpdateModuleComponent,
    AddRoleComponent,
    UpdateRoleComponent,
    AssignFunctionRoleComponent,
    GlobalParameterComponent,
    UpdateParameterComponent,
    AgenceComponent,
    DirectionComponent,
    AddAgenceComponent,
    UpdateAgenceComponent,
    AddDirectionComponent,
    UpdateDirectionComponent,
  ],

  imports: [
    BrowserModule,
    HttpClientModule,
    AppRouting,
    HttpClientModule,
    MatInputModule,
    ToastrModule.forRoot(),
    Ng2SearchPipeModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatDialogModule,
    NgxPaginationModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgxSliderModule,
    MatSelectModule,
    ConfirmationPopoverModule.forRoot({confirmButtonType : 'danger'}),
    JwtModule.forRoot({config:{tokenGetter: tokenGetter,disallowedRoutes:[]}}),
    gStockSharedModule.forRoot(),
    SharedprojectModule,
    NgxChartsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }


@NgModule({})
export class gAccesSharedModule { 
  static forRoot(): ModuleWithProviders<gAccesSharedModule> {
    return {
      ngModule: gAccesSharedModule,
      providers: [],
    }
  }
}
