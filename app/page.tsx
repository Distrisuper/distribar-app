import React, { Suspense } from "react";
import HomeContent from "./components/HomeContent";

export default function Home() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <HomeContent />
    </Suspense>
  );
}
