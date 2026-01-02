"use client";

import Image from "next/image";
import { useState } from "react";
import { Product } from "@/types/products/product";
import AddToCartButton from "./AddToCartButton";
import { getProductImageUrl } from "@/utils/imageUtils";
import { useAuthStore } from "../store/authStore";
import { useProductStore } from "../store/productStore";

interface ProductCardProps {
  product: Product;
  name: string;
  description: string;
  price: string;
  image: string;
}

export default function ProductCard({
  product,
  name,
  description,
  price,
  image = '/images/luma.jpg',
    }: ProductCardProps) {
  const [hasError, setHasError] = useState(false);
  const [isUpdatingStock, setIsUpdatingStock] = useState(false);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const updateProductStock = useProductStore((state) => state.updateProductStock);
  const imageSrc = hasError ? '/images/luma.jpg' : getProductImageUrl(product.COD_ARTICU);
  
  const sinStock = product.STOCK < 1;
  
  const handleToggleStock = async () => {
    const baseUrl = process.env.NEXT_PUBLIC_LUMA_API;
    if (!baseUrl) {
      console.error("Falta la variable NEXT_PUBLIC_LUMA_API");
      return;
    }

    setIsUpdatingStock(true);
    try {
      const newStock = sinStock ? 1 : 0;
      const response = await fetch(`${baseUrl}/v1/articles/${product.COD_ARTICU}/stock`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity: newStock }),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}`);
      }
      
      // Actualizar el store global
      updateProductStock(product.COD_ARTICU, newStock);
    } catch (error) {
      console.error("Error al actualizar stock:", error);
    } finally {
      setIsUpdatingStock(false);
    }
  };

  return (
    <div className={`rounded-lg shadow-sm border border-gray-100 overflow-hidden relative ${
      sinStock && !isAuthenticated 
        ? 'bg-gray-200' 
        : 'bg-white'
    }`}>
      {sinStock && !isAuthenticated && (
        <div className="absolute bottom-2 right-2 z-30">
          <div className="bg-gray-700 text-white text-xs font-semibold px-3 py-1.5 rounded-md shadow-md">
            Sin Stock
          </div>
        </div>
      )}
      
      <div className="flex items-center relative">
        <div className="flex-1 p-4 flex flex-col justify-between min-h-[120px]">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">{name}</h3>
            <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
              {description}
            </p>
          </div>
          <div className="mt-3">
            <p className="text-lg font-bold text-gray-900">
              $ {Number(price).toLocaleString("es-AR")}
            </p>
            {isAuthenticated && (
              <button
                onClick={handleToggleStock}
                disabled={isUpdatingStock}
                className={`mt-2 px-3 py-1.5 rounded-full flex items-center justify-center transition-all text-xs font-semibold w-fit ${
                  sinStock
                    ? 'bg-green-500 hover:bg-green-600 text-white'
                    : 'bg-red-500 hover:bg-red-600 text-white'
                } ${isUpdatingStock ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer shadow-md hover:scale-105'}`}
                aria-label={sinStock ? "Marcar con stock" : "Marcar sin stock"}
                title={sinStock ? "Marcar con stock" : "Marcar sin stock"}
              >
                {isUpdatingStock ? (
                  <svg
                    className="animate-spin h-3 w-3"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : sinStock ? (
                  "Marcar con Stock"
                ) : (
                  "Marcar sin Stock"
                )}
              </button>
            )}
          </div>
        </div>

        <div className={`relative w-28 h-28 shrink-0 ${sinStock && !isAuthenticated ? 'opacity-50' : ''}`}>
          <Image
            src={imageSrc}
            alt={name}
            fill
            className="object-cover"
            sizes="112px"
            unoptimized={imageSrc.startsWith('/images/')}
            onError={() => setHasError(true)}
          />
        </div>
      </div>

      <AddToCartButton product={product} />
    </div>
  );
}

