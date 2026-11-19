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

type ViewMode = "dual" | "3d" | "2d";

export function InteractiveHero() {
  // Single shared mathematical controller driving both 2D and 3D representations
  const controller = useMemo(() => new RubikController(), []);
  const visualizerSectionRef = useRef<HTMLDivElement | null>(null);

  // Synchronized state hook (useSyncExternalStore)
  const { history, isSolved, isBusy, transition } = useRubikSync(controller);

  // Interactive UI controls
  const [viewMode, setViewMode] = useState<ViewMode>("dual");
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

  // Subtle intro sequence to show live synchronization immediately on page load
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
    <section className="relative min-h-[85vh] lg:min-h-[92vh] flex flex-col justify-center overflow-x-hidden bg-[#0f172a] bg-grid-white py-12 lg:py-16">
      {/* Background Chromatic Ambient Glows */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[8%] left-[4%] w-80 h-80 bg-blue-600/20 rounded-full blur-[130px] animate-blob" />
        <div className="absolute bottom-[10%] right-[4%] w-96 h-96 bg-indigo-600/20 rounded-full blur-[140px] animate-blob animation-delay-2000" />
        <div className="absolute top-[40%] right-[22%] w-64 h-64 bg-cyan-600/10 rounded-full blur-[110px] animate-blob animation-delay-4000" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Brand Statement, CTAs & Preserved Infinity Identity */}
          <div className="lg:col-span-5 flex flex-col gap-6 lg:gap-7 relative z-20">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold tracking-widest uppercase w-fit">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
              </span>
              <span>Ingeniería · Matemáticas · Software</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.08] tracking-tight">
              La lógica en{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 text-glow">
                movimiento.
              </span>
            </h1>

            {/* Enterprise Description */}
            <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed font-normal">
              Transformamos ideas en soluciones digitales mediante matemáticas,
              creatividad y desarrollo de software.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              <button
                type="button"
                onClick={handleExploreExperience}
                className="px-6 py-3.5 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-600/25 hover:shadow-blue-500/40 transition-all duration-300 flex items-center gap-2.5 cursor-pointer active:scale-95"
              >
                <span>Explorar experiencia</span>
                <span aria-hidden="true">→</span>
              </button>

              <Link
                href="/servicios"
                className="px-6 py-3.5 rounded-2xl font-bold text-sm text-slate-200 hover:text-white bg-slate-900/70 hover:bg-slate-800/90 border border-white/15 hover:border-blue-400/40 transition-all duration-300"
              >
                Nuestros servicios
              </Link>
            </div>

            {/* Preserved Infinity Symbol Brand Element */}
            <div className="mt-2 pt-4 border-t border-white/10 flex items-center gap-4 max-w-lg">
              <div className="relative w-20 h-14 sm:w-24 sm:h-16 flex-shrink-0 rounded-2xl overflow-hidden bg-slate-900/70 border border-white/10 p-1.5 shadow-md group">
                <Image
                  src="/images/hero/inicio1_pw.png"
                  alt="ImpulsoGP Símbolo de Infinito"
                  fill
                  priority
                  sizes="96px"
                  className="object-contain transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <p className="text-xs sm:text-sm text-slate-400 leading-snug">
                <strong className="text-slate-200 font-semibold">
                  Dualidad matemática:
                </strong>{" "}
                cada giro opera en tiempo real sobre el espacio 3D WebGL (Three.js)
                y la proyección de 9 órbitas circulares del grupo $S_{54}$.
              </p>
            </div>
          </div>

          {/* Right Column: Unified 2D/3D Rubik Synchronized Showcase */}
          <div
            ref={visualizerSectionRef}
            className="lg:col-span-7 relative z-20 flex flex-col gap-3 w-full"
          >
            {/* Showcase Outer Card */}
            <div className="w-full rounded-3xl bg-slate-900/70 backdrop-blur-xl border border-white/10 shadow-[0_0_60px_rgba(15,23,42,0.95)] p-3 sm:p-5 flex flex-col gap-3">
              {/* Header: Mode Selector & Synchronized State Status */}
              <div className="flex items-center justify-between gap-2 flex-wrap pb-2 border-b border-white/10">
                {/* View Mode Tabs */}
                <div className="inline-flex items-center p-1 rounded-xl bg-slate-800/90 border border-white/10">
                  <button
                    type="button"
                    onClick={() => setViewMode("dual")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                      viewMode === "dual"
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <span>⚡</span>
                    <span className="hidden sm:inline">Vista Dual (3D + 2D)</span>
                    <span className="sm:hidden">Dual</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setViewMode("3d")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                      viewMode === "3d"
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <span>🧊</span>
                    <span>3D WebGL</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setViewMode("2d")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                      viewMode === "2d"
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <span>⭕</span>
                    <span>2D Órbitas</span>
                  </button>
                </div>

                {/* State Indicator */}
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      isSolved
                        ? "bg-emerald-400 shadow-[0_0_8px_#34d399]"
                        : "bg-blue-400 animate-pulse shadow-[0_0_8px_#60a5fa]"
                    }`}
                  />
                  <span className="text-xs font-semibold text-slate-300">
                    {isSolved
                      ? "Cubo Resuelto (54/54)"
                      : `Movimientos: ${history.length}`}
                  </span>
                  {transition && (
                    <span className="text-[11px] font-mono text-cyan-400 px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                      Giro: {transition.move}
                    </span>
                  )}
                </div>
              </div>

              {/* Viewport Area: Dual Split or Single */}
              <div className="w-full relative min-h-[360px] sm:min-h-[420px] flex items-center justify-center">
                {viewMode === "dual" && (
                  <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                    {/* Left: 3D Three.js WebGL with OrbitControls */}
                    <div className="relative flex flex-col items-center justify-center rounded-2xl bg-slate-950/40 border border-white/5 p-2 h-[320px] sm:h-[380px] overflow-hidden">
                      <div className="absolute top-2.5 left-3 z-10 flex items-center gap-1 text-[11px] font-mono text-slate-400">
                        <span className="text-blue-400 font-bold">🧊 3D WebGL:</span>
                        <span>Arrastra para rotar</span>
                      </div>
                      <RubikCube3D
                        controller={controller}
                        hoveredFace={hoveredFace}
                        onHoverFace={setHoveredFace}
                        counterClockwise={counterClockwise}
                        className="w-full h-full"
                      />
                    </div>

                    {/* Right: 2D Circular SVG Orbit Projection */}
                    <div className="relative flex flex-col items-center justify-center rounded-2xl bg-slate-950/40 border border-white/5 p-2 h-[320px] sm:h-[380px] overflow-hidden">
                      <div className="absolute top-2.5 left-3 z-10 flex items-center gap-1 text-[11px] font-mono text-slate-400">
                        <span className="text-cyan-400 font-bold">⭕ 2D Proyección:</span>
                        <span>9 Órbitas $S_{54}$</span>
                      </div>
                      <RubikCircularSvg
                        controller={controller}
                        showHeader={false}
                        showControls={false}
                        hoveredFace={hoveredFace}
                        onHoverFace={setHoveredFace}
                        counterClockwiseMode={counterClockwise}
                        className="bg-transparent border-0 shadow-none p-0 max-w-[340px]"
                      />
                    </div>
                  </div>
                )}

                {viewMode === "3d" && (
                  <div className="w-full h-[360px] sm:h-[420px] relative rounded-2xl bg-slate-950/40 border border-white/5 p-3 flex flex-col items-center justify-center overflow-hidden">
                    <div className="absolute top-3 left-4 z-10 flex items-center gap-1.5 text-xs font-mono text-slate-400">
                      <span className="text-blue-400 font-bold">🧊 Three.js WebGL:</span>
                      <span>Arrastra con el cursor o toque para explorar las 6 caras</span>
                    </div>
                    <RubikCube3D
                      controller={controller}
                      hoveredFace={hoveredFace}
                      onHoverFace={setHoveredFace}
                      counterClockwise={counterClockwise}
                      className="w-full h-full"
                    />
                  </div>
                )}

                {viewMode === "2d" && (
                  <div className="w-full h-[360px] sm:h-[420px] relative rounded-2xl bg-slate-950/40 border border-white/5 p-3 flex flex-col items-center justify-center overflow-hidden">
                    <div className="absolute top-3 left-4 z-10 flex items-center gap-1.5 text-xs font-mono text-slate-400">
                      <span className="text-cyan-400 font-bold">⭕ Proyección Circular:</span>
                      <span>54 intersecciones en 9 órbitas de simetría continua</span>
                    </div>
                    <RubikCircularSvg
                      controller={controller}
                      showHeader={false}
                      showControls={false}
                      hoveredFace={hoveredFace}
                      onHoverFace={setHoveredFace}
                      counterClockwiseMode={counterClockwise}
                      className="bg-transparent border-0 shadow-none p-0 max-w-[380px]"
                    />
                  </div>
                )}
              </div>

              {/* Unified Synchronized Controls Toolbar */}
              <div className="w-full flex flex-col gap-2.5 pt-2 border-t border-white/10">
                {/* Face Rotation Buttons (U, D, L, R, F, B) + Direction Switch */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
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
                        className="px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-800/90 hover:bg-slate-700 active:scale-95 disabled:opacity-50 text-white border border-white/10 hover:border-blue-400/50 transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
                      >
                        <span
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: FACE_PALETTE[face].fill }}
                        />
                        <span>{counterClockwise ? `${face}'` : face}</span>
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => setCounterClockwise((prev) => !prev)}
                    aria-pressed={counterClockwise}
                    title="Alternar sentido horario (90°) / antihorario (-90°)"
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      counterClockwise
                        ? "bg-indigo-600/30 border-indigo-400/50 text-indigo-200"
                        : "bg-slate-800/70 border-white/10 text-slate-300 hover:text-white"
                    }`}
                  >
                    {counterClockwise ? "↺ Antihorario" : "↻ Horario"}
                  </button>
                </div>

                {/* Primary Actions: Mezclar, Deshacer, Reiniciar, Demo */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => controller.scramble()}
                    disabled={isBusy}
                    className="py-2 px-3 rounded-xl text-xs font-bold bg-blue-600/20 hover:bg-blue-600/35 active:scale-95 disabled:opacity-40 text-blue-300 border border-blue-500/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>⇄</span>
                    <span>Mezclar</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => controller.undo()}
                    disabled={history.length === 0 || isBusy}
                    className="py-2 px-3 rounded-xl text-xs font-bold bg-slate-800/80 hover:bg-slate-700 active:scale-95 disabled:opacity-40 disabled:pointer-events-none text-slate-200 border border-white/10 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>↶</span>
                    <span>Deshacer</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => controller.reset()}
                    disabled={(isSolved && history.length === 0) || isBusy}
                    className="py-2 px-3 rounded-xl text-xs font-bold bg-slate-800/80 hover:bg-slate-700 active:scale-95 disabled:opacity-40 disabled:pointer-events-none text-slate-200 border border-white/10 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>⟲</span>
                    <span>Reiniciar</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => controller.triggerDemoSequence()}
                    disabled={isBusy}
                    className="py-2 px-3 rounded-xl text-xs font-bold bg-indigo-600/20 hover:bg-indigo-600/35 active:scale-95 disabled:opacity-40 text-indigo-300 border border-indigo-500/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>✦</span>
                    <span>Demo [R, U]</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default InteractiveHero;
