"use client";

import { useEffect, useState, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "../store/authStore";
import { useOrdersStore, OrderFilter } from "../store/ordersStore";
import OrderCard from "../components/staff/OrderCard";

function StaffPanelContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const [isChecking, setIsChecking] = useState(true);

  const selectedFilter = useOrdersStore((state) => state.selectedFilter);
  const setSelectedFilter = useOrdersStore((state) => state.setSelectedFilter);
  const orders = useOrdersStore((state) => state.orders);
  const setOrders = useOrdersStore((state) => state.setOrders);
  const markAsComplete = useOrdersStore((state) => state.markAsComplete);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [ordersError, setOrdersError] = useState<string | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  const getFilterFromParams = (): OrderFilter => {
    const status = searchParams.get("status");
    const area = searchParams.get("area");
    
    if (status === "active") return "pending";
    if (status === "completed") return "delivered";
    if (area === "bar") return "bar";
    if (area === "kitchen") return "kitchen";
    
    return "pending";
  };

  const updateUrlFromFilter = (filter: OrderFilter) => {
    const params = new URLSearchParams();
    
    if (filter === "pending") {
      params.set("status", "active");
    } else if (filter === "delivered") {
      params.set("status", "completed");
    } else if (filter === "bar" || filter === "kitchen") {
      params.set("area", filter);
    }
    
    router.replace(`/staff?${params.toString()}`);
  };

  const filteredOrders = useMemo(() => {
    const filter = selectedFilter;
    
    if (!orders || orders.length === 0) {
      return [];
    }
    
    if (filter === "pending" || filter === "delivered") {
      return orders
        .filter((order) => {
          // Verificar que el order tenga items
          if (!order.items || order.items.length === 0) return false;
          // Si los items no tienen status, usar el status del pedido como fallback
          const hasItemsWithStatus = order.items.some((item) => item?.status === filter);
          // Si ningún item tiene status, usar el status del pedido
          const hasNoItemStatus = !order.items.some((item) => item?.status);
          if (hasNoItemStatus && order.status === filter) {
            return true;
          }
          return hasItemsWithStatus;
        })
        .map((order) => {
          const filteredItems = order.items.filter((item) => {
            // Si el item tiene status, filtrar por status
            if (item?.status) {
              return item.status === filter;
            }
            // Si no tiene status, usar el status del pedido
            return order.status === filter;
          });
          return {
            ...order,
            items: filteredItems,
          };
        })
        .filter((order) => order.items.length > 0);
    }
    
    if (filter === "bar" || filter === "kitchen") {
      return orders
        .filter((order) => {
          if (!order.items || order.items.length === 0) return false;
          // Solo mostrar pedidos activos cuando se filtra por área
          if (order.status !== "pending") return false;
          return order.items.some(
            (item) => item?.area === filter && (item?.status === "pending" || !item?.status)
          );
        })
        .map((order) => ({
          ...order,
          items: order.items.filter(
            (item) => item?.area === filter && (item?.status === "pending" || !item?.status)
          ),
        }))
        .filter((order) => order.items.length > 0);
    }
    
    return orders;
  }, [orders, selectedFilter]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      checkAuth();
      setIsChecking(false);
    }
  }, [checkAuth]);

  // Sincronizar filtro desde query params al cargar
  useEffect(() => {
    if (!isChecking) {
      // Si no hay query params, establecer por defecto
      if (!searchParams.get("status") && !searchParams.get("area")) {
        router.replace("/staff?status=active");
        setSelectedFilter("pending");
      } else {
        // Leer filtro desde query params
        const filterFromParams = getFilterFromParams();
        setSelectedFilter(filterFromParams);
      }
    }
  }, [isChecking, searchParams, router, setSelectedFilter]);

  useEffect(() => {
    if (!isChecking && !isAuthenticated) {
      router.push("/staff/login");
    }
  }, [isAuthenticated, isChecking, router]);

  useEffect(() => {
    const fetchOrders = async () => {
      const baseUrl = process.env.NEXT_PUBLIC_LUMA_API;
      if (!baseUrl) {
        setOrdersError("Falta la variable NEXT_PUBLIC_LUMA_API");
        return;
      }
      setLoadingOrders(true);
      setOrdersError(null);
      try {
        const response = await fetch(`${baseUrl}/v1/orders/`);
        if (!response.ok) {
          throw new Error(`Error ${response.status}`);
        }
        const data = await response.json();
        setOrders(data.data);
      } catch (error) {
        setOrdersError(
          error instanceof Error ? error.message : "Error al cargar pedidos"
        );
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, [setOrders]);

  const handleLogout = () => {
    logout();
    router.push("/staff/login");
  };

  const handleBack = () => {
    router.push("/");
  };

  const filters: { label: string; value: OrderFilter }[] = [
    { label: "Activo", value: "pending" },
    { label: "Bar", value: "bar" },
    { label: "Cocina", value: "kitchen" },
    { label: "Completado", value: "delivered" },
  ];

  const handleMarkComplete = async (orderId: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_LUMA_API;
    if (!baseUrl) {
      setOrdersError("Falta la variable NEXT_PUBLIC_LUMA_API");
      return;
    }
    setUpdatingOrderId(orderId);
    try {
      const response = await fetch(`${baseUrl}/v1/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "delivered", area: selectedFilter }),
      });
      if (!response.ok) {
        throw new Error(`Error ${response.status}`);
      }
      markAsComplete(orderId, selectedFilter);
    } catch (error) {
      setOrdersError(
        error instanceof Error ? error.message : "Error al actualizar el pedido"
      );
    } finally {
      setUpdatingOrderId(null);
    }
  };

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
            {/* Título y botón refrescar */}
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
                onClick={() => window.location.reload()}
                className="px-2.5 py-1 text-xs font-medium text-green-700 bg-green-50 hover:bg-green-100 rounded-md transition-colors flex items-center gap-1"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                  <path d="M21 3v5h-5" />
                  <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                  <path d="M3 21v-5h5" />
                </svg>
                Refrescar
              </button>
            </div>

            {/* Filtros */}
            <div className="flex gap-2 overflow-x-auto hide-scrollbar">
              {filters.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => {
                    setSelectedFilter(filter.value);
                    updateUrlFromFilter(filter.value);
                  }}
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
          {loadingOrders ? (
            <div className="text-center py-12 text-gray-500">Cargando pedidos...</div>
          ) : ordersError ? (
            <div className="text-center py-12 text-red-500">Error: {ordersError}</div>
          ) : filteredOrders.length > 0 ? (
            <div className="flex flex-col gap-4">
              {filteredOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onMarkComplete={() => handleMarkComplete(order.id)}
                  hideCompleteButton={selectedFilter === "pending" || selectedFilter === "delivered"}
                  isUpdating={updatingOrderId === order.id}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>
                No hay pedidos{" "}
                {selectedFilter === "pending"
                  ? "activos"
                  : selectedFilter === "delivered"
                  ? "completados"
                  : selectedFilter === "bar"
                  ? "de bar"
                  : selectedFilter === "kitchen"
                  ? "de cocina"
                  : selectedFilter}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function StaffPanel() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-gray-600">Cargando...</div>
        </div>
      }
    >
      <StaffPanelContent />
    </Suspense>
  );
}

