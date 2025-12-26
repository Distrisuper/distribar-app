"use client";
import { useCategoryStore } from "../store/categoryStore";
import { useUserStore } from "../store/userStore";
import Link from "next/link";
import Image from "next/image";

export default function Header() {

  const searchQuery = useCategoryStore((state) => state.searchQuery);
  const setSearchQuery = useCategoryStore((state) => state.setSearchQuery);
  const orderContext = useUserStore((state) => state.orderContext);

  return (
    <header className="w-full " style={{ backgroundColor: "#142A3B" }}>
      <div className="flex flex-col px-4 pt-4 pb-3 max-w-[600px] mx-auto">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Image
              src="/images/Logo_luma_arena.png"
              alt="LUMA"
              width={100}
              height={40}
              className="h-8 w-auto"
              priority
            />
            {orderContext && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/20 rounded-full">
                <span className="text-white text-xs font-medium capitalize">
                  {orderContext.type} {orderContext.id}
                </span>
              </div>
            )}
          </div>
          <Link href="/cart">
            <button 
              className="text-white p-2 -mr-2"
              aria-label="Shopping cart"
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
              >
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            </button>
          </Link>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Busca platos, bebidas..."
            className="w-full px-4 py-3 pr-12 bg-gray-100 rounded-full text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#6B7280"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </div>
        </div>
      </div>
    </header>
  );
}

