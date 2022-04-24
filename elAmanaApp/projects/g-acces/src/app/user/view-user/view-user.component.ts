import { Component, OnInit } from '@angular/core';
import { AgenceService } from '../../services/agence.service';
import { DirectionService } from '../../services/direction.service';
import { RoleService } from '../../services/role.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.scss']
})
export class ViewUserComponent implements OnInit {

  constructor(public direcService:DirectionService, 
    public ageService:AgenceService,
    public utiService:UserService,
    public rolService:RoleService) { }

  ngOnInit(): void {
    this.direcService.getDirection();
    this.ageService.getAgence();
    this.rolService.getRole();
  }

}
