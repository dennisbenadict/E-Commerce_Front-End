import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { Product } from './models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly api = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getProducts(): Observable<Product[]> {
    return this.http.get<any[]>(`${this.api}/api/products`).pipe(
      map(list => list.map(item => this.toProduct(item)))
    );
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<any>(`${this.api}/api/products/${id}`).pipe(
      map(item => this.toProduct(item))
    );
  }

  getByCategory(categoryId: number): Observable<any> {
    return this.http.get<any>(`${this.api}/api/products/category/${categoryId}`).pipe(
      map((res: any) => {
        const items = res.products ?? res;
        return {
          ...res,
          products: Array.isArray(items) ? items.map((x: any) => this.toProduct(x)) : []
        };
      })
    );
  }

  createProduct(dto: any): Observable<any> {
    return this.http.post(`${this.api}/api/products`, dto);
  }

  updateProduct(id: number, dto: any): Observable<any> {
    return this.http.put(`${this.api}/api/products/${id}`, dto);
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.api}/api/products/${id}`);
  }

  private toProduct(item: any): Product {
    return {
      id: item.id ?? item.Id,
      name: item.name ?? item.Name,
      description: item.description ?? item.Description ?? '',
      price: item.price ?? item.Price ?? 0,
      imageUrl: (item.imageUrls?.[0]) ?? item.imageUrl ?? item.ImageUrl ?? '',
      imageUrls: item.imageUrls ?? item.ImageUrls ?? [],
      availableSizes: item.availableSizes ?? item.sizes ?? item.Sizes ?? [],
      gender: item.gender ?? item.Gender ?? '',
      categoryId: item.categoryId ?? item.CategoryId
    };
  }
}
