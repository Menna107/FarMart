import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SubCategoryService {
  private readonly httpClient = inject(HttpClient);

  getAllSubCategories(): Observable<any> {
    return this.httpClient.get(`${environment.baseURL}/api/v1/subcategories`);
  }
  getSpecificSubCategory(subCategoryId: string): Observable<any> {
    return this.httpClient.get(`${environment.baseURL}/api/v1/subcategories/${subCategoryId}`);
  }
  getAllSubCategoriesOnCategory(categoryId: string | null): Observable<any> {
    return this.httpClient.get(
      `${environment.baseURL}/api/v1/categories/${categoryId}/subcategories`,
    );
  }
}
