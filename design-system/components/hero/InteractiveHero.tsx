"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { RubikController } from "@/lib/rubik/controller";
import { useRubikSync } from "@/lib/rubik/useRubikSync";
import { RubikCircularSvg } from "@/components/hero/RubikCircularSvg";
import { RubikCube3D } from "@/components/hero/RubikCube3D";
import { FACES, invertMove } from "@/lib/rubik/engine";
import { FACE_PALETTE } from "@/lib/rubik/palette";
import { BaseMove, FaceId, Move } from "@/lib/rubik/types";

// Deterministic cosmic starfield for deep space atmosphere behind 3D & 2D views
const COSMIC_STARS = [
  { top: "5%", left: "8%", size: 1.5, opacity: 0.7, pulse: true },
  { top: "8%", left: "22%", size: 2, opacity: 0.85, pulse: false },
  { top: "12%", left: "38%", size: 1.5, opacity: 0.6, pulse: true },
  { top: "7%", left: "54%", size: 2, opacity: 0.9, pulse: false },
  { top: "11%", left: "72%", size: 1.5, opacity: 0.5, pulse: true },
  { top: "6%", left: "88%", size: 2.5, opacity: 0.85, pulse: false },
  { top: "16%", left: "95%", size: 1, opacity: 0.45, pulse: true },
  { top: "19%", left: "4%", size: 1.5, opacity: 0.6, pulse: false },
  { top: "24%", left: "16%", size: 2, opacity: 0.8, pulse: true },
  { top: "21%", left: "31%", size: 1.5, opacity: 0.55, pulse: false },
  { top: "27%", left: "48%", size: 2, opacity: 0.9, pulse: true },
  { top: "23%", left: "64%", size: 1.5, opacity: 0.65, pulse: false },
  { top: "29%", left: "81%", size: 2.5, opacity: 0.8, pulse: true },
  { top: "26%", left: "92%", size: 1.5, opacity: 0.5, pulse: false },
  { top: "34%", left: "10%", size: 2, opacity: 0.75, pulse: true },
  { top: "38%", left: "26%", size: 1.5, opacity: 0.6, pulse: false },
  { top: "36%", left: "42%", size: 2, opacity: 0.85, pulse: true },
  { top: "41%", left: "58%", size: 1.5, opacity: 0.7, pulse: false },
  { top: "37%", left: "75%", size: 2.5, opacity: 0.9, pulse: true },
  { top: "43%", left: "89%", size: 1.5, opacity: 0.55, pulse: false },
  { top: "49%", left: "6%", size: 1, opacity: 0.4, pulse: false },
  { top: "52%", left: "19%", size: 2, opacity: 0.8, pulse: true },
  { top: "48%", left: "35%", size: 1.5, opacity: 0.65, pulse: false },
  { top: "55%", left: "52%", size: 2, opacity: 0.75, pulse: true },
  { top: "51%", left: "68%", size: 1.5, opacity: 0.6, pulse: false },
  { top: "57%", left: "84%", size: 2, opacity: 0.85, pulse: true },
  { top: "62%", left: "94%", size: 1.5, opacity: 0.5, pulse: false },
  { top: "66%", left: "14%", size: 2, opacity: 0.7, pulse: true },
  { top: "69%", left: "28%", size: 1.5, opacity: 0.6, pulse: false },
  { top: "64%", left: "45%", size: 2.5, opacity: 0.9, pulse: true },
  { top: "71%", left: "61%", size: 1.5, opacity: 0.55, pulse: false },
  { top: "67%", left: "77%", size: 2, opacity: 0.8, pulse: true },
  { top: "73%", left: "91%", size: 1.5, opacity: 0.6, pulse: false },
  { top: "78%", left: "8%", size: 2, opacity: 0.75, pulse: true },
  { top: "82%", left: "23%", size: 1.5, opacity: 0.5, pulse: false },
  { top: "79%", left: "39%", size: 2, opacity: 0.85, pulse: true },
  { top: "85%", left: "55%", size: 1.5, opacity: 0.6, pulse: false },
  { top: "81%", left: "71%", size: 2, opacity: 0.75, pulse: true },
  { top: "86%", left: "86%", size: 1.5, opacity: 0.65, pulse: false },
  { top: "90%", left: "16%", size: 1.5, opacity: 0.5, pulse: false },
  { top: "88%", left: "48%", size: 2, opacity: 0.8, pulse: true },
  { top: "92%", left: "78%", size: 1.5, opacity: 0.55, pulse: false },
];

export function InteractiveHero() {
  // Single shared mathematical controller driving both 2D and 3D representations
  const controller = useMemo(() => new RubikController(), []);
  const visualizerSectionRef = useRef<HTMLDivElement | null>(null);

  // Synchronized state hook (useSyncExternalStore)
  const { history, isSolved, isBusy, transition } = useRubikSync(controller);

  // Interactive UI controls
  const [hoveredFace, setHoveredFace] = useState<FaceId | null>(null);
  const [counterClockwise, setCounterClockwise] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const userInteractedRef = useRef(false);

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

  // Continuous auto-demonstration cycle:
  // 1. Starts scrambled on entrance (6 moves)
  // 2. Immediately upon entering (~350ms), solves in ~2.6s (total ~3s)
  // 3. Pauses ~3s in solved state
  // 4. Disassembles with 6 moves in ~2s
  // 5. Pauses ~1.8s, then re-solves in ~2.6s
  // 6. Yields automatically if the user interacts manually with the controls
  useEffect(() => {
    const demoScramble: Move[] = ["R", "U", "F'", "L", "D'", "R'"];
    const demoSolve: Move[] = demoScramble.slice().reverse().map(invertMove);

    // Apply scramble instantly on arrival so cube begins scrambled
    for (const m of demoScramble) {
      controller.applyInstant(m, false);
    }

    let isMounted = true;
    let cycleTimer: ReturnType<typeof setTimeout> | null = null;

    const runSolve = () => {
      if (!isMounted || userInteractedRef.current) return;
      controller.enqueueMoves(demoSolve, { durationMs: 440, recordInHistory: false });

      // After solve finishes (~2.64s), pause 3s, then disassemble
      cycleTimer = setTimeout(runScramble, 2640 + 3000);
    };

    const runScramble = () => {
      if (!isMounted || userInteractedRef.current) return;
      controller.enqueueMoves(demoScramble, { durationMs: 360, recordInHistory: false });

      // After scramble finishes (~2.16s), pause 1.8s, then re-solve
      cycleTimer = setTimeout(runSolve, 2160 + 1800);
    };

    // First auto-solve starts right after entering the page
    cycleTimer = setTimeout(runSolve, 350);

    return () => {
      isMounted = false;
      if (cycleTimer) clearTimeout(cycleTimer);
    };
  }, [controller]);

  const handleExploreExperience = () => {
    userInteractedRef.current = true;
    setShowControls(true);
    if (visualizerSectionRef.current) {
      visualizerSectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
    controller.triggerDemoSequence();
  };

  const handleFaceTurn = (face: BaseMove) => {
    userInteractedRef.current = true;
    controller.turn(face, counterClockwise);
  };

  return (
    <section className="relative min-h-[90vh] lg:min-h-[94vh] flex flex-col justify-between overflow-x-hidden bg-[#070d1e] pt-8 pb-12 lg:py-14 select-none">
      {/* Deep Space Background Layer with Twinkling Stars & Cosmic Nebulae */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[8%] left-[4%] w-80 h-80 bg-blue-600/15 rounded-full blur-[130px] animate-blob" />
        <div className="absolute bottom-[10%] right-[4%] w-96 h-96 bg-indigo-600/15 rounded-full blur-[140px] animate-blob animation-delay-2000" />
        <div className="absolute top-[35%] right-[20%] w-64 h-64 bg-cyan-600/10 rounded-full blur-[110px] animate-blob animation-delay-4000" />

        {/* Twinkling Cosmic Stars Field behind 3D and 2D */}
        <div className="absolute inset-0">
          {COSMIC_STARS.map((star, i) => (
            <span
              key={i}
              style={{
                top: star.top,
                left: star.left,
                width: `${star.size}px`,
                height: `${star.size}px`,
                opacity: star.opacity,
              }}
              className={`absolute rounded-full bg-white shadow-[0_0_4px_#ffffff] ${
                star.pulse ? "animate-pulse" : ""
              }`}
            />
          ))}
        </div>
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
            {/* Accent Cyan Vertical Bar + Clean Normal Headline matching the mockup */}
            <div className="flex items-center gap-3.5 pl-1">
              <div className="w-1.5 h-7 sm:h-8 rounded-full bg-cyan-400 shadow-[0_0_14px_#22d3ee] flex-shrink-0" />
              <h1 className="text-xl sm:text-2xl lg:text-[26px] font-normal sm:font-medium text-slate-100 tracking-wide select-text">
                Desarrollo y soluciones digitales...
              </h1>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3.5 pt-1">
              <button
                type="button"
                onClick={handleExploreExperience}
                className="px-7 py-3 rounded-full font-bold text-sm text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <span>Más...</span>
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>

          {/* 2. CENTER COLUMN: 3D Rubik's Cube WebGL */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center relative z-20">
            {/* 3D Cube Viewport with Orbital Glowing Ring */}
            <div className="relative w-full aspect-square max-w-[360px] sm:max-w-[400px] flex items-center justify-center">
              {/* Glowing Ambient Orbital Ring around the 3D Cube */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <svg
                  viewBox="0 0 500 500"
                  className="w-full h-full overflow-visible opacity-55 animate-pulse"
                  style={{ animationDuration: "5s" }}
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
            {/* 2D Projection Viewport with Grounding Glow */}
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
              {/* Subtle tech grounding reflection under 2D circular projection */}
              <div
                className="absolute -bottom-2 w-48 sm:w-60 h-3 rounded-full bg-cyan-500/15 blur-md pointer-events-none"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>

        {/* Collapsible Controls Toolbar Drawer (Hidden by default, expandable on demand) */}
        <div className="w-full max-w-4xl mx-auto mt-6 lg:mt-8 flex flex-col items-center relative z-20">
          {/* Discreet Toggle Button */}
          <button
            type="button"
            onClick={() => setShowControls((prev) => !prev)}
            aria-expanded={showControls}
            className="px-4 py-1.5 rounded-full text-xs font-semibold bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 hover:border-cyan-500/40 shadow-sm backdrop-blur-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            title={showControls ? "Ocultar barra de controles" : "Abrir barra de controles interactivos"}
          >
            <span className="text-cyan-400">⚙</span>
            <span>{showControls ? "Ocultar controles del simulador" : "Controles del simulador"}</span>
            <span className="text-[10px] text-slate-400">{showControls ? "▲" : "▼"}</span>
          </button>

          {/* Collapsible Controls Panel */}
          {showControls && (
            <div className="w-full mt-3 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/85 backdrop-blur-md rounded-2xl px-4 py-2.5 border border-white/10 shadow-xl transition-all duration-300 animate-fadeIn">
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
                  onClick={() => {
                    userInteractedRef.current = true;
                    controller.scramble();
                  }}
                  disabled={isBusy}
                  className="py-1 px-2.5 rounded-lg text-xs font-bold bg-blue-600/20 hover:bg-blue-600/35 active:scale-95 disabled:opacity-40 text-blue-300 border border-blue-500/30 transition-all flex items-center gap-1 cursor-pointer"
                >
                  <span>⇄</span>
                  <span>Mezclar</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    userInteractedRef.current = true;
                    controller.undo();
                  }}
                  disabled={history.length === 0 || isBusy}
                  className="py-1 px-2.5 rounded-lg text-xs font-bold bg-slate-800/80 hover:bg-slate-700 active:scale-95 disabled:opacity-40 disabled:pointer-events-none text-slate-200 border border-white/10 transition-all flex items-center gap-1 cursor-pointer"
                >
                  <span>↶</span>
                  <span>Deshacer</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    userInteractedRef.current = true;
                    controller.reset();
                  }}
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
          )}
        </div>
      </div>
    </section>
  );
}

export default InteractiveHero;
