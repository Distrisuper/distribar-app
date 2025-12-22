import { create } from "zustand";
import { Order, OrderStatus } from "../types/orders/order";

interface OrdersStore {
  orders: Order[];
  selectedFilter: OrderStatus;
  setSelectedFilter: (filter: OrderStatus) => void;
  markAsComplete: (orderId: string) => void;
  getFilteredOrders: () => Order[];
}

export const useOrdersStore = create<OrdersStore>((set, get) => ({
  orders: [
    {
      id: "1",
      orderNumber: "002-1766",
      time: "08:20 a. m.",
      location: "Cama 12",
      status: "activo",
      items: [
        { name: "Mojito", quantity: 3, price: 15000 },
        { name: "IPA Artesanal", quantity: 2, price: 7000 },
      ],
    },
    {
      id: "2",
      orderNumber: "002-1767",
      time: "08:35 a. m.",
      location: "Mesa 5",
      status: "bar",
      items: [
        { name: "Cerveza Lager", quantity: 4, price: 5000 },
        { name: "Agua", quantity: 2, price: 2000 },
      ],
    },
    {
      id: "3",
      orderNumber: "002-1768",
      time: "08:15 a. m.",
      location: "Cama 8",
      status: "cocina",
      items: [
        { name: "Hamburguesa Clásica", quantity: 2, price: 12000 },
        { name: "Papas Fritas", quantity: 2, price: 6000 },
      ],
    },
    {
      id: "4",
      orderNumber: "002-1765",
      time: "08:00 a. m.",
      location: "Mesa 3",
      status: "completado",
      items: [
        { name: "Pizza Margarita", quantity: 1, price: 18000 },
        { name: "Coca Cola", quantity: 2, price: 3000 },
      ],
    },
  ],
  selectedFilter: "activo",
  setSelectedFilter: (filter) => set({ selectedFilter: filter }),
  markAsComplete: (orderId) =>
    set((state) => ({
      orders: state.orders.map((order) =>
        order.id === orderId ? { ...order, status: "completado" } : order
      ),
    })),
  getFilteredOrders: () => {
    const state = get();
    return state.orders.filter((order) => order.status === state.selectedFilter);
  },
}));

