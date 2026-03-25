import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilteredTypeComponent } from './filtered-type.component';

describe('FilteredTypeComponent', () => {
  let component: FilteredTypeComponent;
  let fixture: ComponentFixture<FilteredTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilteredTypeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FilteredTypeComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
