"use client";
import Header from "./Header";
import CategoryFilter from "./CategoryFilter";
import ProductsList from "./ProductsList";
import ResumeCart from "./ResumeCart";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useUserStore } from "../store/userStore";

export default function HomeContent() {
  const { setOrderContext, clearOrderContext } = useUserStore();
  const params = useSearchParams();

  useEffect(() => {
    const type = params.get("type") as "mesa" | "carpa";
    const id = params.get("id");
    if (type && id) {
      setOrderContext({ type, id });
      alert(`Orden creada para ${type} ${id}`);
    } else {
      clearOrderContext();
    }
  }, [params]);
  return (
    <div className="max-w-[600px] mx-auto relative bg-white">
      <Header />
      <CategoryFilter />
      <ProductsList />
      <ResumeCart />
    </div>
  );
}