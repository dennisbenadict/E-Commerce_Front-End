import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CheckoutRoutingModule } from './checkout-routing.module';
import { CheckoutComponent } from './checkout/checkout.component';
import { AddAddressComponent } from './add-address/add-address.component';
import { FormsModule } from '@angular/forms';
@NgModule({
  declarations: [
    CheckoutComponent,
    AddAddressComponent
  ],
  imports: [
    CommonModule,
    CheckoutRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class CheckoutModule { }
