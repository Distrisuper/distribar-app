export type OrderStatus = "pending" | "delivered" | "prepending";
export type OrderItemsStatus = "pending" | "delivered";

export type OrderItem = {
  name: string;
  quantity: number;
  price: number;
  area: string;
  status: OrderItemsStatus;
};

export type Order = {
  id: string;
  location_type: string;
  location_id: number;
  time: string;
  created_at?: string;
  items: OrderItem[];
  status: OrderStatus;
  description?: string | null;
};

