import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { Product } from 'src/app/core/models/product.model';
import { CartService } from 'src/app/core/cart.service';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from 'src/app/core/product.service';
import { AuthService } from 'src/app/core/auth.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  product!: Product;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router:Router,
    private cartService:CartService,
    private toastrService:ToastrService,
    private productService: ProductService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const productId = Number(this.route.snapshot.paramMap.get('id'));
    if (productId) {
      this.fetchProduct(productId);
    }
  }

  private fetchProduct(id: number) {
    this.loading = true;
    this.productService.getProduct(id).subscribe({
      next: (prod) => {
        this.product = prod;
      },
      error: () => {
        this.toastrService.error('Product not found');
        this.router.navigate(['/products']);
      },
      complete: () => this.loading = false
    });
  }

  addToCart() {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/auth/login']);
      return;
    }
    this.cartService.addToCart(this.product.id, 1).subscribe({
      next: () => this.toastrService.success('Product Successfully Added'),
      error: (err) => this.toastrService.error(err.error?.message || 'Failed to add to cart')
    });
  }

  buyNow() {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/auth/login']);
      return;
    }

    this.cartService.addToCart(this.product.id, 1).subscribe({
      next: () => this.router.navigate(['checkout/address']),
      error: (err) => this.toastrService.error(err.error?.message || 'Failed to add to cart')
    });
  }
}
