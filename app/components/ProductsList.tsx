"use client";

import { useEffect, useState } from "react";
import { Product } from "@/types/products/product";
import ProductCard from "./ProductCard";
import { useCategoryStore } from "../store/categoryStore";
import { mockupProducts } from "@/mockup/products";

export default function ProductsList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const selectedCategory = useCategoryStore((state) => state.selectedCategory);
  const searchQuery = useCategoryStore((state) => state.searchQuery);

  useEffect(() => {
    const fetchProducts = async () => {
      const baseUrl = process.env.NEXT_PUBLIC_LUMA_API;
      if (!baseUrl) {
        setError("Falta la variable NEXT_PUBLIC_LUMA_API");
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${baseUrl}/v1/articles/`);
        //if (!response.ok) {
        //  throw new Error(`Error ${response.status}`);
        //}
        //const data = await response.json();
        
        setProducts(mockupProducts);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al cargar productos");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts =
    selectedCategory === "Todos"
      ? products.filter(
          (product) =>
            product.DESCRIPCION.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.DESCRIPCION_COMANDA
              .toLowerCase()
              .includes(searchQuery.toLowerCase())
        )
      : products.filter(
          (product) =>
            product.RUBRO === selectedCategory &&
            (product.DESCRIPCION.toLowerCase().includes(searchQuery.toLowerCase()) ||
              product.DESCRIPCION_COMANDA
                .toLowerCase()
                .includes(searchQuery.toLowerCase()))
        );


  return (
    <div className="max-w-[600px] mx-auto px-4 py-4 overflow-y-auto pb-28">
      <div className="flex flex-col gap-3">
        {loading ? (
          <div className="text-center py-8 text-gray-500">Cargando productos...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">Error: {error}</div>
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
          <div className="text-center py-8 text-gray-500">
            No hay productos en esta categoría
          </div>
        )}
      </div>
    </div>
  );
}