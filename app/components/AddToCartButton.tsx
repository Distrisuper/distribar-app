"use client";
import { useCartStore } from "../store/cartStore";
import { Product } from "@/types/products/product";

interface AddToCartButtonProps {
  product: Product;
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const items = useCartStore((state) => state.items);
  const addProduct = useCartStore((state) => state.addProduct);
  const increaseQuantity = useCartStore((state) => state.increaseQuantity);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);

  const cartItem = items.find((item) => item.product.COD_ARTICU === product.COD_ARTICU);
  const quantity = cartItem?.quantity || 0;

  const handleAddClick = () => {
    addProduct(product);
  };

  const handleIncrease = () => {
    increaseQuantity(product.COD_ARTICU);
  };

  const handleDecrease = () => {
    decreaseQuantity(product.COD_ARTICU);
  };

  if (quantity > 0) {
    return (
      <div className="absolute bottom-2 right-2 z-10 flex items-center gap-1 bg-white rounded-full shadow-lg px-1.5 py-1 animate-fade-in-scale">
        <button
          onClick={handleDecrease}
          className="cursor-pointer w-6 h-6 rounded-full flex items-center justify-center hover:bg-gray-100 active:scale-95 transition-all duration-150"
          aria-label="Decrease quantity"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-700"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>

        <span className="text-xs font-semibold text-gray-900 min-w-[18px] text-center tabular-nums">
          {quantity}
        </span>

        <button
          onClick={handleIncrease}
          className="cursor-pointer w-6 h-6 rounded-full flex items-center justify-center hover:bg-gray-100 active:scale-95 transition-all duration-150"
          aria-label="Increase quantity"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-700"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <button
      className="absolute cursor-pointer bottom-2 right-2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:scale-105 transition-transform z-10"
      aria-label={`Agregar ${product.name} al carrito`}
      onClick={handleAddClick}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-gray-900"
      >
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    </button>
  );
}

