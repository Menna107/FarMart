import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { BrandService } from '../../core/services/brand.service';
import { Brand } from '../../core/models/brand.interface';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-brands',
  imports: [RouterLink],
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.css',
})
export class BrandsComponent implements OnInit {
  private readonly brandService = inject(BrandService);
  private readonly cdr = inject(ChangeDetectorRef);

  protected readonly Math = Math;
  brandsList: Brand[] = [];

  ngOnInit(): void {
    this.getAllBrands();
  }

  getAllBrands(): void {
    this.brandService.getAllBrands().subscribe({
      next: (res) => {
        this.brandsList = res.data;
        this.cdr.detectChanges();
      },
    });
  }
}
