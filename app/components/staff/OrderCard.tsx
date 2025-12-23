import { Order } from "@/types/orders/order";

interface OrderCardProps {
  order: Order;
  onMarkComplete: () => void;
}

export default function OrderCard({ order, onMarkComplete }: OrderCardProps) {
  const isCompleted = order.status === "delivered";
  const showCompleteButton = !isCompleted;

  return (
    <div
      className={`rounded-lg border p-4 relative ${
        isCompleted
          ? "bg-gray-50 border-gray-200 opacity-75"
          : "bg-white border-gray-200"
      }`}
    >
      {/* Badge Completado o Botón Marcar completo */}
      {isCompleted ? (
        <div className="absolute top-4 right-4 bg-white border border-gray-300 rounded-lg px-3 py-1.5 flex items-center gap-1.5">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-400"
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>
          <span className="text-sm text-gray-400 font-medium">Completado</span>
        </div>
      ) : (
        <button
          onClick={onMarkComplete}
          className="absolute top-4 right-4 bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Marcar completo
        </button>
      )}

      {/* Información del pedido */}
      <div >
        <div
          className={`text-sm mb-1 ${
            isCompleted ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {order.time}
        </div>
        <div
          className={`text-base font-semibold mb-2 ${
            isCompleted ? "text-gray-500" : "text-gray-900"
          }`}
        >
          Pedido #{order.id}
        </div>
        <div
          className={`inline-block text-sm font-medium px-3 py-1 rounded-full mb-4 ${
            isCompleted
              ? "bg-gray-200 text-gray-500"
              : "bg-green-100 text-green-800"
          }`}
        >
          {order.location_type} {order.location_id}
        </div>

        {/* Items del pedido */}
        <div className="space-y-2">
          {order.items.map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-center text-sm"
            >
              <span
                className={isCompleted ? "text-gray-400" : "text-gray-700"}
              >
                <span className="font-semibold">{item.quantity}x</span>{" "}
                {item.name}
              </span>
              <span
                className={`font-medium ${
                  isCompleted ? "text-gray-400" : "text-gray-900"
                }`}
              >
                $ {item.price.toLocaleString("es-AR")}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

