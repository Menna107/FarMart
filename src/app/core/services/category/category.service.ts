import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly httpClient = inject(HttpClient);

  getAllCategories(): Observable<any> {
    return this.httpClient.get(`${environment.baseURL}/api/v1/categories`);
  }
  getSpecificCategories(categoryId: string): Observable<any> {
    return this.httpClient.get(`${environment.baseURL}/api/v1/categories/${categoryId}`);
  }
}
