"use client";

import { useEffect } from "react";
import ProductCard from "./ProductCard";
import { useCategoryStore } from "../store/categoryStore";
import { useProductStore } from "../store/productStore";

export default function ProductsList() {
  const products = useProductStore((state) => state.products);
  const loading = useProductStore((state) => state.loading);
  const error = useProductStore((state) => state.error);
  const fetchProducts = useProductStore((state) => state.fetchProducts);
  const selectedCategory = useCategoryStore((state) => state.selectedCategory);
  const searchQuery = useCategoryStore((state) => state.searchQuery);

  // Asegurar que products siempre sea un array
  const safeProducts = Array.isArray(products) ? products : [];

  useEffect(() => {
    if (safeProducts.length === 0 && !loading) {
      fetchProducts();
    }
  }, [safeProducts.length, loading, fetchProducts]);

  const filteredProducts =
    selectedCategory === "Todos"
      ? safeProducts.filter(
          (product) =>
            product.DESCRIPCION?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.DESCRIPCION_COMANDA
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase())
        )
      : safeProducts.filter((product) => {
          const rubroLower = product.RUBRO?.toLowerCase() || "";
          const categoryLower = selectedCategory.toLowerCase();
          
          const matchesCategory = 
            rubroLower.includes(categoryLower) ||
            (categoryLower.includes("cafeteria") && rubroLower.includes("pasteleria"));
          
          const matchesSearch =
            product.DESCRIPCION?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.DESCRIPCION_COMANDA?.toLowerCase().includes(searchQuery.toLowerCase());
          
          return matchesCategory && matchesSearch;
        });


  return (
    <div className="mx-auto px-4 py-4 overflow-y-auto pb-28 max-w-[600px] md:max-w-[1200px]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {loading ? (
          <div className="text-center py-8 text-gray-500 col-span-full">Cargando productos...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-500 col-span-full">Error: {error}</div>
        ) : filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard
              product={product}
              key={product.COD_ARTICU}
              name={product.DESCRIPCION}
              description={product.DESCRIPCION_COMANDA}
              price={product.PRECIO_MOSTRADOR}
              image={product.image}
            />
          ))
        ) : (
          <div className="text-center py-8 text-gray-500 col-span-full">
            No hay productos en esta categoría
          </div>
        )}
      </div>
    </div>
  );
}