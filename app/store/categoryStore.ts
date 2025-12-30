import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CategoryStore {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

export const useCategoryStore = create<CategoryStore>()(
  persist(
    (set) => ({
      searchQuery: "",
      setSearchQuery: (query) => set({ searchQuery: query }),
      selectedCategory: "Todos",
      setSelectedCategory: (category) => set({ selectedCategory: category }),
    }),
    {
      name: "category-storage", // nombre de la clave en localStorage
    }
  )
);

