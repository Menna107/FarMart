import { Product } from './product.interface';

export interface CartProduct {
  count: number;
  _id: string;
  product: Product;
  price: number;
}
