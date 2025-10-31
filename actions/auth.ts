"use client";
import { createClient } from "@/lib/supabase/client";
import { Result } from "@/modules/shared/types/result.type";

export async function login(
  email: string,
  password: string
): Promise<Result<void>> {
  const supabase = createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      success: false,
      errorMessage: error.message,
    };
  }

  return {
    success: true,
  };
}

export async function signup(
  email: string,
  password: string,
  username: string
): Promise<Result<void>> {
  const supabase = createClient();

  const userData: any = {
    username,
  };

  const { error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData,
    },
  });

  if (authError) {
    return {
      success: false,
      errorMessage: authError.message,
    };
  }

  return {
    success: true,
  };
}

export async function signInWithGoogle(): Promise<Result<void>> {
  const supabase = createClient();

  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/api/auth/google/callback`,
    },
  });

  if (error) {
    return {
      success: false,
      errorMessage: error.message,
    };
  }

  return {
    success: true,
  };
}

export async function logout(): Promise<Result<void>> {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Error signing out:", error);
    return {
      success: false,
      errorMessage: error.message,
    };
  }

  return {
    success: true,
  };
}
