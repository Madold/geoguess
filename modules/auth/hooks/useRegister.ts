"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { signup, signInWithGoogle } from "@/actions/auth";

// Esquema de validación con Zod
const registerSchema = z
  .object({
    username: z
      .string()
      .min(1, "El nombre de usuario es requerido")
      .min(3, "El nombre de usuario debe tener al menos 3 caracteres")
      .max(20, "El nombre de usuario no puede tener más de 20 caracteres")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "El nombre de usuario solo puede contener letras, números y guiones bajos"
      ),
    email: z
      .string()
      .min(1, "El correo electrónico es requerido")
      .email("Formato de correo electrónico inválido"),
    password: z
      .string()
      .min(1, "La contraseña es requerida")
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "La contraseña debe contener al menos una letra minúscula, una mayúscula y un número"
      ),
    confirmPassword: z.string().min(1, "Confirma tu contraseña"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export function useRegister() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const password = watch("password");

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError("");
    setSuccess(false);

    try {
      const result = await signup(data.email, data.password, data.username);

      if (result.success) {
        setSuccess(true);
        // Opcional: redirigir automáticamente después de un tiempo
        // setTimeout(() => router.push("/dashboard"), 2000);
      } else {
        setError(
          result.errorMessage || "Error al crear la cuenta. Inténtalo de nuevo."
        );
      }
    } catch (err) {
      console.error("Error creating user:", err);
      setError("Error al crear la cuenta. Inténtalo de nuevo.");
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

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return {
    // Estados
    showPassword,
    showConfirmPassword,
    isLoading,
    error,
    success,
    password,

    // Formulario
    register,
    handleSubmit,
    errors,
    onSubmit,

    // Acciones
    togglePasswordVisibility,
    toggleConfirmPasswordVisibility,
    handleGoogleLogin,
  };
}
