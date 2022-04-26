import { Component, OnInit } from '@angular/core';
import { AuthorizationWithoutRootService } from 'projects/g-acces/src/app/services/authorization-without-root.service';
import { PlacementService } from '../services/placement.service';
import { ShareDataService } from '../services/share-data.service';
import { TypefondService } from '../services/typefond.service';
import { TypeplacementService } from '../services/typeplacement.service';
import { TypesousplacementService } from '../services/typesousplacement.service';
import { TypesoussousplacementService } from '../services/typesoussousplacement.service';

@Component({
  selector: 'app-navbar-placement',
  templateUrl: './navbar-placement.component.html',
  styleUrls: ['./navbar-placement.component.scss']
})
export class NavbarPlacementComponent implements OnInit {

  listfunctionalitiesInThisComponent=
  ["afficher placement","afficher dashboard placement","afficher parametre placement",
  "afficher institution financiere","afficher intermediaire","afficher historique realisation"]
  
  constructor(
    public typeP: TypeplacementService,
    public typeF: TypefondService,
    public typeSousP : TypesousplacementService,
    public typeSousSousP:TypesoussousplacementService,
    public placeService:PlacementService,
    public authService:AuthorizationWithoutRootService) { }

  ngOnInit(): void {
    this.typeP.getTypeplacement();
    this.typeF.getTypefond();
    this.typeSousP.getTypeSplacement();
    this.typeSousSousP.getTypeSSplacement();
    this.authService.getFunctionalitiesNavBar(this.listfunctionalitiesInThisComponent)
  }

  passIdTypePlacement(typ_pla_id:number){
    localStorage.setItem('typePlacementId',typ_pla_id.toString())
  }

  passIdTypeFond(typ_fon_id:number){
    localStorage.setItem('typeFondId',typ_fon_id.toString())

  }
  passIdSousPlacement(typ_sous_pla_id : number){
    localStorage.setItem('typeSousPlacementId',typ_sous_pla_id.toString())
    if(typ_sous_pla_id!=3){
      localStorage.setItem('typeSousSousPlacementId','0')
    }
  }

  passIdSousSousPlacement(typ_sous_sous_pla_id : number){
    localStorage.setItem('typeSousSousPlacementId',typ_sous_sous_pla_id.toString())
  }



}
