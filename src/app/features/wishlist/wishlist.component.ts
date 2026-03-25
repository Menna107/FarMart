import { ChangeDetectorRef, Component, computed, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { WishlistService } from '../../core/services/wishlist.service';
import { Product } from '../../core/models/product.interface';
import { ProductsComponent } from '../products/products.component';
import { ToastService } from '../../core/services/toast.service';
import { RouterLink } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-wishlist',
  imports: [ProductsComponent, RouterLink],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css',
})
export class WishlistComponent implements OnInit {
  private readonly wishlistService = inject(WishlistService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly toastService = inject(ToastService);
  private readonly platformId = inject(PLATFORM_ID);
  userWishList = computed(() => this.wishlistService.wishlistItems());

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.wishlistService.getUserWishList().subscribe();
    }
  }

  clearAllWishList() {
    if (this.userWishList().length === 0) return;

    this.wishlistService.clearFullWishlist().subscribe({
      next: () => {
        this.toastService.show('Success', 'Wishlist cleared successfully', 'success');
      },
      error: (err) => {
        this.toastService.show('Error', 'Failed to clear wishlist', 'error');
      },
    });
  }
}
