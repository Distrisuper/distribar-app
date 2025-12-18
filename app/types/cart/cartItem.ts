import { Product } from "../products/product";

export type CartItem = {
  product: Product;
  quantity: number;
};