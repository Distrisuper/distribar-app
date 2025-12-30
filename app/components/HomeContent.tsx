"use client";
import Header from "./Header";
import CategoryFilter from "./CategoryFilter";
import ProductsList from "./ProductsList";
import ResumeCart from "./ResumeCart";
import QRValidator from "./QRValidator";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useUserStore } from "../store/userStore";

export default function HomeContent() {
  const { setOrderContext } = useUserStore();
  const params = useSearchParams();

  useEffect(() => {
    const type = params.get("type") as "mesa" | "carpa";
    const id = params.get("id");
    if (type && id) {
      setOrderContext({ type, id });
    }
    // No borrar el contexto si no hay params, para preservar la información del usuario
  }, [params, setOrderContext]);
  return (
    <div className="max-w-[600px] mx-auto relative bg-white flex flex-col min-h-screen">
      <QRValidator />
      <Header />
      <CategoryFilter />
      <div className="grow">
        <ProductsList />
      </div>
      <ResumeCart />
    </div>
  );
}