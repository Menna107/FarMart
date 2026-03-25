import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'calculateDiscount',
  standalone: true,
})
export class CalculateDiscountPipe implements PipeTransform {
  transform(price: number, priceAfterDiscount?: number): number {
    if (!priceAfterDiscount || priceAfterDiscount >= price || price <= 0) {
      return 0;
    }

    const discountPercentage = ((price - priceAfterDiscount) / price) * 100;

    return Math.round(discountPercentage);
  }
}
