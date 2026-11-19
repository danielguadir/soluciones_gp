"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { RubikController } from "@/lib/rubik/controller";
import { FaceId } from "@/lib/rubik/types";

export interface RubikCube3DProps {
  controller: RubikController;
  onHoverFace?: (face: FaceId | null) => void;
  hoveredFace?: FaceId | null;
  counterClockwise?: boolean;
  className?: string;
}

const DynamicRubikCube3DCanvas = dynamic(
  () => import("./RubikCube3DCanvas").then((mod) => mod.RubikCube3DCanvas),
  {
    ssr: false,
    loading: () => <Rubik3DLoadingFallback />,
  }
);

function Rubik3DLoadingFallback() {
  return (
    <div className="w-full h-full min-h-[340px] sm:min-h-[400px] flex flex-col items-center justify-center p-6 text-center rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-sm">
      <div className="relative w-16 h-16 mb-4">
        <div className="absolute inset-0 rounded-2xl border-2 border-blue-500/30 animate-ping" />
        <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
          <span className="text-2xl">🧊</span>
        </div>
      </div>
      <p className="text-sm font-semibold text-slate-200">
        Iniciando motor Three.js WebGL...
      </p>
      <p className="text-xs text-slate-400 mt-1 max-w-xs">
        Cargando espacio tridimensional y geometría $SO(3)$.
      </p>
    </div>
  );
}

function WebGLUnsupportedFallback() {
  return (
    <div className="w-full h-full min-h-[340px] flex flex-col items-center justify-center p-6 text-center rounded-3xl bg-slate-900/60 border border-amber-500/30">
      <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-xl mb-3">
        ⚠️
      </div>
      <p className="text-sm font-bold text-slate-200">
        Aceleración WebGL no disponible
      </p>
      <p className="text-xs text-slate-400 mt-1 max-w-xs">
        Tu navegador o dispositivo no tiene WebGL habilitado. La visualización
        circular 2D continuará sincronizada plenamente.
      </p>
    </div>
  );
}

export function RubikCube3D(props: RubikCube3DProps) {
  const [mounted, setMounted] = useState(false);
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    setMounted(true);
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl2") ||
        canvas.getContext("webgl") ||
        canvas.getContext("experimental-webgl");
      setHasWebGL(Boolean(gl));
    } catch {
      setHasWebGL(false);
    }
  }, []);

  if (!mounted) {
    return <Rubik3DLoadingFallback />;
  }

  if (!hasWebGL) {
    return <WebGLUnsupportedFallback />;
  }

  return <DynamicRubikCube3DCanvas {...props} />;
}

export default RubikCube3D;
