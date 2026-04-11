"use client";

import { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
  token: string | null;
  loading: boolean;
  isGuest: boolean;
  login: (token: string) => void;
  logout: () => void;
  continueAsGuest: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("access_token");
    const guestFlag = localStorage.getItem("is_guest") === "true";

    if (stored) {
      setToken(stored);
    }
    
    if (guestFlag) {
      setIsGuest(true);
    }

    setLoading(false);
  }, []);

  const login = (newToken: string) => {
    localStorage.setItem("access_token", newToken);
    localStorage.removeItem("is_guest");
    setToken(newToken);
    setIsGuest(false);
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("is_guest");
    setToken(null);
    setIsGuest(false);
  };

  const continueAsGuest = () => {
    localStorage.removeItem("access_token");
    localStorage.setItem("is_guest", "true");
    setToken(null);
    setIsGuest(true);
  };

  return (
    <AuthContext.Provider value={{ token, loading, isGuest, login, logout, continueAsGuest }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return ctx;
}
