"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../store/authStore";

export default function StaffLogin() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Verificar si ya está autenticado al cargar (solo en cliente)
    if (typeof window !== "undefined") {
      checkAuth();
      if (isAuthenticated) {
        router.push("/staff");
      }
    }
  }, [checkAuth, isAuthenticated, router]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!password.trim()) {
      setError("Por favor, ingresá tu contraseña");
      return;
    }

    const success = login(password);
    if (success) {
      router.push("/staff");
    } else {
      setError("Contraseña incorrecta");
      setPassword("");
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Panel de Staff
          </h1>
          <p className="text-sm text-gray-600 mb-6">
            Ingresá tu contraseña para continuar
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                className={`w-full px-4 py-3 rounded-lg border ${
                  error
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                } focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors`}
                autoFocus
              />
              {error && (
                <p className="mt-2 text-sm text-red-600">{error}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-medium py-3 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Ingresar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

