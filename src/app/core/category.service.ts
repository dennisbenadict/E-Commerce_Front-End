import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Category {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private readonly api = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.api}/api/categories`);
  }

  createCategory(name: string): Observable<any> {
    return this.http.post(`${this.api}/api/categories`, { name });
  }

  updateCategory(id: number, name: string): Observable<any> {
    return this.http.put(`${this.api}/api/categories/${id}`, { name });
  }

  deleteCategory(id: number): Observable<any> {
    return this.http.delete(`${this.api}/api/categories/${id}`);
  }
}

