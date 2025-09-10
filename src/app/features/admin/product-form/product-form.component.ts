import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/core/models/product.model';
import { PRODUCTS } from 'src/app/shared/data/product';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  selectedCategory: string = '';
  availableSizesInput: string = '';

  form: Product = {
    id: 0,
    name: '',
    price: 0,
    imageUrl: '',
    gender: 'Men',
    description: '',
    availableSizes: []
  };

  editingProduct: boolean = false;

  ngOnInit(): void {
    this.products = PRODUCTS;
    this.filteredProducts = [...this.products];
  }

  filterByCategory() {
    if (this.selectedCategory) {
      this.filteredProducts = this.products.filter(p => p.gender === this.selectedCategory);
    } else {
      this.filteredProducts = [...this.products];
    }
  }

  saveProduct() {
    this.form.availableSizes = this.availableSizesInput
      .split(',')
      .map(size => size.trim())
      .filter(size => size !== '');

    if (this.editingProduct) {
      const index = this.products.findIndex(p => p.id === this.form.id);
      if (index !== -1) this.products[index] = { ...this.form };
    } else {
      const newId = this.products.length ? Math.max(...this.products.map(p => p.id)) + 1 : 1;
      this.products.push({ ...this.form, id: newId });
    }

    this.filteredProducts = [...this.products];
    this.clearForm();
  }

  editProduct(product: Product) {
    this.form = { ...product };
    this.availableSizesInput = product.availableSizes.join(', '); // ✅ This line added
    this.editingProduct = true;
  }

  deleteProduct(id: number) {
    this.products = this.products.filter(p => p.id !== id);
    this.filteredProducts = [...this.products];
    if (this.form.id === id) this.clearForm();
  }

  clearForm() {
    this.form = {
      id: 0,
      name: '',
      price: 0,
      imageUrl: '',
      gender: 'Men',
      description: '',
      availableSizes: []
    };
    this.availableSizesInput = '';
    this.editingProduct = false;
  }

  updateSizes() {
    this.form.availableSizes = this.availableSizesInput
      .split(',')
      .map(size => size.trim())
      .filter(size => size !== '');
  }
}
