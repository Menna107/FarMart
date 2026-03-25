import { User } from './user.interface';

export interface Review {
  _id: string;
  rating: number;
  review: string;
  productId: string;
  user: User;
  createdAt: string;
  updatedAt: string;
}
