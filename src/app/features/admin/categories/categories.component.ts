import { Component, OnInit } from '@angular/core';
import { CategoryService, Category } from 'src/app/core/category.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];
  loading = false;
  editingId: number | null = null;
  nameInput = '';

  constructor(
    private categoryService: CategoryService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.loading = true;
    this.categoryService.getCategories().subscribe({
      next: (res) => this.categories = res || [],
      error: () => this.toastr.error('Failed to load categories'),
      complete: () => this.loading = false
    });
  }

  startEdit(cat: Category) {
    this.editingId = cat.id;
    this.nameInput = cat.name;
  }

  cancelEdit() {
    this.editingId = null;
    this.nameInput = '';
  }

  save() {
    if (!this.nameInput.trim()) {
      this.toastr.error('Name required');
      return;
    }
    if (this.editingId) {
      this.categoryService.updateCategory(this.editingId, this.nameInput.trim()).subscribe({
        next: () => {
          this.toastr.success('Category updated');
          this.cancelEdit();
          this.load();
        },
        error: (err) => this.toastr.error(err.error?.message || 'Update failed')
      });
    } else {
      this.categoryService.createCategory(this.nameInput.trim()).subscribe({
        next: () => {
          this.toastr.success('Category added');
          this.cancelEdit();
          this.load();
        },
        error: (err) => this.toastr.error(err.error?.message || 'Create failed')
      });
    }
  }

  delete(cat: Category) {
    this.categoryService.deleteCategory(cat.id).subscribe({
      next: () => {
        this.toastr.success('Category deleted');
        this.load();
      },
      error: (err) => this.toastr.error(err.error?.message || 'Delete failed')
    });
  }
}

