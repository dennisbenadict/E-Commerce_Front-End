import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/core/models/product.model';
import { PRODUCTS } from 'src/app/shared/data/product';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = PRODUCTS;
  filteredProducts: Product[] = [];

  genders: string[] = ['Men', 'Women'];
  selectedGender: string = '';
  selectedPriceRange: string = '';
  searchQuery: string = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['search']?.toLowerCase() || '';
      this.applyFilters();
    });
    this.filteredProducts = [...this.products];
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

