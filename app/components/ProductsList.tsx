"use client";

import ProductCard from "./ProductCard";
import { useCategoryStore } from "../store/categoryStore";

const products = [
  {
    id: 1,
    name: "Gin Tonic Premium",
    description: "Gin Bombay Sapphire, tónica Schweppes, limón y hierbas aromáticas",
    price: 8500,
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/gin-tonic-cocktail-with-herbs-9Yi8YkKmlW96qqmQSvPvQKaCdYJIMh.jpg",
    category: "Tragos",
  },
  {
    id: 2,
    name: "ñoquis con boloñesa",
    description: "Ñoquis caseros con salsa bolognesa tradicional y queso parmesano",
    price: 7500,
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/gnocchi-with-bolognese-sauce-8BA8cj5VqHO3yoIGeVGcGwkDR7RO3q.jpg",
    category: "Comida",
  },
  {
    id: 3,
    name: "Hamburguesa Premium",
    description: "Hamburguesa con carne 100% vacuna, lechuga, tomate, cebolla y queso cheddar",
    price: 9500,
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/gourmet-burger-bacon-cheese-ONEnUKaebNTrCDqUvVCmXm3ATYNlDX.jpg",
    category: "Comida",
  },
  {
    id: 4,
    name: "Papas bravas",
    description: "Papas fritas crujientes con salsa brava picante",
    price: 4500,
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/patatas-bravas-spicy-sauce-bhJDWoMlbU83P4qNbDJraCBn18pRCm.jpg",
    category: "Comida",
  }
];

export default function ProductsList() {
  const selectedCategory = useCategoryStore((state) => state.selectedCategory);

  // Filtrar productos según la categoría seleccionada
  const filteredProducts =
    selectedCategory === "Todos"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  return (
    <div className="max-w-[600px] mx-auto px-4 py-4">
      <div className="flex flex-col gap-3">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard
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