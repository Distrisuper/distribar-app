"use client";

import { useRouter } from "next/navigation";
import { useCartStore } from "../store/cartStore";
import CartItemCard from "../components/CartItemCard";
import * as Sentry from "@sentry/nextjs";

export default function CartPage() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);

  const totalPrice = getTotalPrice();

  const handleSendOrder = () => {
    alert("Pedido enviado");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[600px] mx-auto bg-white min-h-screen">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="flex items-center px-4 py-3">
            <button
              onClick={() => router.push("/")}
              className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Volver"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-700"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
            <h1 className="flex-1 text-center text-lg font-semibold text-gray-900">
              Tu Pedido
            </h1>
            <div className="w-10"></div>
          </div>
        </header>

        {/* Lista de productos */}
        <div className="px-4 py-4">
          {items.length > 0 ? (
            <div className="flex flex-col gap-3 mb-24">
              {items.map((item) => (
                <CartItemCard key={item.product.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>Tu carrito está vacío</p>
            </div>
          )}
        </div>

        {/* Resumen y botón de envío */}
        {items.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
            <div className="max-w-[600px] mx-auto px-4 py-4">
              {/* Total */}
              <div className="flex justify-between items-center mb-4">
                <span className="text-base font-medium text-gray-700">Total</span>
                <span className="text-xl font-bold text-gray-900">
                  $ {totalPrice.toLocaleString("es-AR")}
                </span>
              </div>

              {/* Botón Enviar pedido */}
              <button onClick={handleSendOrder} className="w-full bg-gray-200 text-gray-900 font-medium py-3 rounded-lg hover:bg-gray-300 transition-colors">
                Enviar pedido
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

