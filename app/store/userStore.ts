import { create } from "zustand";
import { OrderContextStore } from "@/types/auth/auth";


export const useUserStore = create<OrderContextStore>((set) => ({
  orderContext: null,
  setOrderContext: (ctx) => set({ orderContext: ctx }),
  clearOrderContext: () => set({ orderContext: null }),
}));