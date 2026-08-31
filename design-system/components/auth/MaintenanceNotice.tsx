"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Svg } from "@/components";

export const MaintenanceNotice: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [dismissed, setDismissed] = useState(false);
  const [minimized, setMinimized] = useState(false);

  if (!isAuthenticated || !user || dismissed) return null;

  if (minimized) {
    return (
      <div className="fixed bottom-6 right-6 z-40 animate-bounce">
        <button
          onClick={() => setMinimized(false)}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-full shadow-xl flex items-center gap-2 transition-all cursor-pointer border border-amber-300/40"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-900 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-950"></span>
          </span>
          <span>Aviso de Mantenimiento</span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 max-w-md w-[calc(100%-3rem)] bg-slate-900/95 border border-amber-500/30 rounded-3xl p-6 shadow-2xl backdrop-blur-md z-40 animate-fade-up">
      {/* Background Amber Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-[50px] pointer-events-none"></div>

      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
            <Svg icon="cog" fontSize="20px" color="#f59e0b" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white leading-tight">
              Sitio en Mantenimiento
            </h4>
            <p className="text-[11px] text-amber-400 font-semibold">
              Hola, {user.name || user.email}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setMinimized(true)}
            className="w-7 h-7 rounded-full hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-all text-xs cursor-pointer"
            title="Minimizar"
          >
            _
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="w-7 h-7 rounded-full hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-all text-xs cursor-pointer"
            title="Cerrar"
          >
            ✕
          </button>
        </div>
      </div>

      <p className="mt-3 text-xs text-slate-300 leading-relaxed font-normal">
        El sitio al que visitaste se encuentra actualmente en{" "}
        <span className="text-amber-400 font-semibold">mantenimiento planificado y actualización de servidores</span>.
        Estamos optimizando los servicios para ofrecerte la mejor calidad.
      </p>

      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
          Estado: Actualizando
        </span>
        <button
          onClick={() => setDismissed(true)}
          className="text-amber-400 hover:underline font-bold cursor-pointer"
        >
          Entendido
        </button>
      </div>
    </div>
  );
};
