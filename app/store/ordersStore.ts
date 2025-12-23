import { create } from "zustand";
import { Order, OrderStatus } from "../types/orders/order";

interface OrdersStore {
  orders: Order[];
  selectedFilter: OrderStatus;
  setSelectedFilter: (filter: OrderStatus) => void;
  setOrders: (orders: Order[]) => void;
  markAsComplete: (orderId: string) => void;
  getFilteredOrders: () => Order[];
}

export const useOrdersStore = create<OrdersStore>((set, get) => ({
  orders: [],
  selectedFilter: "pending",
  setSelectedFilter: (filter) => set({ selectedFilter: filter }),
  setOrders: (orders) => set({ orders }),
  markAsComplete: (orderId) =>
    set((state) => ({
      orders: state.orders.map((order) =>
        order.id === orderId ? { ...order, status: "delivered" } : order
      ),
    })),
  getFilteredOrders: () => {
    const state = get();
    return state.orders.filter((order) => order.status === state.selectedFilter);
  },
}));

