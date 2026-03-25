import { CartProduct } from './cart-product.interface';
import { User } from './user.interface';

export interface Order {
  shippingAddress: ShippingAddress;
  taxPrice: number;
  shippingPrice: number;
  totalOrderPrice: number;
  paymentMethodType: string;
  isPaid: boolean;
  isDelivered: boolean;
  _id: string;
  user: User;
  cartItems: CartProduct[];
  createdAt: string;
  updatedAt: string;
  id: number;
  __v: number;
}

interface ShippingAddress {
  details: string;
  phone: string;
  city: string;
}
