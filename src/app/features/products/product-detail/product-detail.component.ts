import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { PRODUCTS } from 'src/app/shared/data/product';
import { Product } from 'src/app/core/models/product.model';
import { CartService } from 'src/app/core/cart.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  product!: Product;

  constructor(private route: ActivatedRoute,private router:Router,private cartService:CartService,private toastrService:ToastrService) {}

  ngOnInit(): void {
    const productId = Number(this.route.snapshot.paramMap.get('id'));
    this.product = PRODUCTS.find(p => p.id === productId)!;
  }

addToCart() {
  const isLoggedIn = localStorage.getItem('isLoggedIn');

  if (!isLoggedIn) {
    this.router.navigate(['/auth/login']);
    return;
  }
  this.cartService.addToCart(this.product);
  this.toastrService.success('Product Successfully Added');

}

buyNow() {
  const isLoggedIn = localStorage.getItem('isLoggedIn');

  if (!isLoggedIn) {
    this.router.navigate(['/auth/login']);
    return;
  }

  localStorage.setItem('buyNowProduct', JSON.stringify(this.product));
  this.router.navigate(['checkout/address']);
}
}


