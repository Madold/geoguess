"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { login, signInWithGoogle } from "@/actions/auth";

// Esquema de validación con Zod
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "El correo electrónico es requerido")
    .email("Formato de correo electrónico inválido"),
  password: z
    .string()
    .min(1, "La contraseña es requerida")
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function useLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError("");

    try {
      const result = await login(data.email, data.password);

      if (result.success) {
        // Redirigir al dashboard después del login exitoso
        router.push("/dashboard");
      } else {
        setError(
          result.errorMessage ||
            "Error al iniciar sesión. Verifica tus credenciales."
        );
      }
    } catch (err) {
      setError("Error al iniciar sesión. Verifica tus credenciales.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError("");

    try {
      const result = await signInWithGoogle();

      if (!result.success) {
        setError(result.errorMessage || "Error al iniciar sesión con Google.");
      }
      // La redirección se maneja automáticamente por Supabase
    } catch (err) {
      setError("Error al iniciar sesión con Google.");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return {
    // Estados
    showPassword,
    isLoading,
    error,

    // Formulario
    register,
    handleSubmit,
    errors,
    onSubmit,

    // Acciones
    togglePasswordVisibility,
    handleGoogleLogin,
  };
}
