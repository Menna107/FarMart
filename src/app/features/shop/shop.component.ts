import { ProductService } from './../../core/services/Product/product.service';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CategoryService } from '../../core/services/category/category.service';
import { BrandService } from '../../core/services/brand.service';
import { Category } from '../../core/models/category.interface';
import { Brand } from '../../core/models/brand.interface';
import { Product } from '../../core/models/product.interface';
import { ProductsComponent } from '../products/products.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [RouterLink, ProductsComponent, FormsModule],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.css',
})
export class ShopComponent implements OnInit {
  private readonly categoryService = inject(CategoryService);
  private readonly brandService = inject(BrandService);
  private readonly productService = inject(ProductService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly route = inject(ActivatedRoute);

  categories: Category[] = [];
  brands: Brand[] = [];
  allProducts: Product[] = [];
  productList: Product[] = [];

  isFilterOpen = false;

  filters: any = {
    category: [],
    brand: [],
    priceMin: 0,
    priceMax: 50000,
    keyword: '',
  };

  ngOnInit(): void {
    this.loadInitialData();
    this.getAllCategories();
    this.getAllBrands();

    this.getSearchTermFromURL();
  }

  // get search term from nav
  getSearchTermFromURL() {
    this.route.queryParams.subscribe((params) => {
      if (params['q']) {
        this.filters.keyword = params['q'];
        this.applyFilters();
      } else {
        this.filters.keyword = '';
        this.applyFilters();
      }
    });
  }

  loadInitialData() {
    this.productService.getAllProducts().subscribe((res) => {
      this.allProducts = res.data;
      this.applyFilters();
    });
  }

  applyFilters() {
    let filtered = [...this.allProducts];

    if (this.filters.category.length > 0) {
      filtered = filtered.filter((p) => this.filters.category.includes(p.category._id));
    }

    if (this.filters.brand.length > 0) {
      filtered = filtered.filter((p) => this.filters.brand.includes(p.brand._id));
    }

    filtered = filtered.filter(
      (p) => p.price >= this.filters.priceMin && p.price <= this.filters.priceMax,
    );

    if (this.filters.keyword) {
      const term = this.filters.keyword.toLowerCase();
      filtered = filtered.filter(
        (p) => p.title.toLowerCase().includes(term) || p.description?.toLowerCase().includes(term),
      );
    }

    this.productList = filtered;
    this.cdr.detectChanges();
  }

  onFilterChange(type: 'category' | 'brand', id: string) {
    const index = this.filters[type].indexOf(id);
    if (index === -1) {
      this.filters[type].push(id);
    } else {
      this.filters[type].splice(index, 1);
    }
    this.applyFilters();
  }

  // while writing apply search
  onSearch(event: any) {
    this.filters.keyword = event.target.value;
    this.applyFilters();
  }

  // delete only one filter
  removeTag(type: 'category' | 'brand', id: string) {
    this.onFilterChange(type, id);
  }

  // delete all filters
  clearAllFilters() {
    this.filters = {
      category: [],
      brand: [],
      priceMin: 0,
      priceMax: 50000,
      keyword: '',
    };
    this.applyFilters();
  }

  getNameById(type: 'category' | 'brand', id: string): string {
    if (type === 'category') {
      return this.categories.find((c) => c._id === id)?.name || '';
    }
    return this.brands.find((b) => b._id === id)?.name || '';
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

  // Get All Brands
  getAllBrands(): void {
    this.brandService.getAllBrands().subscribe({
      next: (res) => {
        this.brands = res.data;
        this.cdr.detectChanges();
      },
    });
  }

  // filter design for mobile
  toggleFilters() {
    this.isFilterOpen = !this.isFilterOpen;
  }
}
