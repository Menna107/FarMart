import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { forkJoin, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Product } from '../models/product.interface';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  private readonly httpClient = inject(HttpClient);
  wishlistItems = signal<Product[]>([]);

  addProductToWishList(data: { productId: string }): Observable<any> {
    return this.httpClient.post(`${environment.baseURL}/api/v1/wishlist`, data).pipe(
      tap(() => {
        this.getUserWishList().subscribe();
      }),
    );
  }
  removeProductFromWishList(productId: string): Observable<any> {
    return this.httpClient.delete(`${environment.baseURL}/api/v1/wishlist/${productId}`).pipe(
      tap(() => {
        this.wishlistItems.update((items) => items.filter((p) => p._id !== productId));
      }),
    );
  }
  getUserWishList(): Observable<any> {
    return this.httpClient
      .get(`${environment.baseURL}/api/v1/wishlist`)
      .pipe(tap((res: any) => this.wishlistItems.set(res.data)));
  }

  clearFullWishlist(): Observable<any> {
    const currentItems = this.wishlistItems();
    const deleteRequests = currentItems.map((item) =>
      this.httpClient.delete(`${environment.baseURL}/api/v1/wishlist/${item._id}`),
    );

    return forkJoin(deleteRequests).pipe(
      tap(() => {
        this.wishlistItems.set([]);
      }),
    );
  }

  resetWishlistLocal(): void {
    this.wishlistItems.set([]);
  }
}
