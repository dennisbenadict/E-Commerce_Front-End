import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/core/models/product.model';
import { ProductService } from 'src/app/core/product.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];

  genders: string[] = ['Men', 'Women'];
  selectedGender: string = '';
  selectedPriceRange: string = '';
  searchQuery: string = '';

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadProducts();

    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['search']?.toLowerCase() || '';
      this.applyFilters();
    });
  }

  private loadProducts() {
    this.productService.getProducts().subscribe({
      next: (res) => {
        this.products = res;
        this.filteredProducts = [...this.products];
        this.applyFilters();
      },
      error: () => {
        this.toastr.error('Failed to load products');
      }
    });
  }

  applyFilters() {
    this.filteredProducts = this.products.filter(product => {
      const genderMatch = this.selectedGender ? product.gender === this.selectedGender : true;

      let priceMatch = true;
      switch (this.selectedPriceRange) {
        case '6000-8000':
          priceMatch = product.price >= 6000 && product.price <= 8000;
          break;
        case '8000-10000':
          priceMatch = product.price >= 8000 && product.price <= 10000;
          break;
        case 'above10000':
          priceMatch = product.price > 10000;
          break;
      }

      const searchMatch = this.searchQuery
        ? product.name.toLowerCase().includes(this.searchQuery)
        : true;

      return genderMatch && priceMatch && searchMatch;
    });
  }

  filterProducts() {
    this.applyFilters();
  }

  clearFilters() {
    this.selectedGender = '';
    this.selectedPriceRange = '';
    this.searchQuery = '';
    this.filteredProducts = [...this.products];
  }
}

