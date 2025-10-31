"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { signup, signInWithGoogle } from "@/actions/auth";

// Validation schema with Zod (Esquema de validación con Zod)
const registerSchema = z
  .object({
    username: z
      .string()
      .min(1, "Username is required") // El nombre de usuario es requerido
      .min(3, "Username must be at least 3 characters long") // El nombre de usuario debe tener al menos 3 caracteres
      .max(20, "Username cannot exceed 20 characters") // El nombre de usuario no puede tener más de 20 caracteres
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores" // El nombre de usuario solo puede contener letras, números y guiones bajos
      ),
    email: z
      .string()
      .min(1, "Email address is required") // El correo electrónico es requerido
      .email("Invalid email format"), // Formato de correo electrónico inválido
    password: z
      .string()
      .min(1, "Password is required") // La contraseña es requerida
      .min(8, "Password must be at least 8 characters long") // La contraseña debe tener al menos 8 caracteres
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one lowercase letter, one uppercase letter, and one number" // La contraseña debe contener al menos una letra minúscula, una mayúscula y un número
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"), // Confirma tu contraseña
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match", // Las contraseñas no coinciden
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
        // Optional: automatically redirect after a short time (Opcional: redirigir automáticamente después de un tiempo)
        // setTimeout(() => router.push("/dashboard"), 2000);
      } else {
        setError(
          result.errorMessage || "Error creating account. Please try again." // Error al crear la cuenta. Inténtalo de nuevo.
        );
      }
    } catch (err) {
      console.error("Error creating user:", err);
      setError("Error creating account. Please try again."); // Error al crear la cuenta. Inténtalo de nuevo.
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

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return {
    // States (Estados)
    showPassword,
    showConfirmPassword,
    isLoading,
    error,
    success,
    password,

    // Form (Formulario)
    register,
    handleSubmit,
    errors,
    onSubmit,

    // Actions (Acciones)
    togglePasswordVisibility,
    toggleConfirmPasswordVisibility,
    handleGoogleLogin,
  };
}
