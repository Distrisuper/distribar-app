import { create } from "zustand";
import { Product } from "@/types/products/product";
import { mockupProducts } from "@/mockup/products";

interface ProductStore {
  products: Product[];
  loading: boolean;
  error: string | null;
  
  setProducts: (products: Product[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  updateProductStock: (articleCode: string, quantity: number) => void;
  fetchProducts: () => Promise<void>;
}

export const useProductStore = create<ProductStore>((set, get) => ({
  products: [],
  loading: false,
  error: null,

  setProducts: (products) => set({ products: Array.isArray(products) ? products : [] }),
  
  setLoading: (loading) => set({ loading }),
  
  setError: (error) => set({ error }),
  
  updateProductStock: (articleCode, quantity) => {
    set((state) => ({
      products: state.products.map((product) =>
        product.COD_ARTICU === articleCode
          ? { ...product, STOCK: quantity }
          : product
      ),
    }));
  },
  
  fetchProducts: async () => {
    const baseUrl = process.env.NEXT_PUBLIC_LUMA_API;
    if (!baseUrl) {
      set({ error: "Falta la variable NEXT_PUBLIC_LUMA_API", products: mockupProducts, loading: false });
      return;
    }

    set({ loading: true, error: null });
    try {
      const response = await fetch(`${baseUrl}/v1/articles/`);
      if (!response.ok) {
        throw new Error(`Error ${response.status}`);
      }
      const data = await response.json();
      set({ products: Array.isArray(data) ? data : [], loading: false, error: null });
    } catch (err) {
      set({
        products: mockupProducts,
        error: err instanceof Error ? err.message : "Error al cargar productos",
        loading: false,
      });
    }
  },
}));

