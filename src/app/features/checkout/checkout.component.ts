import { ChangeDetectorRef, Component, computed, inject, PLATFORM_ID } from '@angular/core';
import { CartService } from '../../core/services/cart.service';
import { ToastService } from '../../core/services/toast.service';
import { Router, RouterModule } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent {
  private readonly cartService = inject(CartService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly toastService = inject(ToastService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly router = inject(Router);

  checkOut: FormGroup = this.formBuilder.group({
    shippingAddress: this.formBuilder.group({
      details: ['', [Validators.required, Validators.minLength(10)]],
      city: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]],
    }),
  });

  paymentFlag: string = 'cash';
  readonly taxPrice = 20;
  readonly shippingPrice = 100;

  userCart = computed(() => this.cartService.CartItems());
  cartId = computed(() => this.cartService.CartId());

  calculateSubtotal(): number {
    return this.userCart().reduce((acc, item) => acc + item.price * item.count, 0);
  }

  submitForm() {
    if (this.checkOut.valid) {
      if (this.paymentFlag === 'cash') {
        this.createCashOrder();
      } else {
        this.createVisaOrder();
      }
    } else {
      this.checkOut.markAllAsTouched();
    }
  }

  createCashOrder() {
    this.cartService.createCashOrder(this.cartId(), this.checkOut.value).subscribe({
      next: (res) => {
        console.log(res);
        if (res.status === 'success') {
          this.toastService.show(res.status, res.message, res.status);
          if (isPlatformBrowser(this.platformId)) {
            const userId = res.user.id;
            localStorage.setItem('userId', userId);

            this.router.navigate(['/allorders']);
          }
        }
      },
    });
  }
  createVisaOrder() {
    this.cartService.createVisaOrder(this.cartId(), this.checkOut.value).subscribe({
      next: (res) => {
        console.log(res);
        if (res.status === 'success') {
          if (isPlatformBrowser(this.platformId)) {
            const userId = res.user.id;
            localStorage.setItem('userId', userId);
            window.open(res.session.url, '_self');
          }
        }
      },
    });
  }
}
