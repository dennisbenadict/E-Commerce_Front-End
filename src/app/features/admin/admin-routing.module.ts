import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { ProductFormComponent } from './product-form/product-form.component';
import { UserListComponent } from './user-list/user-list.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { adminGuard } from 'src/app/core/admin.guard';

const routes: Routes = [
  {path:'',component:AdminDashboardComponent, canActivate:[adminGuard]},
  {path:'product-form',component:ProductFormComponent, canActivate:[adminGuard]},
  {path:'user-list',component:UserListComponent, canActivate:[adminGuard]},
  {path:'admin-login',component:AdminLoginComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
