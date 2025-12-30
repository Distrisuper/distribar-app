import { Order } from "@/types/orders/order";
import { formatPrice } from "@/utils/priceUtils";
import formatDate from "@/utils/dateUtils";
import { OrderFilter } from "../../store/ordersStore";

interface OrderCardProps {
  order: Order;
  onMarkComplete: () => void | Promise<void>;
  hideCompleteButton?: boolean;
  isUpdating?: boolean;
  isNew?: boolean;
  selectedFilter?: OrderFilter;
}

export default function OrderCard({ order, onMarkComplete, hideCompleteButton = false, isUpdating = false, isNew = false, selectedFilter }: OrderCardProps) {
  const isCompleted = order.items.length > 0 && order.items.every((item) => item.status === "delivered");
  const shouldHidePrices = selectedFilter === "delivered" || selectedFilter === "bar" || selectedFilter === "kitchen";

  return (
    <div
      className={`rounded-lg md:rounded-xl border md:border-2 p-4 md:p-6 relative transition-all duration-500 ${
        isNew
          ? "bg-yellow-50 border-yellow-400 shadow-lg ring-2 ring-yellow-300"
          : isCompleted
          ? "bg-gray-50 border-gray-200 opacity-75"
          : "bg-white border-gray-200"
      }`}
    >
      {/* Badge Completado o Botón Marcar completo o Habilitar */}
      {isCompleted ? (
        <div className="absolute top-4 right-4 md:top-6 md:right-6 bg-white border md:border-2 border-gray-300 rounded-lg px-3 py-1.5 md:px-5 md:py-3 flex items-center gap-1.5 md:gap-2">
          <svg
            width="16"
            height="16"
            className="md:w-6 md:h-6 text-gray-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>
          <span className="text-sm md:text-xl text-gray-400 font-medium">Completado</span>
        </div>
      ) : selectedFilter === "caja" ? (
        <button
          onClick={onMarkComplete}
          className="absolute top-4 right-4 md:top-6 md:right-6 text-sm md:text-lg font-medium px-4 py-2 md:px-6 md:py-3 rounded-lg transition-colors bg-green-600 text-white hover:bg-green-700"
        >
          Habilitar
        </button>
      ) : !hideCompleteButton ? (
        <button
          onClick={onMarkComplete}
          disabled={isUpdating}
          className={`absolute top-4 right-4 md:top-6 md:right-6 text-sm md:text-lg font-medium px-4 py-2 md:px-6 md:py-3 rounded-lg transition-colors flex items-center gap-2 md:gap-3 ${
            isUpdating
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {isUpdating ? (
            <>
              <svg
                className="animate-spin h-4 w-4 md:h-6 md:w-6 text-gray-500"
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
              <span>Completando...</span>
            </>
          ) : (
            <span>Completar</span>
          )}
        </button>
      ) : null}

      {/* Información del pedido */}
      <div >
        {order.created_at && (
          <div
            className={`text-sm md:text-xl mb-1 md:mb-2 ${
              isCompleted ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {formatDate(order.created_at)}
          </div>
        )}
        <div
          className={`text-sm md:text-xl mb-1 md:mb-2 ${
            isCompleted ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {order.time}
        </div>
        <div
          className={`text-lg md:text-2xl font-semibold mb-2 md:mb-3 ${
            isCompleted ? "text-gray-500" : "text-gray-900"
          }`}
        >
          Pedido #{order.id}
        </div>
        <div
          className={`inline-block text-sm md:text-xl font-medium px-3 py-1 md:px-5 md:py-2 rounded-full mb-3 md:mb-5 ${
            isCompleted
              ? "bg-gray-200 text-gray-500"
              : "bg-green-100 text-green-800"
          }`}
        >
          {order.location_type} {order.location_id}
        </div>

        {/* Items del pedido */}
        <div className="space-y-2 md:space-y-3">
          {order.items.map((item, index) => (
            <div
              key={index}
              className={`flex items-center text-base md:text-xl ${
                shouldHidePrices ? "justify-start" : "justify-between"
              }`}
            >
              <span
                className={isCompleted ? "text-gray-400" : "text-gray-700"}
              >
                <span className="text-lg md:text-2xl font-bold">{item.quantity}</span>{" "}
                {item.name}
              </span>
              {!shouldHidePrices && (
                <span
                  className={`font-medium text-base md:text-xl ${
                    isCompleted ? "text-gray-400" : "text-gray-900"
                  }`}
                >
                  $ {formatPrice(item.price)}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Observación */}
        {order.description && (
          <div className={`mt-4 md:mt-5 p-3 md:p-4 rounded-lg border-l-4 ${
            isCompleted 
              ? "bg-gray-100 border-gray-300" 
              : "bg-blue-50 border-blue-400"
          }`}>
            <div className="flex items-start gap-2 md:gap-3">
              <div className="flex-1">
                <p className={`text-sm md:text-base leading-relaxed ${
                  isCompleted ? "text-gray-400" : "text-gray-800"
                }`}>
                  {order.description}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

