import { ChangeDetectorRef, Component, computed, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ToastService } from '../../core/services/toast.service';
import { CartService } from '../../core/services/cart.service';
import { FormsModule } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-cart',
  imports: [RouterLink, FormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit {
  private readonly cartService = inject(CartService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly toastService = inject(ToastService);
  private readonly platformId = inject(PLATFORM_ID);

  couponCode: string = '';
  isApplying: boolean = false;

  readonly taxPrice = 20;
  readonly shippingPrice = 100;

  userCart = computed(() => this.cartService.CartItems());
  CartId = computed(() => this.cartService.CartId());
  totalCartPrice = computed(() => {
    return this.userCart().reduce((total, item) => total + item.price * item.count, 0);
  });

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.cartService.getUserCart().subscribe();
    }
  }

  updateQuantity(productId: string, newCount: number) {
    if (newCount <= 0) {
      this.removeItem(productId);
      return;
    }

    this.cartService.updateProductCartQuantity(productId, { count: newCount }).subscribe({
      next: (res) => {
        this.toastService.show('Success', 'Quantity Updated', 'success');
        this.cdr.detectChanges();
      },
    });
  }

  removeItem(productId: string) {
    this.cartService.removeProductFromCart(productId).subscribe({
      next: () => {
        this.toastService.show('Success', 'Item removed', 'success');
        this.cdr.detectChanges();
      },
    });
  }

  clearCart() {
    if (this.userCart().length === 0) return;

    this.cartService.clearCart().subscribe({
      next: () => {
        this.toastService.show('Success', 'Cart cleared successfully', 'success');
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.toastService.show('Error', 'Failed to clear Cart', 'error');
        this.cdr.detectChanges();
      },
    });
  }

  applyCoupon() {
    if (!this.couponCode.trim()) {
      this.toastService.show('Warning', 'Please enter a coupon code', 'warning');
      return;
    }

    this.isApplying = true;
    this.cartService.applyCoupon({ couponName: this.couponCode }).subscribe({
      next: (res) => {
        this.toastService.show('Success', 'Coupon applied successfully!', 'success');
        this.isApplying = false;
        this.cdr.detectChanges();
      },
    });
  }
}
