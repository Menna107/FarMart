import { ChangeDetectorRef, Component, computed, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../core/services/Product/product.service';
import { Product } from '../../core/models/product.interface';
import { CalculateDiscountPipe } from '../../shared/pipes/calculate-discount-pipe';
import { DatePipe, isPlatformBrowser, Location } from '@angular/common';
import { WishlistService } from '../../core/services/wishlist.service';
import { CartService } from '../../core/services/cart.service';
import { ToastService } from '../../core/services/toast.service';
import { ReviewsService } from '../../core/services/reviews.service';
import { Review } from '../../core/models/review.interface';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductsComponent } from '../products/products.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CalculateDiscountPipe, DatePipe, ReactiveFormsModule, ProductsComponent],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css',
})
export class ProductDetailsComponent implements OnInit {
  // My Services
  private readonly productService = inject(ProductService);
  private readonly wishlistService = inject(WishlistService);
  private readonly cartService = inject(CartService);
  private readonly reviewsService = inject(ReviewsService);
  private readonly toastService = inject(ToastService);

  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly cdr = inject(ChangeDetectorRef);
  public readonly location = inject(Location);
  public readonly id = inject(PLATFORM_ID);

  // Product display
  productId: string | null = '';
  productDetails!: Product;
  selectedImage: string = '';
  productReviews: Review[] = [];

  // wishlist + cart
  wishlistIds = computed(() => this.wishlistService.wishlistItems().map((item) => item._id));
  cartIds = computed(() =>
    this.cartService.CartItems().map((item: any) => item.product?._id || item._id),
  );

  // Reviews
  showAllReviews: boolean = false;
  review: FormControl = new FormControl('', [Validators.required]);
  rating: FormControl = new FormControl(null, [Validators.required]);
  isEditModalOpen: boolean = false;
  editReviewId: string = '';
  editForm: FormGroup = new FormGroup({
    review: new FormControl('', [Validators.required]),
    rating: new FormControl(0, [Validators.required]),
  });

  similarProducts: Product[] = [];

  userName: string | null = '';

  ngOnInit(): void {
    this.getProductId();
    if (isPlatformBrowser(this.id)) {
      if (typeof localStorage !== 'undefined' && localStorage.getItem('token')) {
        this.wishlistService.getUserWishList().subscribe();
        this.cartService.getUserCart().subscribe();
      }
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const userObj = JSON.parse(storedUser);

        this.userName = userObj.name;
      }
    }
  }

  // ^===================Product Details====================
  getProductId(): void {
    this.activatedRoute.paramMap.subscribe({
      next: (params) => {
        this.productId = params.get('id');
        if (this.productId) {
          this.getSpecificProductData(this.productId);
          this.getAllReviews(this.productId);
        }
      },
    });
  }

  // Get product data and it's reviews
  getSpecificProductData(id: string): void {
    this.productService.getSpecificProducts(id).subscribe({
      next: (res) => {
        this.productDetails = res.data;
        this.selectedImage = this.productDetails.imageCover;

        this.getSimilarProducts(this.productDetails.category._id);
        this.cdr.detectChanges();
      },
    });
  }

  changeImage(imgUrl: string): void {
    this.selectedImage = imgUrl;
  }

  getSimilarProducts(categoryId: string): void {
    this.productService.getFilteredProducts('category', categoryId).subscribe({
      next: (res) => {
        this.similarProducts = res.data.filter((p: Product) => p._id !== this.productId);
      },
    });
  }

  // ^===================Reviews====================
  getAllReviews(productId: string): void {
    this.reviewsService.getReviewsForProduct(productId).subscribe({
      next: (res) => {
        this.productReviews = res.data;
      },
    });
  }

  createReview(productId: string) {
    if (this.rating.valid && this.review.valid) {
      const data = {
        review: this.review.value,
        rating: this.rating.value,
      };

      this.reviewsService.createReview(productId, data).subscribe({
        next: (res) => {
          this.toastService.show('Success', 'Thanks For Your Review', 'success');
          const newReview = res.data;
          newReview.user = { name: this.userName };
          newReview.createdAt = new Date();

          this.productReviews = [newReview, ...this.productReviews];
          this.clearReview();
          this.cdr.detectChanges();
        },
      });
    } else {
      this.rating.markAsTouched();
      this.review.markAsTouched();
    }
  }

  // show all reviews?
  toggleReviewsDisplay() {
    this.showAllReviews = !this.showAllReviews;
  }
  setRating(stars: number) {
    this.rating.setValue(stars);
  }
  clearReview() {
    this.rating.setValue(null);
    this.review.setValue('');
    this.cdr.detectChanges();
  }

  openEditModal(review: any) {
    this.editReviewId = review._id;
    this.editForm.patchValue({
      review: review.review,
      rating: review.rating,
    });
    this.isEditModalOpen = true;
  }

  updateReview() {
    if (this.editForm.valid && this.productId) {
      const updatedValue = this.editForm.value;

      this.reviewsService.updateReview(this.editReviewId, updatedValue).subscribe({
        next: (res) => {
          this.toastService.show('Success', 'Review Updated Successfully', 'success');
          const index = this.productReviews.findIndex((r) => r._id === this.editReviewId);
          if (index !== -1) {
            this.productReviews[index].review = updatedValue.review;
            this.productReviews[index].rating = updatedValue.rating;
          }
          this.closeEditModal();
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.toastService.show('Error', 'Failed to update review', 'error');
        },
      });
    }
  }

  deleteReview(reviewId: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will delete your review!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0891b2',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'Cancel',
      color: '#0e7490',
    }).then((result) => {
      if (result.isConfirmed) {
        this.reviewsService.deleteReview(reviewId).subscribe({
          next: (res) => {
            this.toastService.show('Success', 'Review Deleted Successfully', 'success');
            this.productReviews = this.productReviews.filter((review) => review._id !== reviewId);
            this.cdr.detectChanges();
          },
        });
      }
    });
  }

  closeEditModal() {
    this.isEditModalOpen = false;
    this.editReviewId = '';
    this.editForm.reset();
  }

  setEditRating(stars: number): void {
    this.editForm.get('rating')?.setValue(stars);
  }

  // ^===================WishList====================
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

  // ^===================Cart====================
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
