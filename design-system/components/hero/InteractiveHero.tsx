"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { RubikController } from "@/lib/rubik/controller";
import { useRubikSync } from "@/lib/rubik/useRubikSync";
import { RubikCircularSvg } from "@/components/hero/RubikCircularSvg";
import { RubikCube3D } from "@/components/hero/RubikCube3D";
import { FACES } from "@/lib/rubik/engine";
import { FACE_PALETTE } from "@/lib/rubik/palette";
import { BaseMove, FaceId } from "@/lib/rubik/types";

export function InteractiveHero() {
  // Single shared mathematical controller driving both 2D and 3D representations
  const controller = useMemo(() => new RubikController(), []);
  const visualizerSectionRef = useRef<HTMLDivElement | null>(null);

  // Synchronized state hook (useSyncExternalStore)
  const { history, isSolved, isBusy, transition } = useRubikSync(controller);

  // Interactive UI controls
  const [hoveredFace, setHoveredFace] = useState<FaceId | null>(null);
  const [counterClockwise, setCounterClockwise] = useState(false);
  const [hasPlayedIntro, setHasPlayedIntro] = useState(false);

  // Lifecycle & reduced-motion detection
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (window.matchMedia) {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      controller.setReducedMotion(mq.matches);
      const handler = (e: MediaQueryListEvent) => controller.setReducedMotion(e.matches);
      mq.addEventListener("change", handler);
      return () => {
        mq.removeEventListener("change", handler);
        controller.dispose();
      };
    }

    return () => {
      controller.dispose();
    };
  }, [controller]);

  // Subtle intro sequence demonstrating live synchronization on page load
  useEffect(() => {
    if (hasPlayedIntro) return;
    setHasPlayedIntro(true);

    const timer = setTimeout(() => {
      controller.enqueueMoves(["R", "U", "U'", "R'"], {
        durationMs: 440,
        recordInHistory: false,
      });
    }, 900);

    return () => clearTimeout(timer);
  }, [controller, hasPlayedIntro]);

  const handleExploreExperience = () => {
    if (visualizerSectionRef.current) {
      visualizerSectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
    controller.triggerDemoSequence();
  };

  const handleFaceTurn = (face: BaseMove) => {
    controller.turn(face, counterClockwise);
  };

  return (
    <section className="relative min-h-[90vh] lg:min-h-[94vh] flex flex-col justify-between overflow-x-hidden bg-[#0f172a] bg-grid-white pt-8 pb-12 lg:py-14 select-none">
      {/* Background Chromatic Ambient Glows */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[8%] left-[4%] w-80 h-80 bg-blue-600/20 rounded-full blur-[130px] animate-blob" />
        <div className="absolute bottom-[10%] right-[4%] w-96 h-96 bg-indigo-600/20 rounded-full blur-[140px] animate-blob animation-delay-2000" />
        <div className="absolute top-[35%] right-[20%] w-64 h-64 bg-cyan-600/10 rounded-full blur-[110px] animate-blob animation-delay-4000" />
      </div>

      {/* Original Luminous Infinity Wave Background Layer (Positioned at bottom spanning full width) */}
      <div className="absolute bottom-0 left-0 w-full h-[320px] sm:h-[400px] lg:h-[490px] pointer-events-none z-0 overflow-hidden flex items-end justify-center select-none">
        <div className="relative w-full max-w-[1750px] h-full">
          <Image
            src="/images/hero/inicio1_pw.png"
            alt="ImpulsoGP Infinity Energy Wave"
            fill
            priority
            sizes="100vw"
            className="object-contain object-bottom filter drop-shadow-[0_0_35px_rgba(56,189,248,0.2)] opacity-95 pointer-events-none"
          />
        </div>
      </div>

      {/* Main 3-Column Content Container (Left: Identity, Center: 3D Cube, Right: 2D SVG) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 relative my-auto">
        <div
          ref={visualizerSectionRef}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center"
        >
          {/* 1. LEFT COLUMN: Enterprise Identity & CTAs */}
          <div className="lg:col-span-4 flex flex-col gap-6 lg:gap-8 relative z-20">
            {/* Accent Cyan Vertical Bar + Statement */}
            <div className="border-l-4 border-cyan-400 pl-4 py-1">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight">
                Desarrollo y{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 text-glow">
                  soluciones digitales...
                </span>
              </h1>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              <button
                type="button"
                onClick={handleExploreExperience}
                className="px-6 py-3.5 rounded-full font-bold text-sm text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <span>Explorar experiencia</span>
                <span aria-hidden="true">→</span>
              </button>

              <Link
                href="/servicios"
                className="px-6 py-3.5 rounded-full font-bold text-sm text-slate-200 hover:text-white bg-slate-900/60 hover:bg-slate-800/80 border border-white/20 hover:border-cyan-400/50 transition-all duration-300 flex items-center gap-2 active:scale-95"
              >
                Nuestros servicios
              </Link>
            </div>
          </div>

          {/* 2. CENTER COLUMN: 3D Rubik's Cube WebGL */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center relative z-20">
            {/* 3D WebGL Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-blue-500/30 text-xs font-bold text-slate-200 shadow-sm backdrop-blur-md mb-2">
              <span className="text-blue-400">🧊</span>
              <span>3D WebGL</span>
            </div>

            {/* 3D Cube Viewport with Orbital Glowing Ring */}
            <div className="relative w-full aspect-square max-w-[360px] sm:max-w-[400px] flex items-center justify-center">
              {/* Glowing Ambient Orbital Ring around the 3D Cube */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <svg
                  viewBox="0 0 500 500"
                  className="w-full h-full overflow-visible opacity-55"
                >
                  <ellipse
                    cx="250"
                    cy="255"
                    rx="205"
                    ry="82"
                    transform="rotate(-18 250 255)"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="1.5"
                    strokeDasharray="6 4"
                    filter="drop-shadow(0 0 8px #38bdf8)"
                  />
                </svg>
              </div>

              <RubikCube3D
                controller={controller}
                hoveredFace={hoveredFace}
                onHoverFace={setHoveredFace}
                counterClockwise={counterClockwise}
                className="w-full h-full"
              />
            </div>
          </div>

          {/* 3. RIGHT COLUMN: 2D Circular Mathematical Projection */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center relative z-20">
            {/* 2D Projection Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-cyan-500/30 text-xs font-bold text-slate-200 shadow-sm backdrop-blur-md mb-2">
              <span className="text-cyan-400">⭕</span>
              <span>2D Proyección</span>
            </div>

            {/* 2D Projection Viewport */}
            <div className="relative w-full aspect-square max-w-[360px] sm:max-w-[420px] flex items-center justify-center">
              <RubikCircularSvg
                controller={controller}
                showHeader={false}
                showControls={false}
                hoveredFace={hoveredFace}
                onHoverFace={setHoveredFace}
                counterClockwiseMode={counterClockwise}
                className="bg-transparent border-0 shadow-none p-0 w-full h-full"
              />
            </div>
          </div>
        </div>

        {/* Discreet Synchronized Controls Toolbar (Docked cleanly below the 3 columns) */}
        <div className="w-full max-w-4xl mx-auto mt-6 lg:mt-8 pt-3 relative z-20 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/70 backdrop-blur-md rounded-2xl px-4 py-2.5 border border-white/10 shadow-lg">
          {/* Face Rotation Buttons (U, D, L, R, F, B) */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {FACES.map((face) => (
              <button
                key={face}
                type="button"
                onClick={() => handleFaceTurn(face)}
                onMouseEnter={() => setHoveredFace(face)}
                onMouseLeave={() => setHoveredFace(null)}
                disabled={isBusy}
                title={`Girar capa ${FACE_PALETTE[face].label}`}
                className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-800/90 hover:bg-slate-700 active:scale-95 disabled:opacity-50 text-white border border-white/10 hover:border-cyan-400/50 transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: FACE_PALETTE[face].fill }}
                />
                <span>{counterClockwise ? `${face}'` : face}</span>
              </button>
            ))}

            <button
              type="button"
              onClick={() => setCounterClockwise((prev) => !prev)}
              aria-pressed={counterClockwise}
              title="Alternar sentido horario (90°) / antihorario (-90°)"
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                counterClockwise
                  ? "bg-indigo-600/30 border-indigo-400/50 text-indigo-200"
                  : "bg-slate-800/70 border-white/10 text-slate-300 hover:text-white"
              }`}
            >
              {counterClockwise ? "↺ Antihorario" : "↻ Horario"}
            </button>
          </div>

          {/* Actions & Status */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => controller.scramble()}
              disabled={isBusy}
              className="py-1 px-2.5 rounded-lg text-xs font-bold bg-blue-600/20 hover:bg-blue-600/35 active:scale-95 disabled:opacity-40 text-blue-300 border border-blue-500/30 transition-all flex items-center gap-1 cursor-pointer"
            >
              <span>⇄</span>
              <span>Mezclar</span>
            </button>

            <button
              type="button"
              onClick={() => controller.undo()}
              disabled={history.length === 0 || isBusy}
              className="py-1 px-2.5 rounded-lg text-xs font-bold bg-slate-800/80 hover:bg-slate-700 active:scale-95 disabled:opacity-40 disabled:pointer-events-none text-slate-200 border border-white/10 transition-all flex items-center gap-1 cursor-pointer"
            >
              <span>↶</span>
              <span>Deshacer</span>
            </button>

            <button
              type="button"
              onClick={() => controller.reset()}
              disabled={(isSolved && history.length === 0) || isBusy}
              className="py-1 px-2.5 rounded-lg text-xs font-bold bg-slate-800/80 hover:bg-slate-700 active:scale-95 disabled:opacity-40 disabled:pointer-events-none text-slate-200 border border-white/10 transition-all flex items-center gap-1 cursor-pointer"
            >
              <span>⟲</span>
              <span>Reiniciar</span>
            </button>

            <div className="h-4 w-[1px] bg-white/10 mx-1 hidden sm:block" />

            {/* State status indicator */}
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  isSolved
                    ? "bg-emerald-400 shadow-[0_0_8px_#34d399]"
                    : "bg-blue-400 animate-pulse shadow-[0_0_8px_#60a5fa]"
                }`}
              />
              <span className="text-[11px] font-semibold text-slate-300">
                {isSolved ? "Resuelto (54/54)" : `${history.length} mov.`}
              </span>
              {transition && (
                <span className="text-[10px] font-mono text-cyan-400 px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                  {transition.move}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default InteractiveHero;
