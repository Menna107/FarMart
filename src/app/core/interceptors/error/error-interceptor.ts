import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, tap, throwError } from 'rxjs';
import { ToastService } from '../../services/toast.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastService);

  return next(req).pipe(
    tap((event) => {
      if (event instanceof HttpResponse) {
        const body = event.body as any;

        if (body && body.message === 'success' && req.method !== 'GET') {
          const successMessage = 'login successfully';
          toastService.show('Success', successMessage, 'success');
        }
      }
    }),

    catchError((err) => {
      let title = 'Something went wrong';
      let type: 'error' | 'warning' = 'warning';

      if (err.status === 401) {
        title = 'Authentication Error';
        type = 'warning';
      }

      const message = err.error?.message || 'Please try again later';

      toastService.show(title, message, type);

      return throwError(() => err);
    }),
  );
};
