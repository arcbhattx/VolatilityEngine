'use client'

import { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
  token: string | null
  loading: boolean
  login: (token: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {

  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem("access_token")

    if (stored) {
      setToken(stored)
    }

    setLoading(false)
  }, [])

  const login = (newToken: string) => {
    localStorage.setItem("access_token", newToken)
    setToken(newToken)
  }

  const logout = () => {
    localStorage.removeItem("access_token")
    setToken(null)
  }

  return (
    <AuthContext.Provider value={{ token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)

  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider")
  }

  return ctx
}