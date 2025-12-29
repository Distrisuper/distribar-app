"use client";

import { useCartStore } from "../store/cartStore";

export default function Footer() {
  const items = useCartStore((state) => state.items);
  const hasItems = items.length > 0;

  return (
    <footer 
      className={`w-full py-6 px-4 ${hasItems ? "mb-20 relative z-60" : ""}`}
      style={{ backgroundColor: "#142A3B" }}
    >
      <div className="max-w-[600px] mx-auto">
        <div className="flex flex-col items-center gap-2 text-center">
          <p className="text-white text-sm font-medium">
            Copyright © 2026 Luma - Todos los derechos reservados
          </p>
          <p className="text-gray-300 text-xs">
            Powered by{" "}
            <a
              href="https://www.aokitech.com.ar/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-white hover:text-gray-200 transition-colors underline decoration-transparent hover:decoration-white"
            >
              Aoki
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

