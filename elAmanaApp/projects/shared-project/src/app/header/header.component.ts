import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'projects/g-acces/src/app/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(public userService:UserService,public router:Router) { }
  loggedUserName=this.userService.getUserLoginInformation().decodedName

  
  ngOnInit(): void {}
  logOut(){
    localStorage.removeItem("jwt");
    this.router.navigate(["gAcces/login"]);
  }

}
