"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getApiUrl, DEFAULT_AVATAR_URL } from "@/lib/utils/constants";

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role?: string;
  provider?: "credentials" | "google";
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  showAuthModal: boolean;
  authModalMode: "login" | "register";
  openAuthModal: (mode?: "login" | "register") => void;
  closeAuthModal: () => void;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  googleLogin: (googleData?: { name?: string; email?: string; picture?: string; id?: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<"login" | "register">("login");

  // Load session from localStorage on mount
  useEffect(() => {
    try {
      const savedToken = localStorage.getItem("user_token") || localStorage.getItem("admin_token");
      const savedUser = localStorage.getItem("user_data") || localStorage.getItem("admin_user");

      if (savedToken && savedUser) {
        setToken(savedToken);
        const parsedUser = JSON.parse(savedUser);
        setUser({
          ...parsedUser,
          avatarUrl: parsedUser.avatarUrl || DEFAULT_AVATAR_URL,
        });
      }
    } catch (err) {
      console.error("[AUTH CONTEXT INIT ERROR]", err);
      localStorage.removeItem("user_token");
      localStorage.removeItem("user_data");
    } finally {
      setLoading(false);
    }
  }, []);

  const openAuthModal = (mode: "login" | "register" = "login") => {
    setAuthModalMode(mode);
    setShowAuthModal(true);
  };

  const closeAuthModal = () => {
    setShowAuthModal(false);
  };

  const saveSession = (authToken: string, userData: User) => {
    const formattedUser: User = {
      ...userData,
      avatarUrl: userData.avatarUrl || DEFAULT_AVATAR_URL,
    };
    localStorage.setItem("user_token", authToken);
    localStorage.setItem("user_data", JSON.stringify(formattedUser));
    setToken(authToken);
    setUser(formattedUser);
  };

  const login = async (email: string, password: string) => {
    const res = await fetch(getApiUrl("/api/auth/login"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Error al iniciar sesión.");
    }

    saveSession(data.token, data.user);
    closeAuthModal();
  };

  const register = async (name: string, email: string, password: string) => {
    const res = await fetch(getApiUrl("/api/auth/register"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Error al registrar la cuenta.");
    }

    saveSession(data.token, data.user);
    closeAuthModal();
  };

  const googleLogin = async (googleData?: { name?: string; email?: string; picture?: string; id?: string }) => {
    const res = await fetch(getApiUrl("/api/auth/google"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(googleData || {}),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Error al autenticar con Google.");
    }

    saveSession(data.token, data.user);
    closeAuthModal();
  };

  const logout = () => {
    localStorage.removeItem("user_token");
    localStorage.removeItem("user_data");
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        loading,
        showAuthModal,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        login,
        register,
        googleLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};
