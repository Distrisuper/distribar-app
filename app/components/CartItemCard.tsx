"use client";

import Image from "next/image";
import { useCartStore } from "../store/cartStore";
import { CartItem } from "@/types/cart/cartItem";

interface CartItemCardProps {
  item: CartItem;
}

export default function CartItemCard({ item }: CartItemCardProps) {
  const increaseQuantity = useCartStore((state) => state.increaseQuantity);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);

  const { product, quantity } = item;
  const totalPrice = Number(product.PRECIO_MOSTRADOR) * quantity;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 flex items-center gap-3">
      {/* Imagen del producto */}
      <div className="relative w-20 h-20 shrink-0">
        <Image
          src='https://guiagastronomica.net/wp-content/uploads/cerveza-radler-fresca-con-limon-68_1.webp'
          alt={product.DESCRIPCION}
          fill
          className="object-cover rounded"
          sizes="80px"
        />
      </div>

      {/* Información y controles */}
      <div className="flex-1 flex flex-col gap-2">
        <h3 className="text-base font-medium text-gray-900">{product.DESCRIPCION}</h3>
        
        {/* Selector de cantidad */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => decreaseQuantity(product.COD_ARTICU)}
            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
            aria-label="Decrease quantity"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-700"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
          
          <span className="text-base font-medium text-gray-900 min-w-[24px] text-center">
            {quantity}
          </span>
          
          <button
            onClick={() => increaseQuantity(product.COD_ARTICU)}
            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
            aria-label="Increase quantity"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-700"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Precio total */}
      <div className="text-lg font-bold text-gray-900">
        $ {totalPrice.toLocaleString("es-AR")}
      </div>
    </div>
  );
}

