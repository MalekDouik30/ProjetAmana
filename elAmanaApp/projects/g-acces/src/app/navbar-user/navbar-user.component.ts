import { Component, OnInit } from '@angular/core';
import { AuthorizationWithoutRootService } from '../services/authorization-without-root.service';

@Component({
  selector: 'app-navbar-user',
  templateUrl: './navbar-user.component.html',
  styleUrls: ['./navbar-user.component.scss']
})
export class NavbarUserComponent implements OnInit {

  listfunctionalitiesInThisComponent=["afficher utilisateur","afficher role","afficher fonction",
  "afficher parametre","afficher application","afficher module","afficher historique utilisateur",
  "afficher dashboard utilisateur","afficher direction","afficher agence"] // WARNING: The name in this list must be the same in the function table
    constructor(public authService:AuthorizationWithoutRootService) {
    }
    

    ngOnInit(): void {
      this.authService.getFunctionalitiesNavBar(this.listfunctionalitiesInThisComponent)
    }

}
