"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

const BASE_URL = "http://127.0.0.1:8000/auth";

export function useAuth() {
  const router = useRouter();

  const logout = useCallback(() => {
    localStorage.removeItem("access_token");
    router.push("/signin");
  }, [router]);

  const isAuthenticated = useCallback(() => {
    return !!localStorage.getItem("access_token");
  }, []);

  return { logout, isAuthenticated };
}

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const login = async (username: string, password: string) => {
    setLoading(true);
    setError(null);

    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);

    try {
      const res = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Login failed");
      }

      localStorage.setItem("access_token", data.access_token);
      router.push("/");
      return { success: true };
    } catch (err) {
      const msg = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
}

export function useSignup() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const signup = async (username: string, email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${BASE_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Signup failed");
      }

      // After signup, we automatically log them in or redirect to signin
      // For simplicity, let's redirect to signin
      router.push("/signin");
      return { success: true };
    } catch (err) {
      const msg = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  return { signup, loading, error };
}
