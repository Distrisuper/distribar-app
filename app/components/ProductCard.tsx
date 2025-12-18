import Image from "next/image";
import { useCartStore } from "../store/cartStore";
import { Product } from "@/types/products/product";

interface ProductCardProps {
  product: Product;
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
}

export default function ProductCard({
  product,
  id,
  name,
  description,
  price,
  image,
    }: ProductCardProps) {
  const addProductToCart = useCartStore((state) => state.addProduct);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden relative">
      <div className="flex">
        <div className="flex-1 p-4 flex flex-col justify-between min-h-[120px]">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">{name}</h3>
            <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
              {description}
            </p>
          </div>
          <p className="text-lg font-bold text-gray-900 mt-3">
            $ {price.toLocaleString("es-AR")}
          </p>
        </div>

        <div className="relative w-28 h-28 shrink-0">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover"
            sizes="112px"
          />
        </div>
      </div>

      <button
        className="absolute cursor-pointer bottom-2 right-2 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:scale-105 transition-transform z-10"
        aria-label={`Agregar ${name} al carrito`}
        onClick={() => addProductToCart(product)}
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
    </div>
  );
}

