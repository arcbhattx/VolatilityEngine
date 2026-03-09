import { useState } from "react";
import { loginUser, createUser, getUserInfo } from "../api-hooks/authentication";

export function useAuth() {
  const [loading, setLoading] = useState(false);

  async function login(username: string, password: string) {
    setLoading(true);
    try {
      const data = await loginUser(username, password);

      localStorage.setItem("access_token", data.access_token);

      return { success: true };
    } catch (error: any) {
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  }

  async function register(username: string, password: string) {
    setLoading(true);
    try {
      await createUser(username, password);
      return { success: true };
    } catch (error: any) {
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  }

  async function getCurrentUser() {
    const token = localStorage.getItem("access_token");
    if (!token) return null;

    try {
      return await getUserInfo(token);
    } catch {
      return null;
    }
  }

  function logout() {
    localStorage.removeItem("access_token");
  }

  return {
    login,
    register,
    logout,
    getCurrentUser,
    loading,
  };
}