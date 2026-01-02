"use client";
import Header from "./Header";
import CategoryFilter from "./CategoryFilter";
import ProductsList from "./ProductsList";
import ResumeCart from "./ResumeCart";
import QRValidator from "./QRValidator";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useUserStore } from "../store/userStore";
import { useProductStore } from "../store/productStore";
import { sseClient } from "@/services/sseClient";

export default function HomeContent() {
  const { setOrderContext } = useUserStore();
  const updateProductStock = useProductStore((state) => state.updateProductStock);
  const params = useSearchParams();

  useEffect(() => {
    const type = params.get("type") as "mesa" | "carpa";
    const id = params.get("id");
    if (type && id) {
      setOrderContext({ type, id });
    }
    // No borrar el contexto si no hay params, para preservar la información del usuario
  }, [params, setOrderContext]);

  useEffect(() => {
    sseClient.connect();
    
    const handleProductsUpdate = (articleCode: string, stock: number) => {
      updateProductStock(articleCode, stock);
    };

    sseClient.on("article-stock-updated", (data: any) => {
      handleProductsUpdate(data.articleCode, data.quantity)
    });

    return () => {
      sseClient.disconnect();
    };
    
  }, [updateProductStock]);

  return (
    <div className="mx-auto relative bg-white flex flex-col min-h-screen max-w-[600px] md:max-w-[1200px]">
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