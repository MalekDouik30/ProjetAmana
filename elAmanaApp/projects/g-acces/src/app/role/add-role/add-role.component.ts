import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Role } from '../../Models/Role';
import { RoleService } from '../../services/role.service';

@Component({
  selector: 'app-add-role',
  templateUrl: './add-role.component.html',
  styleUrls: ['./add-role.component.scss']
})
export class AddRoleComponent implements OnInit {

  constructor(public roleService:RoleService, public toaster:ToastrService, public dialog:MatDialog) { }
  
  insertData(monForm:NgForm){
    this.roleService.postRole().subscribe(
      res=>{
        this.resetForm(monForm);
        this.roleService.getRole()
        this.toaster.success("Application ajouté avec succès","Ajout")
      },
      err => {
        this.toaster.error("Échec d'ajouter cette application : "+ err.error.message,"Ajout")
        console.log(err);
      }
    );
  }
  
  resetForm(monForm:NgForm){
    monForm.form.reset();
    this.roleService.fromData = new Role();
  }

  onSubmit(monForm : NgForm){
    this.insertData(monForm)
    this.closeDialog(monForm)
    monForm.reset();    
  }

  closeDialog(monForm : NgForm){ 
    this.dialog.closeAll();
    this.resetForm(monForm)
  }
  ngOnInit(): void {
  }

}
