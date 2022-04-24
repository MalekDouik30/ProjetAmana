import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ToastrModule } from 'ngx-toastr';
// ng add @angular/material
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule} from"@angular/material/input";
import {MatTableModule } from "@angular/material/table";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
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
/* Select option search*/ 
//import { NgSelectModule } from '@ng-select/ng-select'; // npm i @ng-select/ng-select
import {MatDatepickerModule} from '@angular/material/datepicker'; // datePicker
import {MatNativeDateModule} from '@angular/material/core'; //  datePicker
import { NgxSliderModule } from '@angular-slider/ngx-slider';//Slider  // npm i @angular-slider/ngx-slider
import { MatTableExporterModule } from 'mat-table-exporter';

// ----
import { HomeComponent } from './home/home.component';
// ----
import { gStockSharedModule } from 'projects/g-stock/src/app/app.module';
import { gAccesSharedModule } from 'projects/g-acces/src/app/app.module';
import { SharedprojectModule } from 'projects/shared-project/src/app/app.module';
import { gSuiviPlacementSharedModule } from 'projects/g-suiviplacement/src/app/app.module';

export function tokenGetter(){
  return localStorage.getItem("jwt");
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
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
    ToastrModule,
    MatTableExporterModule,
    ConfirmationPopoverModule.forRoot({confirmButtonType : 'danger'}),
    JwtModule.forRoot({config:{tokenGetter: tokenGetter,disallowedRoutes:[]}}),
    gStockSharedModule.forRoot(),
    gAccesSharedModule.forRoot(),
    SharedprojectModule,
    gSuiviPlacementSharedModule,
  ],

  providers: [DatePipe],
  exports: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

