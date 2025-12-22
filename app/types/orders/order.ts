export type OrderStatus = "activo" | "bar" | "cocina" | "completado";

export type OrderItem = {
  name: string;
  quantity: number;
  price: number;
};

export type Order = {
  id: string;
  orderNumber: string;
  time: string;
  location: string; // "Cama 12", "Mesa 5", etc.
  items: OrderItem[];
  status: OrderStatus;
};

