import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Parametre } from '../Models/Parametre';
import { AuthorizationWithoutRootService } from '../services/authorization-without-root.service';
import { ParametreService } from '../services/parametre.service';
import { UpdateParameterComponent } from './update-parameter/update-parameter.component';

@Component({
  selector: 'app-global-parameter',
  templateUrl: './global-parameter.component.html',
  styleUrls: ['./global-parameter.component.scss']
})
export class GlobalParameterComponent implements OnInit {

  constructor(public authService:AuthorizationWithoutRootService,public paramService:ParametreService, public dialog:MatDialog) { }
  listfunctionalitiesInThisComponent=["modifier parametre"] // WARNING: The name of functionalities in this list must be the same in the function table

  onUpdate(){ this.dialog.open(UpdateParameterComponent); }

  onSelection(SelectedRecord:Parametre){
    this.paramService.fromData =  Object.assign({},SelectedRecord);
    this.onUpdate();
  }
  ngOnInit(): void { 
    this.authService.getFunctionalities(this.listfunctionalitiesInThisComponent) 
    this.paramService.getParametres() 
  }

  

}
