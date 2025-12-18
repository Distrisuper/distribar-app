import { create } from "zustand";

interface CategoryStore {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

export const useCategoryStore = create<CategoryStore>((set) => ({
  selectedCategory: "Todos",
  setSelectedCategory: (category) => set({ selectedCategory: category }),
}));

