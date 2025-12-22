"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/authStore";
import { useOrdersStore } from "../store/ordersStore";
import OrderCard from "../components/staff/OrderCard";
import { OrderStatus } from "../types/orders/order";

export default function StaffPanel() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const [isChecking, setIsChecking] = useState(true);

  const selectedFilter = useOrdersStore((state) => state.selectedFilter);
  const setSelectedFilter = useOrdersStore((state) => state.setSelectedFilter);
  const orders = useOrdersStore((state) => state.orders);
  const markAsComplete = useOrdersStore((state) => state.markAsComplete);

  // Memoizar los pedidos filtrados para evitar re-renders innecesarios
  const filteredOrders = useMemo(
    () => orders.filter((order) => order.status === selectedFilter),
    [orders, selectedFilter]
  );

  useEffect(() => {
    // Verificar cookie al cargar la página (solo en cliente)
    if (typeof window !== "undefined") {
      checkAuth();
      setIsChecking(false);
    }
  }, [checkAuth]);

  useEffect(() => {
    if (!isChecking && !isAuthenticated) {
      router.push("/staff/login");
    }
  }, [isAuthenticated, isChecking, router]);

  const handleLogout = () => {
    logout();
    router.push("/staff/login");
  };

  const handleBack = () => {
    router.push("/");
  };

  const filters: { label: string; value: OrderStatus }[] = [
    { label: "Activo", value: "activo" },
    { label: "Bar", value: "bar" },
    { label: "Cocina", value: "cocina" },
    { label: "Completado", value: "completado" },
  ];

  if (isChecking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Cargando...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[600px] mx-auto bg-white min-h-screen">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="px-4 py-3">
            {/* Título y botón salir */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleBack}
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
                <h1 className="text-lg font-semibold text-gray-900">
                  Panel de Staff
                </h1>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Salir
              </button>
            </div>

            {/* Filtros */}
            <div className="flex gap-2 overflow-x-auto hide-scrollbar">
              {filters.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setSelectedFilter(filter.value)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedFilter === filter.value
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* Lista de pedidos */}
        <div className="px-4 py-4">
          {filteredOrders.length > 0 ? (
            <div className="flex flex-col gap-4">
              {filteredOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onMarkComplete={() => markAsComplete(order.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>No hay pedidos en esta categoría</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

