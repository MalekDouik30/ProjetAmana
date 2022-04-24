import { Component, OnInit } from '@angular/core';
import {UserService} from '../../../../g-acces/src/app/services/user.service'
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  constructor(public userService:UserService) { }

  testFunction(){
    alert("Product test projet gestion stock");

  }
  ngOnInit(): void {
  }

}
