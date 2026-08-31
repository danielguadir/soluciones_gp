"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Svg } from "@/components";

export const AuthModal: React.FC = () => {
  const { showAuthModal, authModalMode, closeAuthModal, login, register, googleLogin } = useAuth();
  const [tab, setTab] = useState<"login" | "register">(authModalMode || "login");

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Synchronize tab with prop state
  React.useEffect(() => {
    setTab(authModalMode);
  }, [authModalMode]);

  if (!showAuthModal) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (tab === "register") {
        if (!name.trim()) throw new Error("Ingresa tu nombre completo.");
        await register(name, email, password);
      } else {
        await login(email, password);
      }
      // Reset form
      setName("");
      setEmail("");
      setPassword("");
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Error al procesar la solicitud.";
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setGoogleLoading(true);

    try {
      // Simulate/trigger seamless Google account sign in
      await googleLogin({
        name: "Usuario Google",
        email: email ? email : "usuario.google@gmail.com",
      });
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Error al iniciar sesión con Google.";
      setError(errMsg);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden z-10">
        {/* Glow background accents */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-blue-500/20 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-indigo-500/20 rounded-full blur-[80px] pointer-events-none"></div>

        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-6 right-6 w-9 h-9 rounded-full bg-slate-800/80 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-all cursor-pointer z-20"
          aria-label="Cerrar"
        >
          ✕
        </button>

        {/* Modal Title & Subtitle */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-blue-500/20 shadow-lg shadow-blue-500/10">
            <Svg icon="user" fontSize="28px" color="#3b82f6" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            {tab === "login" ? "¡Bienvenido de Nuevo!" : "Crear una Cuenta"}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {tab === "login"
              ? "Ingresa tus credenciales para acceder a la plataforma"
              : "Regístrate gratis para explorar todas las herramientas"}
          </p>
        </div>

        {/* Tab Selector */}
        <div className="grid grid-cols-2 p-1 bg-slate-950/60 rounded-xl border border-white/5 mb-6 text-sm font-semibold">
          <button
            onClick={() => {
              setTab("login");
              setError(null);
            }}
            className={`py-2.5 rounded-lg transition-all text-center cursor-pointer ${
              tab === "login"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Iniciar Sesión
          </button>
          <button
            onClick={() => {
              setTab("register");
              setError(null);
            }}
            className={`py-2.5 rounded-lg transition-all text-center cursor-pointer ${
              tab === "register"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Registrarse
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-5 p-3.5 bg-red-500/10 border border-red-500/20 text-red-200 text-xs rounded-xl flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0 animate-pulse"></span>
            <span>{error}</span>
          </div>
        )}

        {/* Google Sign-In Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={googleLoading || loading}
          className="w-full mb-5 py-3 px-4 bg-slate-800 hover:bg-slate-700/80 border border-white/10 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-3 transition-all shadow-md cursor-pointer disabled:opacity-50"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.27v3.15C3.25 21.3 7.31 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.27C.46 8.2.01 10.04.01 12s.45 3.8 1.26 5.42l4.01-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.7 1.27 6.58l4.01 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
          <span>
            {googleLoading ? "Conectando con Google..." : "Continuar con Google"}
          </span>
        </button>

        <div className="relative flex items-center justify-center my-4">
          <div className="w-full h-[1px] bg-white/10"></div>
          <span className="absolute px-3 bg-slate-900 text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
            o con tu correo
          </span>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {tab === "register" && (
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Nombre Completo
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={tab === "register"}
                className="w-full p-3.5 bg-slate-950/60 border border-white/10 focus:border-blue-500/50 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-white text-xs placeholder:text-slate-600"
                placeholder="Juan Pérez"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Correo Electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3.5 bg-slate-950/60 border border-white/10 focus:border-blue-500/50 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-white text-xs placeholder:text-slate-600"
              placeholder="tu@email.com"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3.5 bg-slate-950/60 border border-white/10 focus:border-blue-500/50 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-white text-xs placeholder:text-slate-600"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/35 transition-all cursor-pointer text-center text-xs"
          >
            {loading
              ? "Procesando..."
              : tab === "login"
              ? "Iniciar Sesión"
              : "Crear Cuenta"}
          </button>
        </form>
      </div>
    </div>
  );
};
