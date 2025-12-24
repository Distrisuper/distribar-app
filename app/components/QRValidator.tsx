"use client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Swal from "sweetalert2";

export default function QRValidator() {
  const params = useSearchParams();

  useEffect(() => {
    const type = params.get("type");
    const id = params.get("id");

    if (!type || !id) {
      Swal.fire({
        icon: "warning",
        title: "QR requerido",
        text: "Para usar la página debe ingresar con un QR",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#1E3A8A",
        allowOutsideClick: false,
        allowEscapeKey: false,
      });
    }
  }, [params]);

  return null;
}

