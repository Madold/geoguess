"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { login, signInWithGoogle } from "@/actions/auth";

// Validation schema with Zod (Esquema de validación con Zod)
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email address is required") // El correo electrónico es requerido
    .email("Invalid email format"), // Formato de correo electrónico inválido
  password: z
    .string()
    .min(1, "Password is required") // La contraseña es requerida
    .min(6, "Password must be at least 6 characters long"), // La contraseña debe tener al menos 6 caracteres
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
        // Redirect to the dashboard after successful login (Redirigir al dashboard después del login exitoso)
        router.push("/dashboard");
      } else {
        setError(
          result.errorMessage || "Login failed. Please check your credentials." // Error al iniciar sesión. Verifica tus credenciales.
        );
      }
    } catch (err) {
      setError("Login failed. Please check your credentials."); // Error al iniciar sesión. Verifica tus credenciales.
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
        setError(result.errorMessage || "Error signing in with Google."); // Error al iniciar sesión con Google.
      }
      // Redirection is handled automatically by Supabase (La redirección se maneja automáticamente por Supabase)
    } catch (err) {
      setError("Error signing in with Google."); // Error al iniciar sesión con Google.
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return {
    // States (Estados)
    showPassword,
    isLoading,
    error,

    // Form (Formulario)
    register,
    handleSubmit,
    errors,
    onSubmit,

    // Actions (Acciones)
    togglePasswordVisibility,
    handleGoogleLogin,
  };
}
