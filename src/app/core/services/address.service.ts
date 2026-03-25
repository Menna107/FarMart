import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  private readonly httpClient = inject(HttpClient);

  addAddress(data: object): Observable<any> {
    return this.httpClient.post(`${environment.baseURL}/api/v1/addresses`, data);
  }

  removeAddress(addressId: string): Observable<any> {
    return this.httpClient.delete(`${environment.baseURL}/api/v1/addresses/${addressId}`);
  }

  getSpecificAddress(addressId: string): Observable<any> {
    return this.httpClient.get(`${environment.baseURL}/api/v1/addresses/${addressId}`);
  }

  getUserAddresses(): Observable<any> {
    return this.httpClient.get(`${environment.baseURL}/api/v1/addresses`);
  }
}
