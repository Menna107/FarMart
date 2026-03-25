import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SubCategoryService } from '../../core/services/subCategory/sub-category.service';
import { Category } from '../../core/models/category.interface';

@Component({
  selector: 'app-sub-categories',
  imports: [RouterLink],
  templateUrl: './sub-categories.component.html',
  styleUrl: './sub-categories.component.css',
})
export class SubCategoriesComponent implements OnInit {
  private readonly subCategoryService = inject(SubCategoryService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly cdr = inject(ChangeDetectorRef);

  subCategoriesList: Category[] = [];
  categoryName: string | null = null;
  categoryId: string | null = null;

  ngOnInit(): void {
    this.getCategoryId();
  }

  getCategoryId(): void {
    this.activatedRoute.paramMap.subscribe({
      next: (param) => {
        this.categoryId = param.get('id');
        this.categoryName = param.get('name');
        this.getAllSubCategoriesOnCategory(this.categoryId);
      },
    });
  }

  getAllSubCategoriesOnCategory(categoryId: string | null): void {
    this.subCategoryService.getAllSubCategoriesOnCategory(categoryId).subscribe({
      next: (res) => {
        this.subCategoriesList = res.data;
        this.cdr.detectChanges();
      },
    });
  }
}
