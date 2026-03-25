import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilteredProductsComponent } from './filtered-products.component';

describe('FilteredProductsComponent', () => {
  let component: FilteredProductsComponent;
  let fixture: ComponentFixture<FilteredProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilteredProductsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FilteredProductsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
