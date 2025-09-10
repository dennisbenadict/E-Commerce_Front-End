import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckoutComponent } from './checkout/checkout.component';
import { AddAddressComponent } from './add-address/add-address.component';
const routes: Routes = [
  {path:'',component:CheckoutComponent},
  {path:'address',component:AddAddressComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CheckoutRoutingModule { }
