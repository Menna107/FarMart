import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ProductsComponent } from '../products/products.component';
import { CategoriesComponent } from '../categories/categories.component';
import { ProductService } from '../../core/services/Product/product.service';
import { Product } from '../../core/models/product.interface';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [ProductsComponent, CategoriesComponent, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly cdr = inject(ChangeDetectorRef);

  productsList: Product[] = [];
  ngOnInit(): void {
    this.getAllProducts();
  }

  getAllProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (res) => {
        this.productsList = res.data;
        this.cdr.detectChanges();
      },
    });
  }
}
