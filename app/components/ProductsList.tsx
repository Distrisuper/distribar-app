"use client";

import ProductCard from "./ProductCard";
import { useCategoryStore } from "../store/categoryStore";
import { Product } from "../types/products/product";
import { mockupProducts } from "../mockup/products";

export default function ProductsList() {
  const selectedCategory = useCategoryStore((state) => state.selectedCategory);
  const searchQuery = useCategoryStore((state) => state.searchQuery);

  const filteredProducts =
    selectedCategory === "Todos"
      ? mockupProducts.filter((product) => product.name.toLowerCase().includes(searchQuery.toLowerCase() ) || product.description.toLowerCase().includes(searchQuery.toLowerCase() ))
      : mockupProducts.filter((product) => (product.category === selectedCategory ) && (product.name.toLowerCase().includes(searchQuery.toLowerCase() ) || product.description.toLowerCase().includes(searchQuery.toLowerCase() )) );

  return (
    <div className="max-w-[600px] mx-auto px-4 py-4 h-[72vh] overflow-y-auto">
      <div className="flex flex-col gap-3">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard
              product={product}
              key={product.id}
              id={product.id}
              name={product.name}
              description={product.description}
              price={product.price}
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