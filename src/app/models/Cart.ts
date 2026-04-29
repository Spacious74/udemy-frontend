import { CartItem } from "./CartItems";
export interface Cart {
  _id: string;
  userId: string;
  cartItems: CartItem[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

