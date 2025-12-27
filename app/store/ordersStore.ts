import { create } from "zustand";
import { Order, OrderStatus } from "../types/orders/order";

export type OrderFilter = OrderStatus | "bar" | "kitchen";

interface OrdersStore {
  orders: Order[];
  selectedFilter: OrderFilter;
  setSelectedFilter: (filter: OrderFilter) => void;
  setOrders: (orders: Order[]) => void;
  markAsComplete: (orderId: string, area: string) => void;
  getFilteredOrders: () => Order[];
}

export const useOrdersStore = create<OrdersStore>((set, get) => ({
  orders: [],
  selectedFilter: "pending",
  setSelectedFilter: (filter) => set({ selectedFilter: filter }),
  setOrders: (orders) => set({ orders }),
  markAsComplete: (orderId, area) =>
    set((state) => ({
      orders: state.orders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              items: order.items.map((item) =>
                item.area === area ? { ...item, status: "delivered" } : item
              ),
            }
          : order
      ),
    })),
  getFilteredOrders: () => {
    const state = get();
    const { selectedFilter, orders } = state;
    
    if (selectedFilter === "pending" || selectedFilter === "delivered") {
      return orders.filter((order) => order.status === selectedFilter);
    }
    
    if (selectedFilter === "bar" || selectedFilter === "kitchen") {
      return orders.filter((order) => {
        if (order.status !== "pending") return false;
        return order.items.some((item) => item.area === selectedFilter);
      });
    }
    
    return orders;
  },
}));

