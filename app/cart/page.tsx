"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "../store/cartStore";
import CartItemCard from "../components/CartItemCard";
import * as Sentry from "@sentry/nextjs";
import { useUserStore } from "../store/userStore";
import Swal from 'sweetalert2';
import { decideAreaFromRubro } from "../utils/areaUtils";

const API_URL = process.env.NEXT_PUBLIC_LUMA_API;

export default function CartPage() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);

  const { orderContext } = useUserStore();
  const [isSending, setIsSending] = useState(false);
  const [observations, setObservations] = useState("");

  const totalPrice = getTotalPrice();

  const handleSendOrder = async () => {
    setIsSending(true);
    if(!orderContext?.type || !orderContext?.id) {
      await Swal.fire({
        icon: 'error',
        title: 'No es posible enviar el pedido',
        text: 'Por favor, escanea el QR de la mesa o carpa previamente para enviar el pedido.',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#1E3A8A',
      });
      setIsSending(false);
      return;
    }
    try {
      const dataToSend = {
        location_type: orderContext?.type,
        location_id: orderContext?.id,
        status: 'pending',
        description: observations.trim() || null,
        products: items.map((item) => ({
          product_id: item.product.COD_ARTICU,
          quantity: item.quantity,
          name: item.product.DESCRIPCION,
          price: Number(item.product.PRECIO_MOSTRADOR),
          area: decideAreaFromRubro(item.product.RUBRO),
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
      clearCart();
      setObservations(""); // Limpiar observaciones después de enviar
      
      // Mostrar mensaje de éxito con SweetAlert
      await Swal.fire({
        icon: 'success',
        title: 'Pedido enviado correctamente',
        text: 'Estamos preparando tu pedido',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#1E3A8A',
      });
      
      // Mantener los query params al redirigir para preservar el contexto
      const queryParams = orderContext 
        ? `?type=${orderContext.type}&id=${orderContext.id}`
        : '';
      router.push(`/${queryParams}`);
    } catch (error) {
      Sentry.captureException(error);
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo enviar el pedido. Por favor, intenta nuevamente.',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#1E3A8A',
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 w-full ">
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
                <CartItemCard key={item.product.COD_ARTICU} item={item} />
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
          <div className="fixed bottom-0 left-0 right-0 bg-gray-100 border-t border-gray-200">
            <div className="max-w-[600px] mx-auto px-4 py-4">
              {/* Campo de observaciones */}
              <div className="mb-4">
                  <textarea
                    id="observations"
                    value={observations}
                    onChange={(e) => setObservations(e.target.value)}
                    placeholder="Ingrese una observación para el pedido"
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-base text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={2}
                    maxLength={500}
                  />
              </div>

              {/* Total */}
              <div className="flex justify-between items-center mb-4">
                <span className="text-base font-medium text-gray-700">Total</span>
                <span className="text-2xl font-bold text-gray-900">
                  $ {totalPrice.toLocaleString("es-AR")}
                </span>
              </div>

              {/* Botón Enviar pedido */}
              <button 
                onClick={handleSendOrder} 
                disabled={isSending}
                className={`w-full font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                  isSending 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                }`}
              >
                {isSending ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-gray-500"
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
                    <span>Enviando pedido...</span>
                  </>
                ) : (
                  <span>Enviar pedido</span>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

