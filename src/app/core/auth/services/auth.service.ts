import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly httpClient = inject(HttpClient);
  isLogged = signal<boolean>(false);

  signUp(data: any): Observable<any> {
    return this.httpClient.post(`${environment.baseURL}/api/v1/auth/signup`, data);
  }
  signIn(data: any): Observable<any> {
    return this.httpClient.post(`${environment.baseURL}/api/v1/auth/signin`, data);
  }
  signOut() {
    localStorage.removeItem('token');
    this.isLogged.set(false);
  }

  forgetPassword(data: object): Observable<any> {
    return this.httpClient.post(`${environment.baseURL}/api/v1/auth/forgotPasswords`, data);
  }
  verifyCode(data: object): Observable<any> {
    return this.httpClient.post(`${environment.baseURL}/api/v1/auth/verifyResetCode`, data);
  }
  resetPassword(data: object): Observable<any> {
    return this.httpClient.put(`${environment.baseURL}/api/v1/auth/resetPassword`, data);
  }

  changeUserPassword(data: object): Observable<any> {
    return this.httpClient.put(`${environment.baseURL}/api/v1/users/changeMyPassword`, data);
  }
}
