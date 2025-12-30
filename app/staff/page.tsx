"use client";

import { useEffect, useState, useMemo, Suspense, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "../store/authStore";
import { useOrdersStore, OrderFilter } from "../store/ordersStore";
import OrderCard from "../components/staff/OrderCard";
import { Order } from "../types/orders/order";

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
  const [newOrderIds, setNewOrderIds] = useState<Set<string>>(new Set());
  const isRefetchingRef = useRef(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const getFilterFromParams = (): OrderFilter => {
    const status = searchParams.get("status");
    const area = searchParams.get("area");
    
    if (status === "active") return "pending";
    if (status === "completed") return "delivered";
    if (area === "caja") return "caja";
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
    } else if (filter === "caja" || filter === "bar" || filter === "kitchen") {
      params.set("area", filter);
    }
    
    router.replace(`/staff?${params.toString()}`);
  };

  const filteredOrders = useMemo(() => {
    const filter = selectedFilter;
    
    if (!orders || orders.length === 0) {
      return [];
    }
    
    // Filtro para "caja" - muestra todos los pedidos sin importar su estado
    if (filter === "caja") {
      return orders;
    }
    
    if (filter === "pending" || filter === "delivered") {
      const filtered = orders
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

      if (filter === "delivered") {
        return filtered.sort((a, b) => {
          const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
          const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
          
          if (dateA && dateB) {
            return dateB - dateA;
          }
          
          if (dateA && !dateB) return -1;
          if (!dateA && dateB) return 1;
          
          return parseInt(b.id) - parseInt(a.id);
        });
      }

      return filtered;
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

  // Función para obtener pedidos del API
  const fetchOrdersFromAPI = async (): Promise<Order[]> => {
    const baseUrl = process.env.NEXT_PUBLIC_LUMA_API;
    if (!baseUrl) {
      throw new Error("Falta la variable NEXT_PUBLIC_LUMA_API");
    }
    const response = await fetch(`${baseUrl}/v1/orders/`);
    if (!response.ok) {
      throw new Error(`Error ${response.status}`);
    }
    const data = await response.json();
    return data.data;
  };

  // Función para reproducir sonido de notificación
  const playNotificationSound = useCallback(() => {
    try {
      // Crear un contexto de audio si no existe
      if (typeof window !== "undefined" && typeof AudioContext !== "undefined") {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        // Configurar el sonido (beep agradable)
        oscillator.frequency.value = 800; // Frecuencia en Hz
        oscillator.type = "sine";

        const duration = 1.5; // Duración en segundos (1.5 segundos)

        // Configurar el volumen (fade in/out para sonido más suave)
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.05);
        gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + duration - 0.2);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

        // Reproducir el sonido
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration);
      }
    } catch (error) {
      // Si falla el audio, no hacer nada (no es crítico)
      console.error("Error al reproducir sonido:", error);
    }
  }, []);

  // Función para agregar solo pedidos nuevos basándose en el ID
  const fetchNewOrders = useCallback(async () => {
    if (isRefetchingRef.current) return; // Evitar múltiples refetches simultáneos
    
    isRefetchingRef.current = true;
    try {
      const newOrders = await fetchOrdersFromAPI();
      // Obtener el estado actual del store para evitar problemas con dependencias
      const currentOrders = useOrdersStore.getState().orders;
      const currentOrderIds = new Set(currentOrders.map((order) => order.id));
      
      // Filtrar solo los pedidos que no existen en la lista actual
      const ordersToAdd = newOrders.filter(
        (order) => !currentOrderIds.has(order.id)
      );
      
      // Si hay pedidos nuevos, agregarlos a la lista existente
      if (ordersToAdd.length > 0) {
        useOrdersStore.getState().setOrders([...currentOrders, ...ordersToAdd]);
        
        // Marcar pedidos como nuevos y reproducir sonido
        const newIds = ordersToAdd.map((order) => order.id);
        setNewOrderIds((prev) => {
          const updated = new Set(prev);
          newIds.forEach((id) => updated.add(id));
          return updated;
        });
        
        // Reproducir sonido de notificación
        playNotificationSound();
      }
    } catch (error) {
      // No mostrar error en el refetch automático para no interrumpir la experiencia
      console.error("Error al refetch de pedidos:", error);
    } finally {
      isRefetchingRef.current = false;
    }
  }, [playNotificationSound]);

  // Fetch inicial de pedidos
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
        const data = await fetchOrdersFromAPI();
        setOrders(data);
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

  // Refetch automático cada 30 segundos
  useEffect(() => {
    // Solo iniciar el refetch si el usuario está autenticado
    if (!isAuthenticated || isChecking) {
      return;
    }

    // Configurar el intervalo para refetch cada 30 segundos
    intervalRef.current = setInterval(() => {
      fetchNewOrders();
    }, 30000); // 30 segundos

    // Limpiar el intervalo cuando el componente se desmonte o cambien las dependencias
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isAuthenticated, isChecking, fetchNewOrders]);

  // Limpiar el resaltado de pedidos nuevos después de 5 segundos
  useEffect(() => {
    if (newOrderIds.size === 0) return;

    const timeoutIds: NodeJS.Timeout[] = [];
    newOrderIds.forEach((orderId) => {
      const timeoutId = setTimeout(() => {
        setNewOrderIds((prev) => {
          const updated = new Set(prev);
          updated.delete(orderId);
          return updated;
        });
      }, 5000); // 5 segundos
      timeoutIds.push(timeoutId);
    });

    return () => {
      timeoutIds.forEach((timeoutId) => clearTimeout(timeoutId));
    };
  }, [newOrderIds]);

  const handleLogout = () => {
    logout();
    router.push("/staff/login");
  };

  const handleBack = () => {
    router.push("/");
  };

  const filters: { label: string; value: OrderFilter }[] = [
    { label: "Caja", value: "caja" },
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
        <div className="text-gray-600 text-lg md:text-2xl">Cargando...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto bg-white min-h-screen">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="px-4 py-3 md:px-6 md:py-5">
            {/* Título */}
            <div className="flex items-center mb-4 md:mb-6">
              <div className="flex items-center gap-2 md:gap-3">
                <button
                  onClick={handleBack}
                  className="p-2 -ml-2 md:p-3 md:-ml-3 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Volver"
                >
                  <svg
                    width="24"
                    height="24"
                    className="md:w-8 md:h-8 text-gray-700"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                </button>
                <h1 className="text-lg md:text-3xl font-semibold text-gray-900">
                  Panel de Staff
                </h1>
              </div>
            </div>

            {/* Filtros */}
            <div className="flex gap-2 md:gap-3 overflow-x-auto hide-scrollbar">
              {filters.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => {
                    setSelectedFilter(filter.value);
                    updateUrlFromFilter(filter.value);
                  }}
                  className={`px-4 py-2 md:px-6 md:py-3 rounded-full text-sm md:text-xl font-medium whitespace-nowrap transition-colors ${
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
        <div className="px-4 py-4 md:px-6 md:py-6">
          {loadingOrders ? (
            <div className="text-center py-12 md:py-16 text-gray-500 text-lg md:text-2xl">Cargando pedidos...</div>
          ) : ordersError ? (
            <div className="text-center py-12 md:py-16 text-red-500 text-lg md:text-2xl">Error: {ordersError}</div>
          ) : filteredOrders.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              {filteredOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onMarkComplete={() => handleMarkComplete(order.id)}
                  hideCompleteButton={selectedFilter === "pending" || selectedFilter === "delivered" || selectedFilter === "caja"}
                  isUpdating={updatingOrderId === order.id}
                  isNew={newOrderIds.has(order.id)}
                  selectedFilter={selectedFilter}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 md:py-16 text-gray-500">
              <p className="text-lg md:text-2xl">
                No hay pedidos{" "}
                {selectedFilter === "pending"
                  ? "activos"
                  : selectedFilter === "delivered"
                  ? "completados"
                  : selectedFilter === "caja"
                  ? "en caja"
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
          <div className="text-gray-600 text-lg md:text-2xl">Cargando...</div>
        </div>
      }
    >
      <StaffPanelContent />
    </Suspense>
  );
}

