import { Routes } from '@angular/router';
import { authGuard } from './core/auth/guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then((m) => m.HomeComponent),
    title: 'FarMart | Home',
  },

  {
    path: 'shop',
    loadComponent: () => import('./features/shop/shop.component').then((m) => m.ShopComponent),
    title: 'FarMart | Shop',
  },

  {
    path: 'wishlist',
    loadComponent: () =>
      import('./features/wishlist/wishlist.component').then((m) => m.WishlistComponent),
    title: 'FarMart | Wishlist',
    canActivate: [authGuard],
  },

  {
    path: 'cart',
    loadComponent: () => import('./features/cart/cart.component').then((m) => m.CartComponent),
    title: 'FarMart | Cart',
    canActivate: [authGuard],
  },

  {
    path: 'checkout',
    loadComponent: () =>
      import('./features/checkout/checkout.component').then((m) => m.CheckoutComponent),
    title: 'FarMart | Checkout',
    canActivate: [authGuard],
  },

  {
    path: 'allorders',
    loadComponent: () =>
      import('./features/orders/orders.component').then((m) => m.OrdersComponent),
    title: 'FarMart | Orders',
    canActivate: [authGuard],
  },
  {
    path: 'contact',
    loadComponent: () =>
      import('./features/contact/contact.component').then((m) => m.ContactComponent),
    title: 'FarMart | Contact',
  },

  {
    path: 'login',
    loadComponent: () => import('./features/login/login.component').then((m) => m.LoginComponent),
    title: 'FarMart | Login',
  },

  {
    path: 'register',
    loadComponent: () =>
      import('./features/register/register.component').then((m) => m.RegisterComponent),
    title: 'FarMart | Register',
  },

  {
    path: 'forget',
    loadComponent: () =>
      import('./features/forget/forget.component').then((m) => m.ForgetComponent),
    title: 'Forget Password',
  },

  {
    path: 'changePassword',
    loadComponent: () =>
      import('./features/change-password/change-password.component').then(
        (m) => m.ChangePasswordComponent,
      ),
    title: 'change Password',
  },

  {
    path: 'profile',
    loadComponent: () =>
      import('./features/profile/profile.component').then((m) => m.ProfileComponent),
    title: 'profile',
    canActivate: [authGuard],
  },

  // all categories or brands
  {
    path: 'filteredType/:type',
    loadComponent: () =>
      import('./features/filtered-type/filtered-type.component').then(
        (m) => m.FilteredTypeComponent,
      ),
    title: 'FarMart',
  },

  // sub category
  {
    path: 'category/:id/:name',
    loadComponent: () =>
      import('./features/sub-categories/sub-categories.component').then(
        (m) => m.SubCategoriesComponent,
      ),
    title: 'FarMart',
  },

  // product details
  {
    path: 'details/:id',
    loadComponent: () =>
      import('./features/product-details/product-details.component').then(
        (m) => m.ProductDetailsComponent,
      ),
    title: 'FarMart | Product Details',
  },

  // brands and sub category products
  {
    path: 'products/:type/:id',
    loadComponent: () =>
      import('./features/filtered-products/filtered-products.component').then(
        (m) => m.FilteredProductsComponent,
      ),
    title: 'FarMart',
  },

  {
    path: '**',
    loadComponent: () =>
      import('./features/not-found/not-found.component').then((m) => m.NotFoundComponent),
    title: 'Not Found Page',
  },
];
