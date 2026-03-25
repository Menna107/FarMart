import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BrandsComponent } from '../brands/brands.component';
import { CategoriesComponent } from '../categories/categories.component';
import { NotFoundComponent } from '../not-found/not-found.component';
import { Location } from '@angular/common';

@Component({
  selector: 'app-filtered-type',
  imports: [BrandsComponent, CategoriesComponent, RouterLink, NotFoundComponent],
  templateUrl: './filtered-type.component.html',
  styleUrl: './filtered-type.component.css',
})
export class FilteredTypeComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly location = inject(Location);
  private readonly router = inject(Router);

  type: string | null = null;

  constructor() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit(): void {
    this.getType();
  }

  getType(): void {
    this.activatedRoute.paramMap.subscribe({
      next: (res) => {
        this.type = res.get('type');
      },
    });
  }
}
