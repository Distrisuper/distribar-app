"use client";

import { useCategoryStore } from "../store/categoryStore";

const categories = [
  "ALQUILER DE EVENTOS",
  "BEBIDAS ALCOHOLICAS",
  "BEBIDAS SIN ALCOHOL",
  "CAFETERIA",
  "COMIDA",
  "PASTELERIA",
  "POSTRES"
];

export default function CategoryFilter() {
  const selectedCategory = useCategoryStore((state) => state.selectedCategory);
  const setSelectedCategory = useCategoryStore((state) => state.setSelectedCategory);

  return (
    <div className="w-full bg-gray-100 py-3">
      <div className="max-w-[600px] mx-auto px-4">
        <div className="flex gap-2 overflow-x-auto hide-scrollbar">
          {categories.map((category) => {
            const isSelected = selectedCategory === category;
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`
                  px-4 py-2 rounded-full font-medium whitespace-nowrap transition-colors
                  ${
                    isSelected
                      ? "bg-[#1E3A8A] text-white"
                      : "bg-white text-gray-700"
                  }
                `}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

