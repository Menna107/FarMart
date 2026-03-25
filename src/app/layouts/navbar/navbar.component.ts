import {
  ChangeDetectorRef,
  Component,
  computed,
  ElementRef,
  HostListener,
  inject,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CategoryService } from '../../core/services/category/category.service';
import { Category } from '../../core/models/category.interface';
import { AuthService } from '../../core/auth/services/auth.service';
import { isPlatformBrowser } from '@angular/common';
import Swal from 'sweetalert2';
import { WishlistService } from '../../core/services/wishlist.service';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  private router = inject(Router);
  private readonly categoryService = inject(CategoryService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly authService = inject(AuthService);
  private readonly pLATFORM_ID = inject(PLATFORM_ID);
  private readonly elementRef = inject(ElementRef);
  private readonly wishlistService = inject(WishlistService);
  private readonly cartService = inject(CartService);

  isLogged = computed(() => this.authService.isLogged());
  userWishList = computed(() => this.wishlistService.wishlistItems());
  userCart = computed(() => this.cartService.CartItems());

  categories: Category[] = [];
  isMenuOpen = false;
  isProfileOpen = false;

  userName: string | null = '';
  userEmail: string = '';

  ngOnInit(): void {
    this.getAllCategories();

    if (isPlatformBrowser(this.pLATFORM_ID)) {
      if (localStorage.getItem('token')) {
        this.authService.isLogged.set(true);
      }
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const userObj = JSON.parse(storedUser);

        this.userName = userObj.name;
        this.userEmail = userObj.email;
      }
    }
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  // Search
  onNavSearch(inputElement: HTMLInputElement) {
    const term = inputElement.value;

    if (term.trim()) {
      this.router.navigate(['/shop'], {
        queryParams: { q: term },
        queryParamsHandling: 'merge',
      });

      inputElement.value = '';
      this.isMenuOpen = false;
    }
  }

  // Get All Categories
  getAllCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (res) => {
        this.categories = res.data;
        this.cdr.detectChanges();
      },
    });
  }

  // logOut Logic:
  logOut(): void {
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

  closeMenu() {
    this.isMenuOpen = false;
  }

  toggleProfile() {
    this.isProfileOpen = !this.isProfileOpen;
  }

  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isProfileOpen = false;
    }
  }
}
