import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
  createdByUserId: string;
  createdByUserName: string;
}

export interface CreateProduct {
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
}

export interface UpdateProduct {
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly API_URL = environment.apiUrl || 'https://localhost:7001/api';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.API_URL}/products`);
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.API_URL}/products/${id}`);
  }

  createProduct(product: CreateProduct): Observable<Product> {
    return this.http.post<Product>(`${this.API_URL}/products`, product, {
      headers: this.authService.getAuthHeaders()
    });
  }

  updateProduct(id: number, product: UpdateProduct): Observable<Product> {
    return this.http.put<Product>(`${this.API_URL}/products/${id}`, product, {
      headers: this.authService.getAuthHeaders()
    });
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/products/${id}`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  getProductsCount(): Observable<number> {
    return this.http.get<number>(`${this.API_URL}/products/count`);
  }
}