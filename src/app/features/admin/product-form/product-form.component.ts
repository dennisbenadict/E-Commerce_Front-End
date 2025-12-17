import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/core/models/product.model';
import { ProductService } from 'src/app/core/product.service';
import { ToastrService } from 'ngx-toastr';
import { CategoryService, Category } from 'src/app/core/category.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  selectedCategory: string = '';
  categories: Category[] = [];
  availableSizesInput: string = '';
  imageUrlsInput: string = '';

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

  constructor(
    private productService: ProductService,
    private toastr: ToastrService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  private loadProducts() {
    this.productService.getProducts().subscribe({
      next: (res) => {
        this.products = res;
        this.filteredProducts = [...this.products];
      },
      error: () => this.toastr.error('Failed to load products')
    });
  }

  private loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (cats) => this.categories = cats,
      error: () => this.toastr.error('Failed to load categories')
    });
  }

  filterByCategory() {
    if (!this.selectedCategory) {
      this.filteredProducts = [...this.products];
      return;
    }
    this.filteredProducts = this.products.filter(p => String(p['categoryId'] ?? '') === this.selectedCategory);
  }

  saveProduct() {
    this.form.availableSizes = this.availableSizesInput
      .split(',')
      .map(size => size.trim())
      .filter(size => size !== '');

    const imageUrls = this.imageUrlsInput
      .split(',')
      .map(u => u.trim())
      .filter(u => u !== '');

    const categoryId = this.form['categoryId'] || (this.selectedCategory ? Number(this.selectedCategory) : null);
    if (!categoryId) {
      this.toastr.error('Please select a category');
      return;
    }

    const payload: any = {
      name: this.form.name,
      description: this.form.description,
      price: this.form.price,
      imageUrls: imageUrls.length ? imageUrls : (this.form['imageUrls'] ?? []),
      sizes: this.form.availableSizes,
      gender: this.form.gender,
      categoryId: categoryId
    };

    if (this.editingProduct) {
      this.productService.updateProduct(this.form.id, payload).subscribe({
        next: () => {
          this.toastr.success('Product updated');
          this.loadProducts();
          this.clearForm();
        },
        error: (err) => this.toastr.error(err.error?.message || 'Update failed')
      });
    } else {
      this.productService.createProduct(payload).subscribe({
        next: () => {
          this.toastr.success('Product created');
          this.loadProducts();
          this.clearForm();
        },
        error: (err) => this.toastr.error(err.error?.message || 'Create failed')
      });
    }
  }

  editProduct(product: Product) {
    this.form = { ...product };
    this.availableSizesInput = product.availableSizes.join(', ');
    this.imageUrlsInput = (product as any).imageUrls?.join(', ') || '';
    this.form['categoryId'] = (product as any).categoryId;
    this.editingProduct = true;
  }

  deleteProduct(id: number) {
    this.productService.deleteProduct(id).subscribe({
      next: () => {
        this.toastr.success('Product deleted');
        this.loadProducts();
        if (this.form.id === id) this.clearForm();
      },
      error: (err) => this.toastr.error(err.error?.message || 'Delete failed')
    });
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
    this.imageUrlsInput = '';
    this.form['categoryId'] = null as any;
    this.editingProduct = false;
  }

  updateSizes() {
    this.form.availableSizes = this.availableSizesInput
      .split(',')
      .map(size => size.trim())
      .filter(size => size !== '');
  }
}
