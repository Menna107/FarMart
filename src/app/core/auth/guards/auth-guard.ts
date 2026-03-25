import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ToastService } from '../../services/toast.service';

export const authGuard: CanActivateFn = (route, state) => {
  // order cart wishlist checkout

  const pLATFORM_ID = inject(PLATFORM_ID);
  const toastService = inject(ToastService);
  const router = inject(Router);
  if (isPlatformBrowser(pLATFORM_ID)) {
    if (localStorage.getItem('token')) {
      return true;
    } else {
      toastService.show('Error', 'You are not logged in. Please login to get access', 'warning');
      return router.parseUrl('/login');
    }
  }
  return true;
};
