import { create } from "zustand";

interface CategoryStore {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

export const useCategoryStore = create<CategoryStore>((set) => ({
  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),
  selectedCategory: "Todos",
  setSelectedCategory: (category) => set({ selectedCategory: category }),
}));

