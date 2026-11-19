"use client";

import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  forwardRef,
} from "react";
import {
  applyMove,
  createSolvedCube,
  FACES,
  generateScramble,
  invertMove,
  isCubeSolved,
  MOVE_PERMUTATIONS,
  STICKER_METADATA,
} from "@/lib/rubik/engine";
import {
  CIRCLE_ORBITS,
  FACE_BUNDLE_MAP,
  FACE_CLUSTER_CENTERS,
  interpolateStickerPosition,
  Point2D,
  STICKER_2D_POSITIONS,
  SVG_VIEWBOX_SIZE,
} from "@/lib/rubik/circularGeometry";
import { BaseMove, CubeState, FaceId, Move } from "@/lib/rubik/types";

export interface RubikCircularHandle {
  triggerDemoSequence: () => void;
  scramble: () => void;
  undo: () => void;
  reset: () => void;
}

const FACE_COLORS: Record<FaceId, { fill: string; stroke: string; label: string }> = {
  U: { fill: "#facc15", stroke: "#fef08a", label: "Superior (U)" },
  D: { fill: "#ef4444", stroke: "#fca5a5", label: "Inferior (D)" },
  L: { fill: "#3b82f6", stroke: "#93c5fd", label: "Izquierda (L)" },
  R: { fill: "#ec4899", stroke: "#f9a8d4", label: "Derecha (R)" },
  F: { fill: "#22c55e", stroke: "#86efac", label: "Frontal (F)" },
  B: { fill: "#06b6d4", stroke: "#67e8f9", label: "Posterior (B)" },
};

interface ActiveAnimation {
  readonly move: Move;
  readonly baseFace: BaseMove;
  readonly startTime: number;
  readonly durationMs: number;
  readonly recordInHistory: boolean;
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export const RubikCircularSvg = forwardRef<RubikCircularHandle>(
  function RubikCircularSvg(_, ref) {
    const [cubeState, setCubeState] = useState<CubeState>(() => createSolvedCube());
    const [history, setHistory] = useState<Move[]>([]);
    const [hoveredFace, setHoveredFace] = useState<FaceId | null>(null);
    const [counterClockwiseMode, setCounterClockwiseMode] = useState(false);
    const [reducedMotion, setReducedMotion] = useState(false);
    const [isVisible, setIsVisible] = useState(true);

    // Animation state (progress in [0, 1] for the currently active move)
    const [animState, setAnimState] = useState<{
      move: Move;
      baseFace: BaseMove;
      progress: number;
    } | null>(null);

    const containerRef = useRef<HTMLDivElement | null>(null);
    const queueRef = useRef<
      Array<{ move: Move; durationMs: number; recordInHistory: boolean }>
    >([]);
    const activeAnimRef = useRef<ActiveAnimation | null>(null);
    const rafIdRef = useRef<number | null>(null);
    const hasPlayedIntroRef = useRef(false);

    // Detect prefers-reduced-motion
    useEffect(() => {
      if (typeof window === "undefined" || !window.matchMedia) return;
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      setReducedMotion(mq.matches);

      const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
      mq.addEventListener("change", handler);
      return () => mq.removeEventListener("change", handler);
    }, []);

    // IntersectionObserver to pause animations when off-screen
    useEffect(() => {
      const el = containerRef.current;
      if (!el || typeof IntersectionObserver === "undefined") return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          setIsVisible(entry.isIntersecting);
        },
        { threshold: 0.1 }
      );
      observer.observe(el);
      return () => observer.disconnect();
    }, []);

    const processNextInQueue = useCallback(() => {
      if (activeAnimRef.current || queueRef.current.length === 0) return;

      const nextItem = queueRef.current.shift()!;
      const baseFace = nextItem.move[0] as BaseMove;

      if (reducedMotion || !isVisible) {
        setCubeState((prev) => applyMove(prev, nextItem.move));
        if (nextItem.recordInHistory) {
          setHistory((prev) => [...prev, nextItem.move]);
        }
        if (queueRef.current.length > 0) {
          processNextInQueue();
        }
        return;
      }

      const startTime = performance.now();
      activeAnimRef.current = {
        move: nextItem.move,
        baseFace,
        startTime,
        durationMs: nextItem.durationMs,
        recordInHistory: nextItem.recordInHistory,
      };

      const step = (now: number) => {
        const current = activeAnimRef.current;
        if (!current) return;

        const elapsed = now - current.startTime;
        const rawProgress = Math.min(1, Math.max(0, elapsed / current.durationMs));
        const easedProgress = easeInOutCubic(rawProgress);

        if (rawProgress < 1) {
          setAnimState({
            move: current.move,
            baseFace: current.baseFace,
            progress: easedProgress,
          });
          rafIdRef.current = requestAnimationFrame(step);
        } else {
          // Commit discrete group permutation to cubeState
          const finishedMove = current.move;
          const shouldRecord = current.recordInHistory;
          activeAnimRef.current = null;
          setAnimState(null);
          setCubeState((prev) => applyMove(prev, finishedMove));
          if (shouldRecord) {
            setHistory((prev) => [...prev, finishedMove]);
          }
          processNextInQueue();
        }
      };

      rafIdRef.current = requestAnimationFrame(step);
    }, [reducedMotion, isVisible]);

    // Cleanup RAF on unmount
    useEffect(() => {
      return () => {
        if (rafIdRef.current !== null) {
          cancelAnimationFrame(rafIdRef.current);
        }
      };
    }, []);

    const enqueueMoves = useCallback(
      (
        moves: readonly Move[],
        options: { durationMs?: number; recordInHistory?: boolean } = {}
      ) => {
        const durationMs = options.durationMs ?? 380;
        const recordInHistory = options.recordInHistory ?? true;

        for (const move of moves) {
          queueRef.current.push({ move, durationMs, recordInHistory });
        }
        processNextInQueue();
      },
      [processNextInQueue]
    );

    // Subtle, non-infinite initial entry animation (2 moves + 2 inverse moves -> stable state)
    useEffect(() => {
      if (hasPlayedIntroRef.current || reducedMotion) return;
      hasPlayedIntroRef.current = true;

      const timer = setTimeout(() => {
        enqueueMoves(["R", "U", "U'", "R'"], {
          durationMs: 420,
          recordInHistory: false,
        });
      }, 350);

      return () => clearTimeout(timer);
    }, [enqueueMoves, reducedMotion]);

    const handleFaceTurn = useCallback(
      (face: FaceId, forceInverse?: boolean) => {
        const useInverse = forceInverse ?? counterClockwiseMode;
        const move: Move = useInverse ? (`${face}'` as Move) : face;
        enqueueMoves([move], { durationMs: 360, recordInHistory: true });
      },
      [counterClockwiseMode, enqueueMoves]
    );

    const handleScramble = useCallback(() => {
      queueRef.current = [];
      const seq = generateScramble(7);
      enqueueMoves(seq, { durationMs: 220, recordInHistory: true });
    }, [enqueueMoves]);

    const handleUndo = useCallback(() => {
      if (activeAnimRef.current || queueRef.current.length > 0) return;
      if (history.length === 0) return;

      const lastMove = history[history.length - 1];
      const inverse = invertMove(lastMove);
      setHistory((prev) => prev.slice(0, -1));
      enqueueMoves([inverse], { durationMs: 320, recordInHistory: false });
    }, [history, enqueueMoves]);

    const handleReset = useCallback(() => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
      queueRef.current = [];
      activeAnimRef.current = null;
      setAnimState(null);
      setHistory([]);
      setCubeState(createSolvedCube());
    }, []);

    const triggerDemoSequence = useCallback(() => {
      if (activeAnimRef.current || queueRef.current.length > 0) return;
      enqueueMoves(["U", "R", "F", "F'", "R'", "U'"], {
        durationMs: 340,
        recordInHistory: false,
      });
    }, [enqueueMoves]);

    useImperativeHandle(
      ref,
      () => ({
        triggerDemoSequence,
        scramble: handleScramble,
        undo: handleUndo,
        reset: handleReset,
      }),
      [triggerDemoSequence, handleScramble, handleUndo, handleReset]
    );

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      const key = e.key.toUpperCase();
      if (FACES.includes(key as FaceId)) {
        e.preventDefault();
        handleFaceTurn(key as FaceId, e.shiftKey);
      } else if (e.key === "Backspace") {
        e.preventDefault();
        handleUndo();
      }
    };

    const solved = isCubeSolved(cubeState) && !animState;
    const activeBundle = animState
      ? FACE_BUNDLE_MAP[animState.baseFace].activeBundle
      : hoveredFace
      ? FACE_BUNDLE_MAP[hoveredFace].activeBundle
      : null;

    // Compute current 2D coordinates for all 54 stickers
    const currentPositions: Point2D[] = STICKER_2D_POSITIONS.map((pos, idx) => {
      if (!animState) {
        return { x: pos.x, y: pos.y };
      }
      const perm = MOVE_PERMUTATIONS[animState.move];
      const destIdx = perm[idx];
      return interpolateStickerPosition(
        idx,
        destIdx,
        animState.baseFace,
        animState.progress
      );
    });

    return (
      <div
        ref={containerRef}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        aria-label="Simulador matemático circular del Cubo de Rubik 3x3x3. Usa los botones o las teclas U, D, L, R, F, B para rotar las capas."
        className="relative w-full max-w-[540px] mx-auto flex flex-col items-center select-none outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60 rounded-3xl p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-[0_0_50px_rgba(15,23,42,0.9)]"
      >
        {/* Status header bar */}
        <div className="w-full flex items-center justify-between px-2 mb-1 text-xs">
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                solved
                  ? "bg-emerald-400 shadow-[0_0_8px_#34d399]"
                  : "bg-blue-400 animate-pulse shadow-[0_0_8px_#60a5fa]"
              }`}
            />
            <span className="font-semibold text-slate-300 tracking-wide">
              {solved
                ? "Estado Canónico Resuelto (54/54)"
                : `Movimientos aplicados: ${history.length}`}
            </span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
            Grupo S₅₄ · 9 Órbitas
          </span>
        </div>

        {/* Interactive SVG Canvas */}
        <div className="relative w-full aspect-square max-w-[460px] flex items-center justify-center touch-manipulation">
          <svg
            viewBox={`0 0 ${SVG_VIEWBOX_SIZE} ${SVG_VIEWBOX_SIZE}`}
            className="w-full h-full overflow-visible"
            role="img"
            aria-label="Proyección circular de 9 órbitas y 54 posiciones del cubo de Rubik"
          >
            <defs>
              <radialGradient id="rubikAmbientGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.16" />
                <stop offset="65%" stopColor="#6366f1" stopOpacity="0.05" />
                <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Ambient mathematical backdrop */}
            <circle
              cx={SVG_VIEWBOX_SIZE / 2}
              cy={SVG_VIEWBOX_SIZE / 2}
              r={260}
              fill="url(#rubikAmbientGlow)"
            />

            {/* 9 Circular Orbital Trajectories */}
            <g className="pointer-events-none">
              {CIRCLE_ORBITS.map((orbit) => {
                const isHighlighted = activeBundle === orbit.bundle;
                return (
                  <circle
                    key={orbit.id}
                    cx={orbit.cx}
                    cy={orbit.cy}
                    r={orbit.r}
                    fill="none"
                    stroke={isHighlighted ? "#60a5fa" : "#64748b"}
                    strokeOpacity={isHighlighted ? 0.65 : 0.32}
                    strokeWidth={isHighlighted ? 2 : 1.25}
                    className="transition-colors duration-200"
                  />
                );
              })}
            </g>

            {/* Clickable Face Cluster Hit Zones (6 Faces) */}
            <g>
              {FACES.map((face) => {
                const center = FACE_CLUSTER_CENTERS[face];
                const isHovered = hoveredFace === face;
                return (
                  <g
                    key={`cluster-${face}`}
                    onClick={(e) => handleFaceTurn(face, e.shiftKey)}
                    onMouseEnter={() => setHoveredFace(face)}
                    onMouseLeave={() => setHoveredFace(null)}
                    className="cursor-pointer"
                    role="button"
                    tabIndex={-1}
                    aria-label={`Girar capa ${FACE_COLORS[face].label}`}
                  >
                    <circle
                      cx={center.x}
                      cy={center.y}
                      r={44}
                      fill={FACE_COLORS[face].fill}
                      fillOpacity={isHovered ? 0.12 : 0.02}
                      stroke={FACE_COLORS[face].fill}
                      strokeOpacity={isHovered ? 0.45 : 0}
                      strokeWidth={1.5}
                      strokeDasharray="4 3"
                    />
                  </g>
                );
              })}
            </g>

            {/* 54 Colored Sticker Nodes */}
            <g>
              {STICKER_METADATA.map((meta) => {
                const colorFace = cubeState[meta.index];
                const palette = FACE_COLORS[colorFace];
                const pt = currentPositions[meta.index];
                const isCenter = meta.role === "center";

                return (
                  <g
                    key={meta.index}
                    transform={`translate(${pt.x}, ${pt.y})`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFaceTurn(meta.face, e.shiftKey);
                    }}
                    onMouseEnter={() => setHoveredFace(meta.face)}
                    onMouseLeave={() => setHoveredFace(null)}
                    className="cursor-pointer"
                  >
                    <circle
                      r={isCenter ? 10.5 : 9}
                      fill={palette.fill}
                      stroke="#0f172a"
                      strokeWidth={2}
                    />
                    <circle
                      r={isCenter ? 10.5 : 9}
                      fill="none"
                      stroke={palette.stroke}
                      strokeOpacity={0.65}
                      strokeWidth={1}
                    />
                    {isCenter && (
                      <text
                        textAnchor="middle"
                        dominantBaseline="central"
                        fill="#0f172a"
                        fontSize="9"
                        fontWeight="800"
                        className="pointer-events-none select-none"
                      >
                        {meta.face}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
          </svg>
        </div>

        {/* Layer Rotation Quick Controls (U, D, L, R, F, B) */}
        <div className="w-full flex flex-col gap-2.5 mt-1">
          <div className="flex items-center justify-between gap-1.5 flex-wrap">
            <div className="flex items-center gap-1.5 flex-wrap">
              {FACES.map((face) => (
                <button
                  key={face}
                  type="button"
                  onClick={() => handleFaceTurn(face)}
                  onMouseEnter={() => setHoveredFace(face)}
                  onMouseLeave={() => setHoveredFace(null)}
                  title={`Girar capa ${FACE_COLORS[face].label}`}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-slate-800/90 hover:bg-slate-700 text-white border border-white/10 hover:border-blue-400/50 transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: FACE_COLORS[face].fill }}
                  />
                  <span>{counterClockwiseMode ? `${face}'` : face}</span>
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setCounterClockwiseMode((prev) => !prev)}
              aria-pressed={counterClockwiseMode}
              title="Alternar sentido horario (90°) / antihorario (-90°)"
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                counterClockwiseMode
                  ? "bg-indigo-600/30 border-indigo-400/50 text-indigo-200"
                  : "bg-slate-800/60 border-white/10 text-slate-300 hover:text-white"
              }`}
            >
              {counterClockwiseMode ? "↺ Antihorario" : "↻ Horario"}
            </button>
          </div>

          {/* Primary User Controls: Mezclar, Deshacer, Reiniciar */}
          <div className="grid grid-cols-3 gap-2 pt-1 border-t border-white/10">
            <button
              type="button"
              onClick={handleScramble}
              className="py-2 px-3 rounded-xl text-xs font-bold bg-blue-600/20 hover:bg-blue-600/35 text-blue-300 border border-blue-500/30 transition-all flex items-center justify-center gap-1.5"
            >
              <span>⇄</span>
              <span>Mezclar</span>
            </button>

            <button
              type="button"
              onClick={handleUndo}
              disabled={history.length === 0 || !!animState}
              className="py-2 px-3 rounded-xl text-xs font-bold bg-slate-800/80 hover:bg-slate-700/80 disabled:opacity-40 disabled:pointer-events-none text-slate-200 border border-white/10 transition-all flex items-center justify-center gap-1.5"
            >
              <span>↶</span>
              <span>Deshacer</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              disabled={solved && history.length === 0}
              className="py-2 px-3 rounded-xl text-xs font-bold bg-slate-800/80 hover:bg-slate-700/80 disabled:opacity-40 disabled:pointer-events-none text-slate-200 border border-white/10 transition-all flex items-center justify-center gap-1.5"
            >
              <span>⟲</span>
              <span>Reiniciar</span>
            </button>
          </div>
        </div>
      </div>
    );
  }
);
