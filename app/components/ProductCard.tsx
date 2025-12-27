import Image from "next/image";
import { Product } from "@/types/products/product";
import AddToCartButton from "./AddToCartButton";

interface ProductCardProps {
  product: Product;
  name: string;
  description: string;
  price: string;
  image: string;
}

export default function ProductCard({
  product,
  name,
  description,
  price,
  image = '/images/luma.jpg',
    }: ProductCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden relative">
      <div className="flex items-center">
        <div className="flex-1 p-4 flex flex-col justify-between min-h-[120px]">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">{name}</h3>
            <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
              {description}
            </p>
          </div>
          <p className="text-lg font-bold text-gray-900 mt-3">
            $ {Number(price).toLocaleString("es-AR")}
          </p>
        </div>

        <div className="relative w-28 h-28 shrink-0">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover"
            sizes="112px"
            unoptimized={image.startsWith('/images/')}
          />
        </div>
      </div>

      <AddToCartButton product={product} />
    </div>
  );
}

