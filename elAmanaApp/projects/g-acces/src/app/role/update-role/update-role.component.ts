import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Role } from '../../Models/Role';
import { RoleService } from '../../services/role.service';


@Component({
  selector: 'app-update-role',
  templateUrl: './update-role.component.html',
  styleUrls: ['./update-role.component.scss']
})
export class UpdateRoleComponent implements OnInit {

  listrole: Role[] 
  etatRole:any

   constructor(public roleService:RoleService,
    public toaster:ToastrService,
    public dialog:MatDialog) { }

    
  resetForm(monForm:NgForm){
    monForm.form.reset();
    this.roleService.fromData = new Role();
  }

  updateData(monForm:NgForm){
    this.roleService.putRole().subscribe(
      res=>{
        this.resetForm(monForm);
        this.roleService.getRole();
        this.roleService.refreshComponent();
        this.toaster.info("Module modifié avec succès","Modification")
      },

      err => {
        this.toaster.error("Échec de modifier ce module","Modification")
        console.log(err);}
    );
  }

  closeDialog(monForm : NgForm){
    monForm.reset();
    this.dialog.closeAll();
  }

  onSubmit(monForm : NgForm){
    if (this.etatRole=="true"){
      this.roleService.fromData.rolEtat=true
    }
    if (this.etatRole=="false"){
      this.roleService.fromData.rolEtat=false

    } 
      // update User
      this.updateData(monForm)
      this.closeDialog(monForm)
      // cleaning the form
      monForm.reset();
  }

  ngOnInit(): void {
  }

}
