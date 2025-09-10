import { Component,Input} from '@angular/core';
import { Product } from 'src/app/core/models/product.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent {
  @Input() product!: Product;
  constructor(private router: Router) {}

  goToDetails() {
    this.router.navigate(['/products', this.product.id]);
  }
}
