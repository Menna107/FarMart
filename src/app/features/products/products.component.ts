import { WishlistService } from './../../core/services/wishlist.service';
import {
  ChangeDetectorRef,
  Component,
  computed,
  inject,
  Input,
  OnInit,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { Product } from '../../core/models/product.interface';
import { CalculateDiscountPipe } from '../../shared/pipes/calculate-discount-pipe';
import { RouterLink } from '@angular/router';
import { ToastService } from '../../core/services/toast.service';
import { CartService } from '../../core/services/cart.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-products',
  imports: [CalculateDiscountPipe, RouterLink],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent implements OnInit {
  protected readonly Math = Math;
  private readonly wishlistService = inject(WishlistService);
  private readonly cartService = inject(CartService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly toastService = inject(ToastService);
  private readonly platformId = inject(PLATFORM_ID);
  @Input() productsList: Product[] = [];

  wishlistIds = computed(() => this.wishlistService.wishlistItems().map((item) => item._id));
  cartIds = computed(() =>
    this.cartService.CartItems().map((item: any) => item.product?._id || item._id),
  );
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      if (typeof localStorage !== 'undefined' && localStorage.getItem('token')) {
        this.wishlistService.getUserWishList().subscribe();
        this.cartService.getUserCart().subscribe();
      }
    }
  }

  // toggle icon and add/ delete when click
  toggleWishlist(productId: string) {
    if (this.wishlistIds().includes(productId)) {
      this.wishlistService.removeProductFromWishList(productId).subscribe({
        next: () => this.toastService.show('Success', 'Product Removed Successfully', 'success'),
      });
    } else {
      this.wishlistService.addProductToWishList({ productId }).subscribe({
        next: () => this.toastService.show('Success', 'Product Added Successfully', 'success'),
      });
    }
  }

  toggleCart(productId: string) {
    if (this.cartIds().includes(productId)) {
      this.cartService.removeProductFromCart(productId).subscribe({
        next: () => this.toastService.show('Success', 'Product Removed Successfully', 'success'),
      });
    } else {
      this.cartService.addProductToCart({ productId }).subscribe({
        next: () => this.toastService.show('Success', 'Product Added Successfully', 'success'),
      });
    }
  }
}
