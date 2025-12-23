"use client";

import Link from "next/link";
import { useCartStore } from "../store/cartStore";

export default function ResumeCart() {
  const items = useCartStore((state) => state.items);

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = items.reduce(
    (acc, item) => acc + item.quantity * item.product.PRECIO_MOSTRADOR,
    0
  );

  if (totalItems === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white pt-2">
      <div className="flex justify-center">
        <div className="w-full max-w-[600px] px-4 pb-4">
          <div className="bg-gray-200 rounded-lg px-4 py-3 flex items-center gap-3">
          {/* Icono de carrito */}
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#374151"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>

          {/* Número de items */}
          <span className="text-gray-700 font-medium">{totalItems}</span>

          {/* Texto "Ver carrito" centrado */}
          <Link href="/cart" className="flex-1 text-center">
            <span className="text-gray-700 font-medium cursor-pointer hover:underline">
              Ver carrito
            </span>
          </Link>

          {/* Precio total */}
          <span className="text-gray-700 font-medium">
            $ {totalPrice.toLocaleString("es-AR")}
          </span>
          </div>
        </div>
      </div>
    </div>
  );
}