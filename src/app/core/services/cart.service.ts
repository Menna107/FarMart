import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Product } from '../models/product.interface';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CartProduct } from '../models/cart-product.interface';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly httpClient = inject(HttpClient);
  CartItems = signal<CartProduct[]>([]);
  CartId = signal<string>('');

  addProductToCart(data: { productId: string }): Observable<any> {
    return this.httpClient.post(`${environment.baseURL}/api/v2/cart`, data).pipe(
      tap((res: any) => {
        this.CartItems.set(res.data.products);
      }),
    );
  }

  getUserCart(): Observable<any> {
    return this.httpClient.get(`${environment.baseURL}/api/v2/cart`).pipe(
      tap((res: any) => {
        this.CartItems.set(res.data.products);
        this.CartId.set(res.cartId);
      }),
    );
  }

  updateProductCartQuantity(productId: string, data: { count: number }): Observable<any> {
    return this.httpClient.put(`${environment.baseURL}/api/v2/cart/${productId}`, data).pipe(
      tap((res: any) => {
        this.CartItems.set(res.data.products);
      }),
    );
  }

  clearCart(): Observable<any> {
    return this.httpClient.delete(`${environment.baseURL}/api/v2/cart`).pipe(
      tap(() => {
        this.CartItems.set([]);
      }),
    );
  }

  removeProductFromCart(productId: string): Observable<any> {
    return this.httpClient.delete(`${environment.baseURL}/api/v2/cart/${productId}`).pipe(
      tap((res: any) => {
        this.CartItems.set(res.data.products);
      }),
    );
  }

  applyCoupon(data: { couponName: string }): Observable<any> {
    return this.httpClient
      .put(`${environment.baseURL}/api/v2/cart/applyCoupon`, data)
      .pipe(tap((res: any) => this.CartItems.set(res.data)));
  }

  createCashOrder(cartId: string, data: object): Observable<any> {
    return this.httpClient.post(`${environment.baseURL}/api/v2/orders/${cartId}`, data).pipe(
      tap(() => {
        this.CartItems.set([]);
        this.CartId.set('');
      }),
    );
  }

  createVisaOrder(cartId: string, data: object): Observable<any> {
    return this.httpClient
      .post(
        `${environment.baseURL}/api/v1/orders/checkout-session/${cartId}?url=${window.location.origin}`,
        data,
      )
      .pipe(
        tap(() => {
          this.CartItems.set([]);
          this.CartId.set('');
        }),
      );
  }

  resetCartLocal(): void {
    this.CartItems.set([]);
    this.CartId.set('');
  }
}
