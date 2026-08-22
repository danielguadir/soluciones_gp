"use client";

import React, { useState, useEffect } from "react";
import AdminSidebar from "@/layout/AdminSidebar";
import { getApiUrl } from "@/lib/utils/constants";
import { Svg } from "@/components";

interface Inquiry {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

interface AdminUser {
  id: string;
  email: string;
  name: string | null;
}

interface AdminPanelContentProps {
  initialSection?: "dashboard" | "servicios" | "mensajes" | "config";
}

export default function AdminPanelContent({ initialSection = "dashboard" }: AdminPanelContentProps) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AdminUser | null>(null);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  // Auth Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  // Data Loading State
  const [loadingData, setLoadingData] = useState(false);
  const [dataError, setDataError] = useState<string | null>(null);

  // Check for token on mount
  useEffect(() => {
    const savedToken = localStorage.getItem("admin_token");
    const savedUser = localStorage.getItem("admin_user");
    if (savedToken && savedUser) {
      setToken(savedToken);
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        // Safe fallback if JSON parsing fails
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_user");
      }
    }
  }, []);

  const fetchInquiries = async (authToken?: string) => {
    const currentToken = authToken || token;
    if (!currentToken) return;

    setLoadingData(true);
    setDataError(null);
    try {
      const response = await fetch(getApiUrl('/api/inquiries'), {
        headers: {
          Authorization: `Bearer ${currentToken}`,
        },
      });

      const contentType = response.headers.get('content-type') || '';
      let data: Inquiry[] = [];
      if (contentType.includes('application/json')) {
        data = await response.json();
      } else {
        throw new Error('Respuesta del servidor no válida');
      }

      if (!response.ok) {
        if (response.status === 401) {
          handleLogout();
          throw new Error("Sesión expirada. Por favor inicia sesión de nuevo.");
        }
        throw new Error("Error al obtener los mensajes de contacto.");
      }

      setInquiries(data);
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : "Error al conectar con el servidor.";
      console.error("[FETCH INQUIRIES ERROR]", error);
      setDataError(errMsg);
    } finally {
      setLoadingData(false);
    }
  };

  // Fetch inquiries when token is available
  useEffect(() => {
    if (token) {
      fetchInquiries(token);
    }
  }, [token]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setAuthLoading(true);
    setAuthError(null);

    try {
      const response = await fetch(getApiUrl('/api/auth/login'), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const contentType = response.headers.get('content-type') || '';
      let payload: Record<string, unknown> = {};

      if (contentType.includes('application/json')) {
        payload = await response.json();
      } else {
        const text = await response.text();
        console.error('[LOGIN NON-JSON RESPONSE]', text);
        throw new Error(`Error de servidor (${response.status}). Intenta de nuevo.`);
      }

      if (!response.ok) {
        const errorMsg = typeof payload?.error === 'string' ? payload.error : 'Credenciales inválidas.';
        throw new Error(errorMsg);
      }

      const tokenStr = String(payload.token || '');
      const userData = payload.user as AdminUser;

      localStorage.setItem("admin_token", tokenStr);
      localStorage.setItem("admin_user", JSON.stringify(userData));
      setToken(tokenStr);
      setUser(userData);
      
      // Clear form
      setEmail("");
      setPassword("");
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : "Error al iniciar sesión.";
      console.error("[LOGIN ERROR]", error);
      setAuthError(errMsg);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    setToken(null);
    setUser(null);
    setInquiries([]);
    setSelectedInquiry(null);
  };

  const handleMarkAsRead = async (id: string) => {
    if (!token) return;

    try {
      const response = await fetch(getApiUrl(`/api/inquiries/${id}/read`), {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("No se pudo marcar como leído.");
      }

      // Update state locally
      setInquiries((prev) =>
        prev.map((inq) => (inq.id === id ? { ...inq, read: true } : inq))
      );

      if (selectedInquiry?.id === id) {
        setSelectedInquiry((prev) => (prev ? { ...prev, read: true } : null));
      }
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : "Error al actualizar mensaje";
      console.error("[MARK AS READ ERROR]", error);
      alert(errMsg);
    }
  };

  // If there's no active session, render the login card
  if (!token) {
    return (
      <div className="min-h-screen bg-[#0f172a] bg-grid-white flex items-center justify-center p-4">
        {/* Glow background effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="relative w-full max-w-md bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-2xl z-10">
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-4 border border-blue-500/20">
              <Svg icon="dashboard" fontSize="40px" color="#3b82f6" />
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Admin Portal</h1>
            <p className="text-slate-400 text-sm mt-2 text-center">
              Inicia sesión para gestionar los servicios e inquiries de ImpulsoGP
            </p>
          </div>

          {authError && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-200 text-sm rounded-xl flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0 animate-pulse"></span>
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Correo Electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-4 bg-slate-950/60 border border-white/5 focus:border-blue-500/50 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-white text-sm placeholder:text-slate-600"
                placeholder="admin@impulsogp.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-4 bg-slate-950/60 border border-white/5 focus:border-blue-500/50 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-white text-sm placeholder:text-slate-600"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:text-blue-300 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/35 transition-all cursor-pointer text-center text-sm"
            >
              {authLoading ? "Verificando..." : "Ingresar"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Calculate quick stats
  const totalInquiriesCount = inquiries.length;
  const unreadCount = inquiries.filter((i) => !i.read).length;

  return (
    <div className="flex bg-[#0f172a] min-h-screen text-slate-300 font-sans">
      <AdminSidebar onLogout={handleLogout} />

      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 pb-6 border-b border-white/5">
          <div>
            <h1 className="text-3xl lg:text-4xl font-black text-white tracking-tight">
              Dashboard
            </h1>
            <p className="text-slate-400 mt-1">
              Bienvenido de nuevo, {user?.name || user?.email || "Administrador"}.
            </p>
          </div>
          <div className="text-sm px-4 py-2 bg-slate-900 border border-white/5 rounded-full text-slate-400">
            Rol: <span className="text-blue-400 font-bold">ADMIN</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="p-6 rounded-3xl bg-slate-900/50 border border-white/5 hover:border-blue-500/20 transition-all duration-300">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                Mensajes Recibidos
              </span>
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Svg icon="mail" fontSize="20px" color="#3b82f6" />
              </div>
            </div>
            <div className="text-4xl font-extrabold text-white">
              {loadingData ? "..." : totalInquiriesCount}
            </div>
            <p className="text-xs text-slate-500 mt-2">Mensajes totales en base de datos</p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/50 border border-white/5 hover:border-amber-500/20 transition-all duration-300">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                Nuevos / Pendientes
              </span>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                </span>
              </div>
            </div>
            <div className="text-4xl font-extrabold text-white">
              {loadingData ? "..." : unreadCount}
            </div>
            <p className="text-xs text-slate-500 mt-2">Mensajes sin marcar como leído</p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/50 border border-white/5 hover:border-emerald-500/20 transition-all duration-300">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                Servicios Ofrecidos
              </span>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <Svg icon="briefcase" fontSize="20px" color="#10b981" />
              </div>
            </div>
            <div className="text-4xl font-extrabold text-white">3</div>
            <p className="text-xs text-slate-500 mt-2">Servicios pilares activos</p>
          </div>
        </div>

        {/* Inquiries Section */}
        <div className="bg-slate-900/30 backdrop-blur-sm rounded-3xl border border-white/5 overflow-hidden">
          <div className="p-6 lg:p-8 border-b border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-bold text-white">Mensajes de Contacto (Inquiries)</h2>
              <p className="text-sm text-slate-500 mt-1">
                Lista de personas y empresas interesadas en tus servicios.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => fetchInquiries()}
                disabled={loadingData}
                className="px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-xl text-blue-400 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                <span className={loadingData ? "animate-spin" : ""}>🔄</span>
                {loadingData ? "Cargando..." : "Actualizar Mensajes"}
              </button>
            </div>
          </div>

          {dataError && (
            <div className="p-6 text-center text-red-400 text-sm">
              <p>{dataError}</p>
            </div>
          )}

          {!loadingData && inquiries.length === 0 && !dataError ? (
            <div className="p-12 text-center text-slate-500">
              <p className="text-lg font-medium mb-1">No hay mensajes de contacto aún</p>
              <p className="text-sm">Cuando un usuario envíe el formulario de contacto, aparecerá aquí.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm text-slate-400">
                <thead className="bg-slate-950/40 text-slate-300 font-semibold uppercase text-xs border-b border-white/5">
                  <tr>
                    <th className="px-6 py-4">Estado</th>
                    <th className="px-6 py-4">Nombre</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Asunto</th>
                    <th className="px-6 py-4">Fecha</th>
                    <th className="px-6 py-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {inquiries.map((inq) => (
                    <tr
                      key={inq.id}
                      className={`hover:bg-slate-800/20 transition-colors ${
                        !inq.read ? "text-white font-medium bg-blue-500/5" : ""
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        {!inq.read ? (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            Nuevo
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-normal bg-slate-800 text-slate-500 border border-slate-700/30">
                            Leído
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{inq.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{inq.email}</td>
                      <td className="px-6 py-4 max-w-xs truncate">{inq.subject}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(inq.createdAt).toLocaleDateString("es-ES", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => setSelectedInquiry(inq)}
                          className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-white/5 rounded-lg text-xs font-bold hover:text-white transition-colors cursor-pointer"
                        >
                          Ver Mensaje
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Inquiry Detail Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/10 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-fade-in">
            {/* Modal Header */}
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-slate-950/20">
              <div>
                <span className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
                  Detalles del Mensaje
                </span>
                <h3 className="text-xl font-bold text-white mt-1">
                  {selectedInquiry.subject}
                </h3>
              </div>
              <button
                onClick={() => setSelectedInquiry(null)}
                className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-950/30 p-4 rounded-2xl border border-white/5">
                <div>
                  <span className="text-xs text-slate-500">De:</span>
                  <p className="text-sm font-bold text-white mt-0.5">{selectedInquiry.name}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-500">Email:</span>
                  <p className="text-sm font-bold text-blue-400 mt-0.5">
                    <a href={`mailto:${selectedInquiry.email}`} className="hover:underline">
                      {selectedInquiry.email}
                    </a>
                  </p>
                </div>
                <div>
                  <span className="text-xs text-slate-500">Enviado:</span>
                  <p className="text-sm text-slate-400 mt-0.5">
                    {new Date(selectedInquiry.createdAt).toLocaleString("es-ES", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-slate-500">Estado de Lectura:</span>
                  <p className="text-sm mt-0.5">
                    {selectedInquiry.read ? (
                      <span className="text-emerald-400 font-medium">✓ Leído</span>
                    ) : (
                      <span className="text-blue-400 font-semibold animate-pulse">● Pendiente</span>
                    )}
                  </p>
                </div>
              </div>

              <div>
                <span className="text-xs text-slate-500">Contenido del Mensaje:</span>
                <div className="mt-2 bg-slate-950/40 border border-white/5 rounded-2xl p-6 text-sm text-slate-200 leading-relaxed font-light whitespace-pre-wrap max-h-64 overflow-y-auto">
                  {selectedInquiry.message}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-white/5 flex flex-col sm:flex-row justify-between gap-3 bg-slate-950/20">
              <a
                href={`mailto:${selectedInquiry.email}?subject=Re: ${selectedInquiry.subject}`}
                className="py-3 px-5 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-bold transition-all text-sm text-center cursor-pointer shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20"
              >
                Responder por Email
              </a>
              <div className="flex gap-3">
                {!selectedInquiry.read && (
                  <button
                    onClick={() => handleMarkAsRead(selectedInquiry.id)}
                    className="py-3 px-5 bg-slate-800 hover:bg-slate-700 border border-white/5 rounded-xl text-slate-300 hover:text-white font-bold transition-all text-sm cursor-pointer"
                  >
                    Marcar como Leído
                  </button>
                )}
                <button
                  onClick={() => setSelectedInquiry(null)}
                  className="py-3 px-5 bg-transparent hover:bg-slate-800 border border-white/10 rounded-xl text-slate-400 hover:text-slate-200 transition-all text-sm cursor-pointer"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
