import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { Product } from '../../core/models/product.interface';
import { ProductService } from '../../core/services/Product/product.service';
import { CategoryService } from '../../core/services/category/category.service';
import { Category } from '../../core/models/category.interface';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-categories',
  imports: [RouterLink],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css',
})
export class CategoriesComponent implements OnInit {
  private readonly categoryService = inject(CategoryService);
  private readonly cdr = inject(ChangeDetectorRef);

  protected readonly Math = Math;
  categoryList: Category[] = [];

  ngOnInit(): void {
    this.getAllCategories();
  }

  getAllCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (res) => {
        this.categoryList = res.data;
        this.cdr.detectChanges();
      },
    });
  }
}
