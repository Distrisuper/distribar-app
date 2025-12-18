"use client";
import React, { useEffect } from "react";
import Header from "@/components/Header";
import CategoryFilter from "@/components/CategoryFilter";
import ProductsList from "@/components/ProductsList";
import ResumeCart from "@/components/ResumeCart";
import { useUserStore } from "./store/userStore";
import { useSearchParams } from "next/navigation";

export default function Home() {
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
