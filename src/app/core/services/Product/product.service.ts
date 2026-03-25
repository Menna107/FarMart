import { Product } from './../../models/product.interface';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly httpClient = inject(HttpClient);

  getAllProducts(): Observable<any> {
    return this.httpClient.get(`${environment.baseURL}/api/v1/products`);
  }
  getSpecificProducts(productId: string): Observable<any> {
    return this.httpClient.get(`${environment.baseURL}/api/v1/products/${productId}`);
  }
  getFilteredProducts(type: string | null, id: string | null): Observable<any> {
    return this.httpClient.get(`${environment.baseURL}/api/v1/products?${type}=${id}`);
  }

  getProductsWithParams(params: any): Observable<any> {
    return this.httpClient.get(`${environment.baseURL}/api/v1/products`, { params });
  }
}
