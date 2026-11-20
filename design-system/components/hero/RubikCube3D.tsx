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
    <div className="w-full h-full min-h-[340px] sm:min-h-[400px] flex items-center justify-center select-none pointer-events-none">
      <div className="relative w-12 h-12 flex items-center justify-center">
        {/* Outer orbital cyan spinner */}
        <div className="w-12 h-12 rounded-full border-2 border-cyan-400/20 border-t-cyan-400 animate-spin" />
        {/* Inner reverse blue ring */}
        <div
          className="absolute w-6 h-6 rounded-full border-2 border-blue-500/20 border-b-blue-400 animate-spin"
          style={{ animationDirection: "reverse", animationDuration: "0.85s" }}
        />
      </div>
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
