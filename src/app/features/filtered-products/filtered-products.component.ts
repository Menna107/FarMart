import { ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { ProductsComponent } from '../products/products.component';
import { BrandService } from '../../core/services/brand.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Brand } from '../../core/models/brand.interface';
import { Product } from '../../core/models/product.interface';
import { ProductService } from '../../core/services/Product/product.service';
import { Category } from '../../core/models/category.interface';
import { SubCategoryService } from '../../core/services/subCategory/sub-category.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-filtered-products',
  imports: [ProductsComponent, RouterLink],
  templateUrl: './filtered-products.component.html',
  styleUrl: './filtered-products.component.css',
})
export class FilteredProductsComponent implements OnInit {
  private readonly brandService = inject(BrandService);
  private readonly productService = inject(ProductService);
  private readonly subCategoryService = inject(SubCategoryService);
  private readonly activatedRoute = inject(ActivatedRoute);
  public readonly location = inject(Location);

  private readonly cdr = inject(ChangeDetectorRef);

  typeId: string | null = null;
  type: string | null = null;
  productsList: Product[] = [];

  typeData!: Brand | Category;

  ngOnInit(): void {
    this.getDataFromURL();
  }

  //Get type and id from url
  getDataFromURL(): void {
    this.activatedRoute.paramMap.subscribe({
      next: (param) => {
        this.typeId = param.get('id');
        this.type = param.get('type');
        if (this.typeId) {
          if (this.type === 'brand') {
            this.getSpecificBrand(this.typeId);
          } else {
            this.getSpecificSubCategory(this.typeId);
          }
          this.getFilteredProducts(this.type, this.typeId);
        }
      },
    });
  }

  // get data from a brand
  getSpecificBrand(typeId: string): void {
    this.brandService.getSpecificBrand(typeId).subscribe({
      next: (res) => {
        this.typeData = res.data;
        this.cdr.detectChanges();
      },
    });
  }

  // get data from a sub category
  getSpecificSubCategory(typeId: string): void {
    this.subCategoryService.getSpecificSubCategory(typeId).subscribe({
      next: (res) => {
        this.typeData = res.data;
        this.cdr.detectChanges();
      },
    });
  }

  // get Products for specific brand or category
  getFilteredProducts(type: string | null, id: string | null): void {
    this.productService.getFilteredProducts(type, id).subscribe({
      next: (res) => {
        this.productsList = res.data;
        this.cdr.detectChanges();
      },
    });
  }
}
