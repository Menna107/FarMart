import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private readonly httpClient = inject(HttpClient);

  getUserOrders(userId: string): Observable<any> {
    return this.httpClient.get(`${environment.baseURL}/api/v1/orders/user/${userId}`);
  }
}
