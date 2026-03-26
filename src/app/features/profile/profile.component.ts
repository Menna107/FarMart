import { ChangeDetectorRef, Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ChangePasswordComponent } from '../change-password/change-password.component';
import { AuthService } from '../../core/auth/services/auth.service';
import Swal from 'sweetalert2';
import { CartService } from '../../core/services/cart.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { isPlatformBrowser } from '@angular/common';
import { User } from '../../core/models/user.interface';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AddressService } from '../../core/services/address.service';
import { Address } from '../../core/models/address.interface';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-profile',
  imports: [RouterLink, ChangePasswordComponent, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);
  private readonly cartService = inject(CartService);
  private readonly wishlistService = inject(WishlistService);
  private readonly router = inject(Router);
  private readonly id = inject(PLATFORM_ID);
  private readonly addressService = inject(AddressService);
  private readonly toastService = inject(ToastService);
  private readonly formBuilder = inject(FormBuilder);

  activeTab = signal<'profile' | 'address' | 'password'>('profile');
  userData!: User;

  isModalOpen = signal(false);
  addressForm: FormGroup = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    details: ['', [Validators.required, Validators.minLength(10)]],
    phone: ['', [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]],
    city: ['', [Validators.required]],
  });

  userAddresses = signal<Address[]>([]);

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params) => {
      const targetTab = params['tab'];

      if (
        targetTab &&
        (targetTab === 'profile' || targetTab === 'address' || targetTab === 'password')
      ) {
        this.activeTab.set(targetTab);
      }
    });

    if (isPlatformBrowser(this.id)) {
      this.getUserAddresses();
    }

    this.getUserData();
  }

  getUserData() {
    if (isPlatformBrowser(this.id)) {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        this.userData = JSON.parse(savedUser);
      }
    }
  }

  getUserAddresses() {
    this.addressService.getUserAddresses().subscribe({
      next: (res) => {
        this.userAddresses.set(res.data);
        console.log(res);
      },
    });
  }

  openModal() {
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.addressForm.reset();
  }

  saveAddress() {
    if (this.addressForm.valid) {
      this.addressService.addAddress(this.addressForm.value).subscribe({
        next: (res) => {
          if (res.status === 'success') {
            this.toastService.show('success', 'Address Added Successfully!', 'success');
            this.getUserAddresses();
            this.closeModal();
          }
        },
      });
    } else {
      this.addressForm.markAllAsTouched();
    }
  }

  deleteAddress(addressId: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will Delete this Address!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0891b2',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Delete it',
      cancelButtonText: 'Cancel',
      color: '#0e7490',
    }).then((result) => {
      if (result.isConfirmed) {
        this.addressService.removeAddress(addressId).subscribe({
          next: (res) => {
            if (res.status === 'success') {
              this.toastService.show('Success', 'Address Deleted Successfully!', 'success');
              this.getUserAddresses();
            }
          },
        });
      }
    });
  }

  logout(): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will be logged out!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0891b2',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, log out',
      cancelButtonText: 'Cancel',
      color: '#0e7490',
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();

        this.cartService.resetCartLocal();
        this.wishlistService.resetWishlistLocal();

        this.authService.signOut();
        this.router.navigate(['/']);

        Swal.fire({
          title: 'Logged Out!',
          text: 'You have been successfully logged out.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
        });
      }
    });
  }
}
