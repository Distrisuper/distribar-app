"use client";

import { useRouter } from "next/navigation";
import { useCartStore } from "../store/cartStore";
import CartItemCard from "../components/CartItemCard";
import * as Sentry from "@sentry/nextjs";
import { useUserStore } from "../store/userStore";
import { v4 as uuidv4 } from 'uuid';

const API_URL = process.env.NEXT_PUBLIC_LUMA_API;

export default function CartPage() {
  const router = useRouter();
  const { items, clearCart, getTotalPrice } = useCartStore();
  const { orderContext } = useUserStore();

  const totalPrice = getTotalPrice();

  const handleSendOrder = async () => {
    try {
      const dataToSend = {
        location_type: orderContext?.type,
        location_id: orderContext?.id,
        status: 'pending',
        products: items.map((item) => ({
          product_id: '001',
          quantity: item.quantity,
          name: item.product.DESCRIPCION,
          price: Number(item.product.PRECIO_MOSTRADOR),
          area: 'bar',
          status: 'pending',
        })),
      }

      const response = await fetch(`${API_URL}/v1/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });
      if(!response.ok) {
        throw new Error('Failed to send order');
      }
      console.log(response);
      clearCart();
      // Mantener los query params al redirigir para preservar el contexto
      const queryParams = orderContext 
        ? `?type=${orderContext.type}&id=${orderContext.id}`
        : '';
      router.push(`/${queryParams}`);
    } catch (error) {
      console.error(error);
      Sentry.captureException(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[600px] mx-auto bg-white min-h-screen">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="flex items-center px-4 py-3">
            <button
              onClick={() => {
                const queryParams = orderContext 
                  ? `?type=${orderContext.type}&id=${orderContext.id}`
                  : '';
                router.push(`/${queryParams}`);
              }}
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
                <CartItemCard key={uuidv4()} item={item} />
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

