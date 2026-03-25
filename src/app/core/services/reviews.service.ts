import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { WritingReview } from '../models/writing-review.interface';

@Injectable({
  providedIn: 'root',
})
export class ReviewsService {
  private readonly httpClient = inject(HttpClient);

  createReview(productId: string, reviewData: WritingReview): Observable<any> {
    return this.httpClient.post(
      `${environment.baseURL}/api/v1/products/${productId}/reviews`,
      reviewData,
    );
  }
  getReviewsForProduct(productId: string): Observable<any> {
    return this.httpClient.get(`${environment.baseURL}/api/v1/products/${productId}/reviews`);
  }
  getAllReviews(): Observable<any> {
    return this.httpClient.get(`${environment.baseURL}/api/v1/reviews`);
  }
  getReviewById(reviewId: string): Observable<any> {
    return this.httpClient.get(`${environment.baseURL}/api/v1/reviews/${reviewId}`);
  }
  updateReview(reviewId: string, reviewData: WritingReview): Observable<any> {
    return this.httpClient.put(`${environment.baseURL}/api/v1/reviews/${reviewId}`, reviewData);
  }
  deleteReview(reviewId: string): Observable<any> {
    return this.httpClient.delete(`${environment.baseURL}/api/v1/reviews/${reviewId}`);
  }
}
