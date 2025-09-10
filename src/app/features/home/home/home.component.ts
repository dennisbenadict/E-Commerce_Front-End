import { Component } from '@angular/core';
import { PRODUCTS } from 'src/app/shared/data/product';
import { Product } from 'src/app/core/models/product.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  featuredProducts:Product[]=PRODUCTS
}
