import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthorizationWithoutRootService } from 'projects/g-acces/src/app/services/authorization-without-root.service';
import { Parametre } from '../Models/parametre';
import { ParametreService } from '../services/parametre.service';
import { UpdateParametreComponent } from './update-parametre/update-parametre.component';

@Component({
  selector: 'app-parametre',
  templateUrl: './parametre.component.html',
  styleUrls: ['./parametre.component.scss']
})
export class ParametreComponent implements OnInit {

  constructor(public authService:AuthorizationWithoutRootService,public paramService:ParametreService, public dialog:MatDialog) { }
  listfunctionalitiesInThisComponent=["modifier parametre"] // WARNING: The name of functionalities in this list must be the same in the function table

  onUpdate(){ this.dialog.open(UpdateParametreComponent); }

 onSelection(SelectedRecord:Parametre){
    this.paramService.fromData =  Object.assign({},SelectedRecord);
    this.onUpdate();
  }
  ngOnInit(): void {
    this.authService.getFunctionalities(this.listfunctionalitiesInThisComponent)
    this.paramService.getParametre()
  }

}
