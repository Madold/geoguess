"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/actions/auth";

export function useLogout() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogout = async () => {
    setIsLoading(true);
    setError("");

    try {
      const result = await logout();

      if (result.success) {
        // Redirigir al inicio después del logout exitoso
        router.push("/");
        router.refresh(); // Refrescar para limpiar el estado
      } else {
        setError(result.errorMessage || "Error al cerrar sesión.");
      }
    } catch (err) {
      setError("Error al cerrar sesión.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    // Estados
    isLoading,
    error,

    // Acciones
    handleLogout,
  };
}
